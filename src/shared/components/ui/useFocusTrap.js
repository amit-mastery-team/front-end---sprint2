import { useEffect } from 'react';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab inside `containerRef` and restores focus when the trap releases. */
export function useFocusTrap(containerRef, { active, onEscape }) {
  useEffect(() => {
    if (!active) return undefined;

    const previouslyFocused = document.activeElement;
    containerRef.current?.focus();

    const cycle = (event) => {
      const focusables = containerRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const target = event.shiftKey ? first : last;
      if (document.activeElement !== target) return;

      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onEscape?.();
      if (event.key === 'Tab') cycle(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef, onEscape]);
}
