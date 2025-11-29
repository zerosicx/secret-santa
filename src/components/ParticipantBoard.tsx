import { useMemo } from 'react';
import { Phase, Participant } from '../types';
import { useSecretSantaStore } from '../store/useSecretSantaStore';
import { shuffleArray } from '../utils/helpers';
import { ParticipantCard } from './cards/ParticipantCard';
import { DrawCard } from './cards/DrawCard';
import { AddParticipantCard } from './cards/AddParticipantCard';

interface ParticipantBoardProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (id: string) => void;
  onOpenDrawModal: (id: string) => void;
  onShowToast: (message: string) => void;
}

export function ParticipantBoard({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDrawModal,
  onShowToast,
}: ParticipantBoardProps) {
  const phase = useSecretSantaStore((state) => state.phase);
  const participants = useSecretSantaStore((state) => state.participants);
  const startDrawing = useSecretSantaStore((state) => state.startDrawing);
  const backToSetup = useSecretSantaStore((state) => state.backToSetup);
  const reset = useSecretSantaStore((state) => state.reset);

  const participantCount = participants.length;
  const isReadyDisabled = participantCount < 2 || phase !== Phase.SETUP;

  // Shuffle participants once when entering drawing phase
  const displayParticipants = useMemo(() => {
    if (phase === Phase.DRAWING || phase === Phase.DONE) {
      return shuffleArray(participants);
    }
    return participants;
  }, [participants, phase]);

  const handleReady = () => {
    if (participantCount < 2) {
      onShowToast('Add at least 2 participants before starting.');
      return;
    }
    startDrawing();
    onShowToast('Cards shuffled! Start taking turns.');
  };

  const handleEdit = () => {
    backToSetup();
    onShowToast('Returned to setup. You can now edit participants.');
  };

  const handleReset = () => {
    reset();
    onShowToast('Game reset. Start fresh!');
  };

  const getReadyButtonLabel = () => {
    if (phase === Phase.SETUP) return 'Ready: Lock & Shuffle';
    if (phase === Phase.DRAWING) return 'Drawing in progress';
    return 'Complete';
  };

  return (
    <section aria-labelledby="grid-heading" className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-white/90">
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex items-center justify-between">
          <h2 id="grid-heading" className="text-base sm:text-lg font-semibold text-slate-800">
            Participant Hat
          </h2>
           <div className="flex flex-wrap items-center gap-2 ml-auto">
          {phase === Phase.SETUP && (
            <div className="relative group">
              <button
                className="focus-outline inline-flex items-center gap-2 rounded-full bg-green-600 text-white text-sm font-semibold px-4 py-2 shadow-md hover:bg-green-700 transition disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed"
                type="button"
                onClick={handleReady}
                disabled={isReadyDisabled}
              >
                <span className="hidden sm:inline">{getReadyButtonLabel()}</span>
                <span className="sm:hidden">🎲</span>
              </button>
              {isReadyDisabled && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                  Add at least 2 participants
                </div>
              )}
            </div>
          )}
          {phase !== Phase.SETUP && (
            <button
              className="focus-outline inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-sm font-semibold px-4 py-2 shadow-md hover:bg-blue-700 transition"
              type="button"
              onClick={handleEdit}
            >
              <span className="hidden sm:inline">Edit Participants</span>
              <span className="sm:hidden">✏️</span>
            </button>
          )}
          <button
            className="focus-outline inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-semibold px-4 py-2 hover:bg-slate-50 transition"
            type="button"
            onClick={handleReset}
          >
            <span className="hidden sm:inline">Reset &amp; Clear All</span>
            <span className="sm:hidden">🔄</span>
          </button>
        </div>
      </div>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4" aria-live="polite">
        {displayParticipants.map((participant: Participant) => {
          if (phase === Phase.SETUP) {
            return (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onEdit={onOpenEditModal}
              />
            );
          } else {
            return (
              <DrawCard key={participant.id} participant={participant} onDraw={onOpenDrawModal} />
            );
          }
        })}
        {phase === Phase.SETUP && <AddParticipantCard onAdd={onOpenAddModal} />}
      </div>

      {/* Instructions */}
      <section aria-labelledby="instructions-heading" className="mt-4 border-t border-slate-200 pt-3">
        <h2 id="instructions-heading" className="text-sm font-semibold text-slate-800 mb-1">
          How turns work
        </h2>
        <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 space-y-1">
          <li>Everyone looks away except the person drawing.</li>
          <li>
            They click <span className="font-semibold">one</span> face-down card to secretly reveal their
            assignment.
          </li>
          <li>
            They can click <span className="font-semibold">"Hide &amp; Keep"</span> to accept it, or cancel
            and choose a different card.
          </li>
          <li>Once kept, that card disappears from the grid so nobody else can draw it.</li>
        </ol>
      </section>
    </section>
  );
}

