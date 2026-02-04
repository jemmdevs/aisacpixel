import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';

function KatanaModel() {
    const { scene } = useGLTF('/katana.glb');
    const modelRef = useRef<THREE.Group>(null);
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        sectionRef.current = document.getElementById('katana-section');
    }, []);

    useFrame(() => {
        if (!sectionRef.current || !modelRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewHeight = window.innerHeight;
        const scrollableRange = sectionHeight - viewHeight;

        if (scrollableRange <= 0) return;

        // 0 cuando el top de la sección llega al viewport top, 1 cuando sale por arriba
        const progress = Math.max(0, Math.min(1, -rect.top / scrollableRange));

        // Rotación multi-eje driven por scroll
        modelRef.current.rotation.y = progress * Math.PI * 3;                              // 1.5 rotaciones en Y
        modelRef.current.rotation.x = Math.sin(progress * Math.PI * 2) * (Math.PI / 6);  // oscilación en X (2 ciclos, 30°)
        modelRef.current.rotation.z = Math.sin(progress * Math.PI) * (Math.PI / 8);      // arco sutil en Z (1 ciclo, 22°)
    });

    return (
        <Center>
            <group ref={modelRef}>
                <primitive object={scene} scale={0.1} />
            </group>
        </Center>
    );
}

function Loader() {
    return (
        <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#dc0000" wireframe />
        </mesh>
    );
}

export default function KatanaViewer() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 22], fov: 50 }}>
                <ambientLight intensity={2} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={1} />
                <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} />
                <Environment preset="studio" />
                <Suspense fallback={<Loader />}>
                    <KatanaModel />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload('/katana.glb');
