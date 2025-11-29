import { Phase } from '../types';
import { useSecretSantaStore, useRemainingCount } from '../store/useSecretSantaStore';

export function StatusBar() {
  const phase = useSecretSantaStore((state) => state.phase);
  const participantCount = useSecretSantaStore((state) => state.participants.length);
  const remainingCount = useRemainingCount();

  const getPhaseHelper = () => {
    switch (phase) {
      case Phase.SETUP:
        return 'Add at least 2 people, then press "Ready: Lock & Shuffle".';
      case Phase.DRAWING:
        return 'Pass the device. Each person secretly reveals and keeps one card.';
      case Phase.DONE:
        return 'Everyone has drawn a name. You can reset to start a new round.';
    }
  };

  return (
    <section aria-labelledby="status-heading" className="mb-4">
      <h2 id="status-heading" className="sr-only">
        Game status
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>
              <span>{participantCount}</span> participant{participantCount === 1 ? '' : 's'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600"></span>
            <span>
              <span>{remainingCount}</span> left to draw
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">{getPhaseHelper()}</p>
      </div>
    </section>
  );
}

