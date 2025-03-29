import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Requirement {
  id: string;
  name: string;
  category: string;
  description: string;
  completed?: boolean;
  importance: 'high' | 'medium' | 'low';
  dependencies?: string[]; // Array of requirement IDs this requirement depends on
}

interface RequirementMapProps {
  data: Requirement[];
  width?: string | number;
  height?: string | number;
  title?: string;
}

/**
 * Helper to generate a 3D position in a circular layout
 */
const generateNodePosition = (index: number, total: number, radius: number, heightFactor: number = 0.2): [number, number, number] => {
  const angleStep = (2 * Math.PI) / total;
  const angle = index * angleStep;
  
  // Add some height variation based on importance
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = Math.sin(angle * 2) * heightFactor * radius; // Gentle wave pattern for height
  
  return [x, y, z];
};

/**
 * Force-directed positioning algorithm to spread out nodes while keeping related ones closer
 */
const useForceLayout = (requirements: Requirement[], initialRadius: number = 8) => {
  const [positions, setPositions] = useState<{[id: string]: [number, number, number]}>({});
  
  useEffect(() => {
    // Initialize positions in a circle
    const initialPositions: {[id: string]: [number, number, number]} = {};
    requirements.forEach((req, index) => {
      initialPositions[req.id] = generateNodePosition(index, requirements.length, initialRadius);
    });
    
    // Run force-directed algorithm
    let currentPositions = {...initialPositions};
    const iterations = 50; // Number of iterations for the algorithm
    
    for (let i = 0; i < iterations; i++) {
      const newPositions = {...currentPositions};
      
      // Apply repulsive forces between all nodes
      for (let a = 0; a < requirements.length; a++) {
        const reqA = requirements[a];
        const posA = currentPositions[reqA.id];
        
        let forceX = 0, forceY = 0, forceZ = 0;
        
        // Repulsive forces from all other nodes
        for (let b = 0; b < requirements.length; b++) {
          if (a === b) continue;
          
          const reqB = requirements[b];
          const posB = currentPositions[reqB.id];
          
          // Calculate distance
          const dx = posA[0] - posB[0];
          const dy = posA[1] - posB[1];
          const dz = posA[2] - posB[2];
          const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          // Skip if too far (optimization)
          if (distance > initialRadius * 2) continue;
          
          // Apply repulsive force (inverse square law)
          const force = 1 / (distance * distance);
          forceX += (dx / distance) * force;
          forceY += (dy / distance) * force;
          forceZ += (dz / distance) * force;
        }
        
        // Apply attractive forces for connected nodes
        if (reqA.dependencies) {
          for (const depId of reqA.dependencies) {
            const depPos = currentPositions[depId];
            if (!depPos) continue; // Skip if dependency not found
            
            // Calculate distance
            const dx = posA[0] - depPos[0];
            const dy = posA[1] - depPos[1];
            const dz = posA[2] - depPos[2];
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            // Skip if too close (optimization)
            if (distance < 0.1) continue;
            
            // Apply attractive force
            const force = distance * 0.05; // Linear attractive force
            forceX -= (dx / distance) * force;
            forceY -= (dy / distance) * force;
            forceZ -= (dz / distance) * force;
          }
        }
        
        // Apply forces with damping factor that decreases with iterations
        const damping = 0.1 * (1 - i / iterations);
        newPositions[reqA.id] = [
          posA[0] + forceX * damping,
          posA[1] + forceY * damping,
          posA[2] + forceZ * damping
        ];
      }
      
      currentPositions = newPositions;
    }
    
    setPositions(currentPositions);
  }, [requirements, initialRadius]);
  
  return positions;
};

// Node representing a single requirement
const RequirementNode = ({ 
  position, 
  requirement, 
  hovered, 
  setHovered,
  setSelected,
  isSelected
}: { 
  position: [number, number, number];
  requirement: Requirement;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  isSelected: boolean;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const isHovered = hovered === requirement.id;
  
  // Node sizing based on importance
  const getSize = () => {
    switch (requirement.importance) {
      case 'high': return 1;
      case 'medium': return 0.8;
      case 'low': return 0.6;
      default: return 0.7;
    }
  };
  
  // Node color based on category and completion status
  const getColor = () => {
    // If completed, show a green shade
    if (requirement.completed) {
      return '#4CAF50'; // Green
    }
    
    // Otherwise, color by category
    switch (requirement.category) {
      case 'governance': return '#673AB7'; // Deep Purple
      case 'technical': return '#2196F3'; // Blue
      case 'documentation': return '#FFC107'; // Amber
      case 'testing': return '#FF5722'; // Deep Orange
      case 'monitoring': return '#009688'; // Teal
      case 'transparency': return '#E91E63'; // Pink
      default: return '#9E9E9E'; // Grey
    }
  };
  
  // Animation effects
  useFrame(() => {
    if (mesh.current) {
      // Scale effect when hovered or selected
      const targetScale = isHovered ? 1.4 : isSelected ? 1.2 : 1;
      mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1);
      mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, targetScale, 0.1);
      mesh.current.scale.z = THREE.MathUtils.lerp(mesh.current.scale.z, targetScale, 0.1);
      
      // Pulsing effect for important items
      if (requirement.importance === 'high' && !isHovered && !isSelected) {
        const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 1;
        mesh.current.scale.x = pulse;
        mesh.current.scale.y = pulse;
        mesh.current.scale.z = pulse;
      }
      
      // Rotation for selected items
      if (isSelected) {
        mesh.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(requirement.id);
        }}
        onPointerOut={() => setHovered(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelected(isSelected ? null : requirement.id);
        }}
      >
        <sphereGeometry args={[getSize() * 0.5, 16, 16]} />
        <meshStandardMaterial 
          color={getColor()} 
          emissive={isSelected ? getColor() : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      
      {/* Always show a small label */}
      <Text
        position={[0, getSize() * 0.7, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {requirement.name.length > 15 ? `${requirement.name.slice(0, 15)}...` : requirement.name}
      </Text>
      
      {/* Detailed info on hover */}
      {isHovered && (
        <Html position={[0, getSize() * 1.5, 0]} center style={{ width: '250px', pointerEvents: 'none' }}>
          <div className="bg-background/90 p-3 rounded shadow-lg text-sm border border-border">
            <h4 className="font-bold text-base">{requirement.name}</h4>
            <p className="text-xs mt-1">{requirement.description}</p>
            <div className="mt-2 flex justify-between text-xs">
              <span className="capitalize">{requirement.category}</span>
              <span className="capitalize">{requirement.importance} importance</span>
            </div>
            {requirement.completed !== undefined && (
              <div className="mt-1 text-xs">
                Status: {requirement.completed ? 'Completed' : 'Pending'}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

// Connect dependent requirements with lines
const RequirementConnections = ({ 
  requirements, 
  positions, 
  selectedNode 
}: { 
  requirements: Requirement[];
  positions: {[id: string]: [number, number, number]};
  selectedNode: string | null;
}) => {
  const connectionLines = [];
  
  for (const req of requirements) {
    if (!req.dependencies || !positions[req.id]) continue;
    
    // Only show connections for the selected node or for all nodes if none selected
    const showThisConnection = !selectedNode || 
                               selectedNode === req.id || 
                               (req.dependencies && req.dependencies.includes(selectedNode));
    
    if (!showThisConnection) continue;
    
    for (const depId of req.dependencies) {
      if (!positions[depId]) continue;
      
      const startPos = positions[req.id];
      const endPos = positions[depId];
      
      const isHighlighted = selectedNode && (req.id === selectedNode || depId === selectedNode);
      
      connectionLines.push(
        <Line
          key={`${req.id}-${depId}`}
          points={[startPos, endPos]}
          color={isHighlighted ? "#FF4500" : "#9E9E9E"}
          lineWidth={isHighlighted ? 3 : 1}
          opacity={isHighlighted ? 1 : 0.5}
          dashed={false}
        />
      );
    }
  }
  
  return <>{connectionLines}</>;
};

// Main visualization component
const RequirementMap3D = ({ data }: { data: Requirement[] }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  
  // Use force-directed layout algorithm
  const positions = useForceLayout(data);
  
  // Only render when positions are calculated
  if (Object.keys(positions).length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Render connection lines first so they appear behind nodes */}
      <RequirementConnections 
        requirements={data} 
        positions={positions} 
        selectedNode={selected}
      />
      
      {/* Render all requirement nodes */}
      {data.map((req) => {
        if (!positions[req.id]) return null;
        
        return (
          <RequirementNode
            key={req.id}
            position={positions[req.id]}
            requirement={req}
            hovered={hovered}
            setHovered={setHovered}
            setSelected={setSelected}
            isSelected={selected === req.id}
          />
        );
      })}
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <hemisphereLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Environment sphere for orientation */}
      <mesh>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial color="#111" side={THREE.BackSide} transparent opacity={0.1} />
      </mesh>
      
      {/* Legend */}
      <group position={[-15, 10, 0]}>
        <Text position={[0, 2, 0]} fontSize={0.8} color="white" outlineWidth={0.05} outlineColor="black">
          EU AI Act Requirements
        </Text>
        
        <Text position={[0, 0.8, 0]} fontSize={0.5} color="white" outlineWidth={0.03} outlineColor="black">
          Categories:
        </Text>
        
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#673AB7" />
        </mesh>
        <Text position={[2, 0, 0]} fontSize={0.4} color="white" outlineWidth={0.03} outlineColor="black" anchorX="left">
          Governance
        </Text>
        
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#2196F3" />
        </mesh>
        <Text position={[2, -0.7, 0]} fontSize={0.4} color="white" outlineWidth={0.03} outlineColor="black" anchorX="left">
          Technical
        </Text>
        
        <mesh position={[0, -1.4, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#FFC107" />
        </mesh>
        <Text position={[2, -1.4, 0]} fontSize={0.4} color="white" outlineWidth={0.03} outlineColor="black" anchorX="left">
          Documentation
        </Text>
        
        <mesh position={[0, -2.1, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
        <Text position={[2, -2.1, 0]} fontSize={0.4} color="white" outlineWidth={0.03} outlineColor="black" anchorX="left">
          Completed
        </Text>
      </group>
    </>
  );
};

export const ThreeDRequirementMap: React.FC<RequirementMapProps> = ({ 
  data, 
  width = '100%', 
  height = 600,
  title
}) => {
  const containerStyle = {
    width,
    height
  };
  
  if (!data || data.length === 0) {
    return (
      <div style={containerStyle} className="border rounded-lg flex items-center justify-center p-6">
        <p className="text-muted-foreground">No requirement data available</p>
      </div>
    );
  }
  
  return (
    <div className="3d-requirement-map">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <div style={containerStyle} className="border rounded-lg overflow-hidden">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 50 }}
          dpr={[1, 2]} // Responsive pixel ratio
        >
          <color attach="background" args={['#121212']} />
          <RequirementMap3D data={data} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={30}
            minDistance={5}
          />
        </Canvas>
        <div className="absolute bottom-3 right-3 bg-background/80 text-sm p-2 rounded">
          <p>Click a node to highlight connections</p>
          <p>Drag to rotate, scroll to zoom</p>
        </div>
      </div>
    </div>
  );
};