import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface RiskDataPoint {
  id: string;
  name: string;
  impact: number; // 0-10
  likelihood: number; // 0-10
  category: string;
  description?: string;
}

interface RiskHeatmapProps {
  data: RiskDataPoint[];
  width?: string | number;
  height?: string | number;
  title?: string;
}

const RiskCube = ({ 
  position, 
  size, 
  color, 
  risk, 
  hovered, 
  setHovered 
}: { 
  position: [number, number, number];
  size: number;
  color: string;
  risk: RiskDataPoint;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const isHovered = hovered === risk.id;
  
  // Simple animation - hover effect
  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.x = THREE.MathUtils.lerp(
        mesh.current.scale.x,
        isHovered ? 1.2 : 1,
        0.1
      );
      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        isHovered ? 1.2 : 1,
        0.1
      );
      mesh.current.scale.z = THREE.MathUtils.lerp(
        mesh.current.scale.z,
        isHovered ? 1.2 : 1,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(risk.id);
      }}
      onPointerOut={() => setHovered(null)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} />
      {isHovered && (
        <Html position={[0, size * 1.5, 0]} center style={{ width: '200px', pointerEvents: 'none' }}>
          <div className="bg-background/90 p-2 rounded shadow-lg text-xs border border-border">
            <p className="font-bold">{risk.name}</p>
            <p>Impact: {risk.impact}/10</p>
            <p>Likelihood: {risk.likelihood}/10</p>
            <p>Category: {risk.category}</p>
            {risk.description && <p className="mt-1 text-xs">{risk.description}</p>}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const AxisLabels = () => {
  return (
    <>
      {/* X-axis - Impact */}
      <Text
        position={[5, -0.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Impact
      </Text>
      
      {/* Y-axis - Risk Score */}
      <Text
        position={[-0.5, 5, 0]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Risk Score
      </Text>
      
      {/* Z-axis - Likelihood */}
      <Text
        position={[0, -0.5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Likelihood
      </Text>
    </>
  );
};

const RiskHeatmap3D = ({ data }: { data: RiskDataPoint[] }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Scale values to proper range for visualization (0-10 scale to 0-10 in 3D space)
  const getRiskCubes = () => {
    return data.map((risk) => {
      // Calculate position based on impact and likelihood
      const xPos = risk.impact;
      const zPos = risk.likelihood;
      
      // Calculate risk score (impact × likelihood) for height
      const riskScore = risk.impact * risk.likelihood / 10; // Scale down for better visualization
      const yPos = riskScore / 2; // Position at half height so bottom of cube sits on plane
      
      // Color based on risk score
      let color;
      if (riskScore < 30) color = 'green';
      else if (riskScore < 60) color = 'orange';
      else color = 'red';
      
      return (
        <RiskCube
          key={risk.id}
          position={[xPos, yPos, zPos]}
          size={1}
          color={color}
          risk={risk}
          hovered={hovered}
          setHovered={setHovered}
        />
      );
    });
  };
  
  // Grid helpers
  const GridLines = () => {
    return (
      <>
        <gridHelper args={[10, 10]} position={[5, 0, 5]} />
        {/* Vertical grid on back wall (impact axis) */}
        <gridHelper 
          args={[10, 10]} 
          position={[5, 5, 0]} 
          rotation={[Math.PI / 2, 0, 0]} 
        />
        {/* Vertical grid on side wall (likelihood axis) */}
        <gridHelper 
          args={[10, 10]} 
          position={[0, 5, 5]} 
          rotation={[Math.PI / 2, 0, Math.PI / 2]} 
        />
      </>
    );
  };

  return (
    <>
      {getRiskCubes()}
      <GridLines />
      <AxisLabels />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  );
};

export const ThreeDRiskHeatmap: React.FC<RiskHeatmapProps> = ({ 
  data, 
  width = '100%', 
  height = 500,
  title
}) => {
  // Default height if needed for responsive design
  const containerStyle = {
    width,
    height
  };
  
  return (
    <div className="3d-risk-heatmap">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <div style={containerStyle} className="border rounded-lg overflow-hidden">
        <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
          <color attach="background" args={['#f5f5f5']} />
          <RiskHeatmap3D data={data} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  );
};