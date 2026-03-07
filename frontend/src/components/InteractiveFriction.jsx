import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function FrictionBlob() {
    const meshRef = useRef();
    const { mouse } = useThree();
    const materialRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.15;
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
        
        // Smooth mouse follow
        const targetX = mouse.x * 2;
        const targetY = mouse.y * 2;
        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.03;
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.03;

        // Pulsating scale
        const scale = 1 + Math.sin(time * 0.5) * 0.08;
        meshRef.current.scale.set(scale, scale, scale);

        // Dynamic distortion
        if (materialRef.current) {
            materialRef.current.distort = 0.3 + Math.sin(time * 0.8) * 0.15;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
            <Sphere ref={meshRef} args={[1.2, 128, 128]}>
                <MeshDistortMaterial
                    ref={materialRef}
                    color="#06b6d4"
                    speed={4}
                    distort={0.35}
                    roughness={0.15}
                    metalness={0.8}
                    emissive="#06b6d4"
                    emissiveIntensity={0.15}
                />
            </Sphere>
        </Float>
    );
}

function InnerGlow() {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y = time * 0.3;
        meshRef.current.rotation.x = time * 0.2;
        const scale = 0.6 + Math.sin(time * 0.7) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);
    });

    return (
        <Sphere ref={meshRef} args={[1, 32, 32]}>
            <meshBasicMaterial color="#7928ca" transparent opacity={0.08} />
        </Sphere>
    );
}

const generateParticles = (count) => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 20 + Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        const xFactor = -50 + Math.random() * 100;
        const yFactor = -50 + Math.random() * 100;
        const zFactor = -50 + Math.random() * 100;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
};

function Particles() {
    const count = 1500;
    const mesh = useRef();
    
    const particles = useMemo(() => generateParticles(count), [count]);
    const dummy = useMemo(() => new THREE.Object3D(), []);


    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.max(0.3, Math.cos(t));
            particle.mx += (state.mouse.x * state.viewport.width - particle.mx) * 0.01;
            particle.my += (state.mouse.y * state.viewport.height - particle.my) * 0.01;
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#4ade80" opacity={0.4} transparent />
        </instancedMesh>
    );
}

// Orbiting ring effect
function OrbitalRing() {
    const ringRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.2) * 0.3;
        ringRef.current.rotation.z = time * 0.15;
    });

    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[2.5, 0.01, 16, 100]} />
            <meshBasicMaterial color="#00f2ea" transparent opacity={0.2} />
        </mesh>
    );
}

export default function InteractiveFriction() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'auto' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#00f2ea" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#7928ca" />
                <spotLight position={[0, 5, 0]} intensity={0.3} color="#4ade80" angle={0.5} />
                <FrictionBlob />
                <InnerGlow />
                <Particles />
                <OrbitalRing />
            </Canvas>
        </div>
    );
}
