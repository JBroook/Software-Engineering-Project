import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment } from '@react-three/drei';
import { Box, Spinner, Flex } from '@chakra-ui/react';

interface ModelPreviewProps {
    src: string | undefined;
}

function Model(props:ModelPreviewProps) {
  if (props.src){
    const { scene } = useGLTF(props.src);
    return <primitive object={scene} dispose={null} />;
  }
}

// Main viewer component
const ModelViewer = (props:ModelPreviewProps) => {
  return (
    <Flex w="100%" h="full" bg="gray.100" borderRadius="lg" background={'#626262'}>
        <Canvas camera={{ fov: 75, near: 1.5, far: 1000, position: [0, 0, 7] }}>
            <ambientLight intensity={1} />
            <directionalLight color="yellow" position={[0, 5, 5]} />
            <Suspense fallback={null}>
                <Model src={props.src} />
                <OrbitControls enableDamping dampingFactor={0.25} enableZoom enablePan />
            </Suspense>
        </Canvas>
    </Flex>
  );
};

export default ModelViewer;
