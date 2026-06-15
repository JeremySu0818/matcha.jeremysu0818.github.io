import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import { MatchaScene } from './components/scene/MatchaScene';
import { NarrativeOverlay } from './components/sections/NarrativeOverlay';
import { LandingPage } from './components/LandingPage';
import { useTranslation } from './i18n';
import { CalculatorPage } from './components/CalculatorPage';
import { Header } from './components/Header';

function SceneReadyTrigger({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState(() => window.location.hash || '');
  const [sceneReady, setSceneReady] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (route === '#3d') {
      setSceneReady(false);
      setMinTimePassed(false);
      const timer = setTimeout(() => {
        setMinTimePassed(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [route]);

  useEffect(() => {
    if (sceneReady && minTimePassed) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [sceneReady, minTimePassed]);

  useEffect(() => {
    if (loaded) {
      const savedRoute = sessionStorage.getItem('matcha_scroll_route');
      const savedPos = sessionStorage.getItem('matcha_scroll_position');
      const hash = window.location.hash;

      if (hash === '#3d' && savedRoute === '#3d' && savedPos) {
        const targetPos = parseInt(savedPos, 10);
        if (!isNaN(targetPos)) {
          const canvasWrapper = document.querySelector('.relative.z-10.h-full.w-full');
          if (canvasWrapper) {
            const divs = canvasWrapper.querySelectorAll('div');
            let found = false;
            for (const div of divs) {
              if (div.style.overflow === 'auto' || div.style.overflowY === 'auto' || div.style.overflow === 'scroll' || div.style.overflowY === 'scroll') {
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    div.scrollTop = targetPos;
                  }, 100);
                });
                found = true;
                break;
              }
            }
            if (found) {
              sessionStorage.removeItem('matcha_scroll_position');
              sessionStorage.removeItem('matcha_scroll_route');
            }
          }
        }
      }
    }
  }, [loaded]);

  if (route === '' || route === '#') {
    return <LandingPage onEnter={() => { window.location.hash = '#3d'; }} />;
  }

  if (route === '#make') {
    return <CalculatorPage />;
  }

  return (
    <main className={`relative h-screen w-screen overflow-hidden text-white ${loaded ? 'is-loaded' : ''}`}>
      <div className={`loader-overlay ${loaded ? 'loaded' : ''}`}>
        <div className="loader-ring" />
        <span className="loader-text">{t.loader.preparing}</span>
      </div>

      <Header activeLink="3d" darkTheme={false} pointerEventsNone={true} onLoadAnimation={false} />
      
      <div className="relative z-10 h-full w-full">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 2.2, 7.2], fov: 42, near: 0.1, far: 80 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: 4,
            toneMappingExposure: 1.05,
          }}
        >
          <Suspense fallback={null}>
            <ScrollControls pages={6} damping={0.18} distance={1}>
              <MatchaScene />
              <Scroll html>
                <NarrativeOverlay onBack={() => { window.location.hash = ''; }} />
              </Scroll>
            </ScrollControls>
            <SceneReadyTrigger onReady={() => setSceneReady(true)} />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}

export default App;
