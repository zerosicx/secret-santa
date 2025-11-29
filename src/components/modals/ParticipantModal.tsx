import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { validateParticipant, convertFileToBase64 } from '../../utils/helpers';
import { useSecretSantaStore } from '../../store/useSecretSantaStore';

interface ParticipantModalProps {
  isOpen: boolean;
  editingId: string | null;
  initialName?: string;
  initialPhotoUrl?: string;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export function ParticipantModal({
  isOpen,
  editingId,
  initialName = '',
  initialPhotoUrl = '',
  onClose,
  onShowToast,
}: ParticipantModalProps) {
  const addParticipant = useSecretSantaStore((state) => state.addParticipant);
  const updateParticipant = useSecretSantaStore((state) => state.updateParticipant);
  const [name, setName] = useState(initialName);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setPhotoUrl(initialPhotoUrl);
      setFileName('');
      setError('');
      setIsAnimating(true);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, initialName, initialPhotoUrl]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      setFileName('');
      return;
    }

    setFileName(`Selected: ${file.name}`);
    setError('');

    try {
      const base64 = await convertFileToBase64(file);
      setPhotoUrl(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file.');
      setFileName('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = photoUrl.trim();

    const validationError = validateParticipant(trimmedName, trimmedUrl);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (editingId) {
      updateParticipant(editingId, trimmedName, trimmedUrl);
      onShowToast('Participant updated.');
    } else {
      addParticipant(trimmedName, trimmedUrl);
      onShowToast('Participant added to the hat.');
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center modal-backdrop ${
        !isOpen ? 'hidden' : ''
      }`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        className={`bg-white rounded-2xl max-w-md w-full mx-4 p-5 sm:p-6 card-shadow-soft relative ${
          isAnimating ? 'modal-enter-active' : 'modal-enter'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="participant-modal-title"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="participant-modal-title" className="text-lg font-semibold text-slate-900">
            {editingId ? 'Edit Participant' : 'Add Participant'}
          </h2>
          <button
            className="focus-outline text-slate-400 hover:text-slate-600"
            type="button"
            aria-label="Close add participant form"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="participant-name" className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              ref={nameInputRef}
              id="participant-name"
              name="participant-name"
              type="text"
              className="focus-outline block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-0"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo (optional)</label>
            <div className="flex flex-col gap-2">
              <input
                id="participant-photo-url"
                name="participant-photo-url"
                type="url"
                className="focus-outline block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-0"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-500">or</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
              <label
                htmlFor="participant-photo-file"
                className="focus-outline cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <span>📁 Upload from device</span>
                <input
                  id="participant-photo-file"
                  name="participant-photo-file"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-slate-500 min-h-[1rem]">{fileName}</p>
            </div>
          </div>
          <div className="text-xs text-red-600 min-h-[1.25rem]">{error}</div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="focus-outline inline-flex justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="focus-outline inline-flex justify-center rounded-full bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

