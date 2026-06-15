import { useRef, useState, useLayoutEffect } from 'react';
import { useTranslation } from '../i18n';
import { LanguageSelector } from './LanguageSelector';
import { calculatorTranslations } from '../i18n/calculatorTranslations';

interface HeaderProps {
  activeLink: 'home' | '3d' | 'make';
  darkTheme?: boolean;
  pointerEventsNone?: boolean;
  onLoadAnimation?: boolean;
}

export function Header({
  activeLink,
  darkTheme = false,
  pointerEventsNone = false,
  onLoadAnimation = false,
}: HeaderProps) {
  const { t, lang } = useTranslation();
  const calculatorCopy = calculatorTranslations[lang] ?? calculatorTranslations.en;
  const headerRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleResize = () => {
      // Temporarily reset the scale property to 1 to measure the natural unscaled scrollWidth
      header.style.setProperty('--header-scale', '1');

      const clientWidth = header.clientWidth;
      const scrollWidth = header.scrollWidth;

      // Calculate the padding space to prevent clipping at edges
      const paddingLeft = parseFloat(window.getComputedStyle(header).paddingLeft || '0');
      const paddingRight = parseFloat(window.getComputedStyle(header).paddingRight || '0');
      const availableWidth = clientWidth - paddingLeft - paddingRight;

      // Measure the actual content width (which is scrollWidth minus padding)
      const contentWidth = scrollWidth - paddingLeft - paddingRight;
      
      if (contentWidth > availableWidth && availableWidth > 0) {
        // Calculate the required scale factor to fit within the available width (with a small safety margin)
        const calculatedScale = (availableWidth / contentWidth) * 0.98;
        const finalScale = Math.max(0.6, Math.min(1, calculatedScale));
        setScale(finalScale);
        header.style.setProperty('--header-scale', String(finalScale));
      } else {
        setScale(1);
        header.style.setProperty('--header-scale', '1');
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    
    // Also use ResizeObserver for handling dynamic layout changes
    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(header);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const headerClass = pointerEventsNone
    ? 'fixed left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-8 md:px-16 gap-6 md:gap-12 pointer-events-none scalable-header'
    : 'fixed left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-8 md:px-16 gap-6 md:gap-12 scalable-header';

  const containerClass = pointerEventsNone
    ? 'flex items-center gap-4 md:gap-8 pointer-events-auto'
    : 'flex items-center gap-4 md:gap-8';

  const navClass = pointerEventsNone
    ? 'flex items-center gap-4 md:gap-6 pointer-events-auto'
    : 'flex items-center gap-4 md:gap-6';

  const logoColor = darkTheme ? 'text-white' : 'text-matcha-ink';
  const navTextColor = darkTheme ? 'text-white' : 'text-matcha-ink';

  const animSuffix = onLoadAnimation ? '' : '-on-load';
  const delay100 = `animate-fade-in-up${animSuffix} delay-100`;
  const delay200 = `animate-fade-in-up${animSuffix} delay-200`;
  const delay300 = `animate-fade-in-up${animSuffix} delay-300`;

  return (
    <header
      ref={headerRef}
      className={headerClass}
      style={{ '--header-scale': scale } as React.CSSProperties}
    >
      <div className={containerClass}>
        <div className={`heading-serif tracking-widest drop-shadow-md scalable-title ${logoColor} ${delay100}`}>
          {t.header.title}
        </div>
        <nav className={`${navClass} ${delay200}`}>
          <a
            href="#"
            className="flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-sans tracking-wider transition-colors duration-300 drop-shadow-sm scalable-nav-link ${
                activeLink === 'home'
                  ? `${navTextColor} font-medium`
                  : `${navTextColor}/60 group-hover:${navTextColor}`
              }`}
            >
              {t.nav.home}
            </span>
            <span
              className={`w-full h-[1.5px] rounded-full mt-1 transition-transform duration-300 origin-center ${
                activeLink === 'home'
                  ? `scale-x-100 ${darkTheme ? 'bg-white' : 'bg-matcha-ink'}`
                  : `scale-x-0 group-hover:scale-x-50 ${
                      darkTheme ? 'bg-white/40' : 'bg-matcha-ink/40'
                    }`
              }`}
            />
          </a>
          <a
            href="#3d"
            className="flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-sans tracking-wider transition-colors duration-300 drop-shadow-sm scalable-nav-link ${
                activeLink === '3d'
                  ? `${navTextColor} font-medium`
                  : `${navTextColor}/60 group-hover:${navTextColor}`
              }`}
            >
              {t.nav.scene3d}
            </span>
            <span
              className={`w-full h-[1.5px] rounded-full mt-1 transition-transform duration-300 origin-center ${
                activeLink === '3d'
                  ? `scale-x-100 ${darkTheme ? 'bg-white' : 'bg-matcha-ink'}`
                  : `scale-x-0 group-hover:scale-x-50 ${
                      darkTheme ? 'bg-white/40' : 'bg-matcha-ink/40'
                    }`
              }`}
            />
          </a>
          <a
            href="#make"
            className="flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-sans tracking-wider transition-colors duration-300 drop-shadow-sm scalable-nav-link ${
                activeLink === 'make'
                  ? `${navTextColor} font-medium`
                  : `${navTextColor}/60 group-hover:${navTextColor}`
              }`}
            >
              {calculatorCopy.nav}
            </span>
            <span
              className={`w-full h-[1.5px] rounded-full mt-1 transition-transform duration-300 origin-center ${
                activeLink === 'make'
                  ? `scale-x-100 ${darkTheme ? 'bg-white' : 'bg-matcha-ink'}`
                  : `scale-x-0 group-hover:scale-x-50 ${
                      darkTheme ? 'bg-white/40' : 'bg-matcha-ink/40'
                    }`
              }`}
            />
          </a>
        </nav>
      </div>
      <div className={delay300}>
        <LanguageSelector darkTheme={darkTheme} />
      </div>
    </header>
  );
}
