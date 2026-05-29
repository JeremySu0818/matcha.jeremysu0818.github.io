import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import { MatchaScene } from './components/scene/MatchaScene';
import { NarrativeOverlay } from './components/sections/NarrativeOverlay';

function Loader({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onLoaded, 600);
    return () => clearTimeout(timer);
  }, [onLoaded]);
  return null;
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-matcha-paper text-matcha-ink">
      <div className={`loader-overlay ${loaded ? 'loaded' : ''}`}>
        <div className="loader-ring" />
        <span className="loader-text">Preparing</span>
      </div>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2.2, 7.2], fov: 42, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 4,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={['#fbfaf4']} />
        <Suspense fallback={<Loader onLoaded={() => setLoaded(true)} />}>
          <ScrollControls pages={6} damping={0.18} distance={1}>
            <MatchaScene />
            <Scroll html>
              <NarrativeOverlay />
            </Scroll>
          </ScrollControls>
          <Loader onLoaded={() => setLoaded(true)} />
        </Suspense>
      </Canvas>
    </main>
  );
}

export default App;
