import { Phase } from '../types';
import { useSecretSantaStore } from '../store/useSecretSantaStore';

export function Header() {
  const phase = useSecretSantaStore((state) => state.phase);

  const getPhaseBadge = () => {
    switch (phase) {
      case Phase.SETUP:
        return {
          text: 'Setup Phase',
          className: 'inline-flex items-center rounded-full bg-red-100 text-red-700 text-sm font-semibold px-4 py-2',
        };
      case Phase.DRAWING:
        return {
          text: 'Drawing Phase',
          className: 'inline-flex items-center rounded-full bg-green-100 text-green-700 text-sm font-semibold px-4 py-2',
        };
      case Phase.DONE:
        return {
          text: 'All Drawn',
          className: 'inline-flex items-center rounded-full bg-slate-900 text-white text-sm font-semibold px-4 py-2',
        };
    }
  };

  const badge = getPhaseBadge();

  return (
    <header className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Secret Santa Hat Drawing
          </h1>
          <p className="mt-1 text-sm sm:text-base text-red-100 max-w-xl">
            Add everyone to the hat, flip the cards, then take turns secretly drawing your Secret Santa.
          </p>
        </div>
        <span className={badge.className}>{badge.text}</span>
      </div>
    </header>
  );
}

