import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import * as THREE from '../../utils/three-compatibility';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  complianceScore: number; // 0-100
  type: 'milestone' | 'deadline' | 'assessment' | 'implementation';
  status?: 'completed' | 'pending' | 'overdue' | 'in-progress';
}

interface ComplianceTimelineProps {
  data: TimelineEvent[];
  width?: string | number;
  height?: string | number;
  title?: string;
}

// Helper to convert date string to relative position on timeline
const dateToPosition = (dateStr: string, startDate: Date, endDate: Date, maxLength: number): number => {
  const date = new Date(dateStr);
  const totalDuration = endDate.getTime() - startDate.getTime();
  const eventPosition = date.getTime() - startDate.getTime();
  const relativePosition = (eventPosition / totalDuration) * maxLength;
  return relativePosition;
};

const TimelineNode = ({ 
  position, 
  event, 
  hovered, 
  setHovered 
}: { 
  position: [number, number, number];
  event: TimelineEvent;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const isHovered = hovered === event.id;
  
  // Color based on event type and status
  const getColor = () => {
    if (event.status === 'completed') return '#4CAF50'; // Green
    if (event.status === 'overdue') return '#F44336'; // Red
    if (event.status === 'in-progress') return '#2196F3'; // Blue
    
    // Colors by type if no status
    switch (event.type) {
      case 'milestone': return '#9C27B0'; // Purple
      case 'deadline': return '#FF9800'; // Orange
      case 'assessment': return '#03A9F4'; // Light Blue
      case 'implementation': return '#4CAF50'; // Green
      default: return '#9E9E9E'; // Grey
    }
  };
  
  // Shape based on event type
  const getGeometry = () => {
    switch (event.type) {
      case 'milestone': return <sphereGeometry args={[0.5, 16, 16]} />; // Sphere
      case 'deadline': return <boxGeometry args={[0.8, 0.8, 0.8]} />; // Cube
      case 'assessment': return <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />; // Cylinder
      case 'implementation': return <coneGeometry args={[0.5, 1, 16]} />; // Cone
      default: return <sphereGeometry args={[0.4, 16, 16]} />; // Default sphere
    }
  };
  
  // Use compliance score for height
  const yPos = (event.complianceScore / 10) + 0.5; // Scale down and add offset for visibility
  
  // Animation for hover
  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.x = THREE.MathUtils.lerp(
        mesh.current.scale.x,
        isHovered ? 1.5 : 1,
        0.1
      );
      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        isHovered ? 1.5 : 1,
        0.1
      );
      mesh.current.scale.z = THREE.MathUtils.lerp(
        mesh.current.scale.z,
        isHovered ? 1.5 : 1,
        0.1
      );
      
      if (isHovered) {
        mesh.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group position={position}>
      {/* Connect to timeline with a vertical line */}
      <Line 
        points={[[0, -yPos, 0], [0, 0, 0]]} 
        color={getColor()} 
        lineWidth={1}
      />
      
      <mesh
        ref={mesh}
        position={[0, yPos, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(event.id);
        }}
        onPointerOut={() => setHovered(null)}
      >
        {getGeometry()}
        <meshStandardMaterial color={getColor()} />
      </mesh>
      
      {/* Event date label below timeline */}
      <Text
        position={[0, -0.8, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {new Date(event.date).toLocaleDateString()}
      </Text>
      
      {isHovered && (
        <Html position={[0, yPos + 1.5, 0]} center style={{ width: '250px', pointerEvents: 'none' }}>
          <div className="bg-background/90 p-3 rounded shadow-lg text-sm border border-border">
            <h4 className="font-bold text-base">{event.title}</h4>
            <p className="text-xs mt-1">{event.description}</p>
            <div className="mt-2 flex justify-between text-xs">
              <span>Score: {event.complianceScore}%</span>
              <span className="capitalize">{event.status || event.type}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const TimelinePath = ({ length }: { length: number }) => {
  // Create a path for the timeline
  return (
    <group position={[0, 0, 0]}>
      {/* Main timeline line */}
      <Line
        points={[[-length/2, 0, 0], [length/2, 0, 0]]}
        color="black"
        lineWidth={2}
      />
      
      {/* Tick marks every 2 units */}
      {Array.from({ length: Math.floor(length/2) + 1 }).map((_, i) => (
        <Line
          key={`tick-${i}`}
          points={[
            [-length/2 + i*2, -0.2, 0],
            [-length/2 + i*2, 0.2, 0]
          ]}
          color="black"
          lineWidth={1}
        />
      ))}
    </group>
  );
};

const ComplianceTimeline3D = ({ data }: { data: TimelineEvent[] }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Sort events by date
  const sortedEvents = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Find date range for positioning
  const startDate = new Date(sortedEvents[0]?.date || new Date());
  const endDate = new Date(sortedEvents[sortedEvents.length - 1]?.date || new Date());
  
  // Add buffer to dates (10% on each side)
  const timeRange = endDate.getTime() - startDate.getTime();
  const bufferTime = timeRange * 0.1;
  const adjustedStartDate = new Date(startDate.getTime() - bufferTime);
  const adjustedEndDate = new Date(endDate.getTime() + bufferTime);
  
  // Timeline length
  const timelineLength = 20; // Fixed length for visualization
  
  // Generate timeline nodes
  const timelineNodes = sortedEvents.map((event) => {
    const xPos = dateToPosition(
      event.date,
      adjustedStartDate,
      adjustedEndDate,
      timelineLength
    ) - (timelineLength / 2); // Center the timeline
    
    return (
      <TimelineNode
        key={event.id}
        position={[xPos, 0, 0]}
        event={event}
        hovered={hovered}
        setHovered={setHovered}
      />
    );
  });

  return (
    <>
      <TimelinePath length={timelineLength} />
      {timelineNodes}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Start and end date labels */}
      <Text
        position={[-timelineLength/2, -1.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {adjustedStartDate.toLocaleDateString()}
      </Text>
      
      <Text
        position={[timelineLength/2, -1.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {adjustedEndDate.toLocaleDateString()}
      </Text>
      
      {/* Legend for types/statuses */}
      <group position={[-timelineLength/2, 4, 0]}>
        <Text position={[0, 0.8, 0]} fontSize={0.4} color="black" anchorX="left">
          Legend:
        </Text>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#9C27B0" />
        </mesh>
        <Text position={[0.5, 0, 0]} fontSize={0.3} color="black" anchorX="left">
          Milestone
        </Text>
        
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#FF9800" />
        </mesh>
        <Text position={[0.5, -0.6, 0]} fontSize={0.3} color="black" anchorX="left">
          Deadline
        </Text>
        
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
          <meshStandardMaterial color="#03A9F4" />
        </mesh>
        <Text position={[0.5, -1.2, 0]} fontSize={0.3} color="black" anchorX="left">
          Assessment
        </Text>
        
        <mesh position={[0, -1.8, 0]}>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshStandardMaterial color="#4CAF50" />
        </mesh>
        <Text position={[0.5, -1.8, 0]} fontSize={0.3} color="black" anchorX="left">
          Implementation
        </Text>
      </group>
    </>
  );
};

export const ThreeDComplianceTimeline: React.FC<ComplianceTimelineProps> = ({ 
  data, 
  width = '100%', 
  height = 500,
  title
}) => {
  const containerStyle = {
    width,
    height
  };
  
  if (!data || data.length === 0) {
    return (
      <div style={containerStyle} className="border rounded-lg flex items-center justify-center p-6">
        <p className="text-muted-foreground">No timeline data available</p>
      </div>
    );
  }
  
  return (
    <div className="3d-compliance-timeline">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <div style={containerStyle} className="border rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
          <color attach="background" args={['#f8f9fa']} />
          <ComplianceTimeline3D data={data} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2} // Restrict to top hemisphere
          />
        </Canvas>
      </div>
    </div>
  );
};