import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scroll, ScrollControls } from '@react-three/drei';
import { MatchaScene } from './components/scene/MatchaScene';
import { NarrativeOverlay } from './components/sections/NarrativeOverlay';
import { LandingPage } from './components/LandingPage';
import { useTranslation } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';

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

  return (
    <main className={`relative h-screen w-screen overflow-hidden text-white ${loaded ? 'is-loaded' : ''}`}>
      <div className={`loader-overlay ${loaded ? 'loaded' : ''}`}>
        <div className="loader-ring" />
        <span className="loader-text">{t.loader.preparing}</span>
      </div>

      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-8 md:px-16 pointer-events-none">
        <div className="flex items-center gap-8">
          <div className="heading-serif text-3xl tracking-widest text-matcha-ink drop-shadow-md animate-fade-in-up-on-load delay-100">
            {t.header.title}
          </div>
          <nav className="flex items-center gap-6 animate-fade-in-up-on-load delay-200 pointer-events-auto">
            <a
              href="#"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span className="font-sans text-sm tracking-wider text-matcha-ink/60 group-hover:text-matcha-ink transition-colors duration-300 drop-shadow-sm">
                {t.nav.home}
              </span>
              <span className="w-full h-[1.5px] bg-transparent rounded-full mt-1 transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-50 group-hover:bg-matcha-ink/40" />
            </a>
            <a
              href="#3d"
              className="flex flex-col items-center group cursor-pointer"
            >
              <span className="font-sans text-sm tracking-wider text-matcha-ink font-medium transition-colors duration-300 drop-shadow-sm">
                {t.nav.scene3d}
              </span>
              <span className="w-full h-[1.5px] bg-matcha-ink rounded-full mt-1 transition-transform duration-300 origin-center scale-x-100" />
            </a>
          </nav>
        </div>
        <div className="animate-fade-in-up-on-load delay-300">
          <LanguageSelector darkTheme={false} />
        </div>
      </header>
      
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
