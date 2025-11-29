import { useState, useEffect } from 'react';
import { Participant } from '../../types';
import { useSecretSantaStore, useRemainingCount } from '../../store/useSecretSantaStore';

interface DrawModalProps {
  isOpen: boolean;
  participant: Participant | null;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export function DrawModal({ isOpen, participant, onClose, onShowToast }: DrawModalProps) {
  const keepDraw = useSecretSantaStore((state) => state.keepDraw);
  const remainingCount = useRemainingCount();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleKeep = () => {
    if (!participant) {
      onClose();
      return;
    }
    
    keepDraw(participant.id);
    const newRemainingCount = remainingCount - 1;
    
    if (newRemainingCount === 0) {
      onShowToast('All names drawn. Merry gifting!');
    } else {
      onShowToast(`${newRemainingCount} left in the hat.`);
    }
    
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;
  if (!participant) return null;

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center modal-backdrop ${
        !isOpen ? 'hidden' : ''
      }`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        className={`bg-white rounded-2xl max-w-sm w-full mx-4 p-5 sm:p-6 card-shadow-soft relative ${
          isAnimating ? 'modal-enter-active' : 'modal-enter'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="draw-modal-title"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="draw-modal-title" className="text-lg font-semibold text-slate-900">
            You're {participant.name}'s Secret Santa 🎄
          </h2>
          <button
            className="focus-outline text-slate-400 hover:text-slate-600"
            type="button"
            aria-label="Close reveal"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="border border-dashed border-green-500 rounded-xl p-4 bg-green-50/70">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red-100 border-2 border-red-300 flex items-center justify-center text-3xl relative">
              <span className="font-bold text-red-700 absolute z-0">
                {participant.name ? participant.name.charAt(0).toUpperCase() : '?'}
              </span>
              {participant.photoUrl && (
                <img
                  src={participant.photoUrl}
                  alt={`${participant.name}'s photo`}
                  className="w-full h-full object-cover absolute inset-0 z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
            <p className="text-sm text-slate-600">
              Only you should see this! Remember your person and keep it secret.
            </p>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight">{participant.name}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="items-center focus-outline flex-1 w-full inline-flex justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
            onClick={handleKeep}
          >
            Hide &amp; Keep
          </button>
          <button
            type="button"
            className="items-centerfocus-outline flex-1 w-full h-fullinline-flex justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel &amp; Pick Again
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Tip: After clicking "Hide &amp; Keep", hand the screen to the next person.
        </p>
      </div>
    </div>
  );
}

