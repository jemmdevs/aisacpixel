import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';

function KatanaModel() {
    const { scene } = useGLTF('/katana.glb');
    const modelRef = useRef<THREE.Group>(null);
    const sectionRef = useRef<HTMLElement | null>(null);

    // Parallax: posición objetivo del cursor y posición interpolada
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseCurrent = useRef({ x: 0, y: 0 });

    useEffect(() => {
        sectionRef.current = document.getElementById('katana-section');

        const onMouseMove = (e: MouseEvent) => {
            // Normaliza a [-1, 1] desde el centro del viewport
            mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame(() => {
        if (!sectionRef.current || !modelRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewHeight = window.innerHeight;
        const scrollableRange = sectionHeight - viewHeight;

        if (scrollableRange <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollableRange));

        // --- Rotación por scroll ---
        const scrollRotY = progress * Math.PI * 3;
        const scrollRotX = Math.sin(progress * Math.PI * 2) * (Math.PI / 6);
        const scrollRotZ = Math.sin(progress * Math.PI) * (Math.PI / 8);

        // --- Parallax por cursor (lerp suave) ---
        const lerp = 0.06;
        mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * lerp;
        mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * lerp;

        // Inverted: cursor derecha → espada rota izquierda, cursor arriba → espada rota abajo
        const amp = Math.PI / 8; // ~22°
        const parallaxRotY = -mouseCurrent.current.x * amp;
        const parallaxRotX =  mouseCurrent.current.y * amp;

        // --- Combina scroll + parallax ---
        modelRef.current.rotation.y = scrollRotY + parallaxRotY;
        modelRef.current.rotation.x = scrollRotX + parallaxRotX;
        modelRef.current.rotation.z = scrollRotZ;
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
