import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface StepItem {
  id: string;
  label: string;
  subLabel?: string;
}

interface NavigationDotsProps {
  steps: StepItem[];
  activeStep: number;
  onStepClick: (index: number) => void;
  darkTheme?: boolean;
}

export function NavigationDots({
  steps,
  activeStep,
  onStepClick,
  darkTheme = false,
}: NavigationDotsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate position of the portal dropdown relative to the dots column
  const updatePosition = useCallback(() => {
    if (!dotsRef.current) return;
    const rect = dotsRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.top + rect.height / 2,
      right: window.innerWidth - rect.left + 8,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openMenu = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const closeMenuWithDelay = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250); // 250ms delay to smoothly cross the gap
  }, []);

  const handleItemClick = (index: number) => {
    onStepClick(index);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(false);
  };

  const optionStyle = (isSelected: boolean) => darkTheme
    ? isSelected
      ? 'bg-white/20 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
      : 'text-white/75 hover:text-white hover:bg-white/10'
    : isSelected
      ? 'bg-matcha-ink/10 text-matcha-ink font-semibold'
      : 'text-matcha-ink/75 hover:text-matcha-ink hover:bg-matcha-ink/5';

  // Portal dropdown — same pattern as LanguageSelector
  const dropdownMenu = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className="nav-dropdown-portal"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenuWithDelay}
          style={{
            position: 'fixed',
            top: menuPos.top,
            right: menuPos.right,
            transform: 'translateY(-50%)',
            zIndex: 99999,
          }}
        >
          <div
            className={`lang-dropdown-glass frosted-surface ${
              darkTheme ? 'frosted-surface-dark' : 'frosted-surface-light'
            }`}
            style={{
              width: '15rem',
              maxHeight: '380px',
              overflowY: 'auto',
              borderRadius: '1.25rem',
              border: '1px solid var(--glass-border)',
              color: darkTheme ? '#fff' : '#1f3128',
              fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
              animation: 'navDropdownIn 0.25s cubic-bezier(0.16,1,0.3,1)',
              transformOrigin: 'right center',
            }}
          >
            <div style={{ padding: '6px' }}>
              <div className="flex flex-col gap-1">
                {steps.map((step, index) => {
                  const isSelected = index === activeStep;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleItemClick(index)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-start ${optionStyle(
                        isSelected
                      )}`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {step.subLabel && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.15em] opacity-60 mb-0.5">
                          {step.subLabel}
                        </span>
                      )}
                      <span className="text-xs font-sans tracking-wide truncate w-full">
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div
        ref={dotsRef}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
        onMouseEnter={openMenu}
        onMouseLeave={closeMenuWithDelay}
      >
        {/* Vertical Dots column */}
        <div className="flex flex-col items-center gap-3 py-3 px-2">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(index)}
                className="group relative flex items-center justify-center w-3 h-3 cursor-pointer"
                aria-label={`Go to section: ${step.label}`}
              >
                {/* Outer ring showing active or hovered state */}
                <div
                  className={`absolute inset-0 rounded-full border transition-all duration-300 scale-0 group-hover:scale-100 ${
                    isActive ? 'scale-100 opacity-100' : 'opacity-0'
                  } ${darkTheme ? 'border-white/40' : 'border-matcha-ink/40'}`}
                />
                {/* Core dot */}
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? `${darkTheme ? 'bg-white' : 'bg-matcha-ink'} scale-110`
                      : `${
                          darkTheme ? 'bg-white/40 group-hover:bg-white/80' : 'bg-matcha-ink/40 group-hover:bg-matcha-ink/80'
                        }`
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      {dropdownMenu}
    </>
  );
}
