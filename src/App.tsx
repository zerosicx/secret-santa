import { useState, useEffect } from 'react';
import { useSecretSantaStore } from './store/useSecretSantaStore';
import { Participant } from './types';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { ParticipantBoard } from './components/ParticipantBoard';
import { ParticipantModal } from './components/modals/ParticipantModal';
import { DrawModal } from './components/modals/DrawModal';
import { Toast } from './components/ui/Toast';
import { useToast } from './utils/useToast';
import { createConfetti } from './utils/confetti';

function App() {
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [drawnParticipant, setDrawnParticipant] = useState<Participant | null>(null);

  const { message, isVisible, showToast } = useToast();
  const participants = useSecretSantaStore((state) => state.participants);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isParticipantModalOpen) {
          setIsParticipantModalOpen(false);
          setEditingParticipantId(null);
        }
        if (isDrawModalOpen) {
          setIsDrawModalOpen(false);
          setDrawnParticipant(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isParticipantModalOpen, isDrawModalOpen]);

  const handleAddParticipant = () => {
    setEditingParticipantId(null);
    setIsParticipantModalOpen(true);
  };

  const handleEditParticipant = (id: string) => {
    setEditingParticipantId(id);
    setIsParticipantModalOpen(true);
  };

  const handleOpenDrawModal = (id: string) => {
    const participant = participants.find((p) => p.id === id);
    if (!participant || !participant.active) return;

    setDrawnParticipant(participant);
    setIsDrawModalOpen(true);
    createConfetti();
  };

  const handleCloseParticipantModal = () => {
    setIsParticipantModalOpen(false);
    setEditingParticipantId(null);
  };

  const handleCloseDrawModal = () => {
    setIsDrawModalOpen(false);
    setDrawnParticipant(null);
  };

  const editingParticipant = editingParticipantId
    ? participants.find((p) => p.id === editingParticipantId)
    : null;

  return (
    <div className="min-h-screen w-full bg-red-700 flex items-stretch justify-center font-sans">
      <div className="w-full max-w-5xl flex flex-col my-4 px-4">
        <Header />
        <main className="flex-1 bg-white/95 rounded-2xl p-4 sm:p-6 card-shadow-soft overflow-auto">
          <StatusBar />
          <ParticipantBoard
            onOpenAddModal={handleAddParticipant}
            onOpenEditModal={handleEditParticipant}
            onOpenDrawModal={handleOpenDrawModal}
            onShowToast={showToast}
          />
        </main>

        {/* Modals */}
        <ParticipantModal
          isOpen={isParticipantModalOpen}
          editingId={editingParticipantId}
          initialName={editingParticipant?.name}
          initialPhotoUrl={editingParticipant?.photoUrl}
          onClose={handleCloseParticipantModal}
          onShowToast={showToast}
        />
        <DrawModal
          isOpen={isDrawModalOpen}
          participant={drawnParticipant}
          onClose={handleCloseDrawModal}
          onShowToast={showToast}
        />

        {/* Toast */}
        <Toast message={message} isVisible={isVisible} />
      </div>
    </div>
  );
}

export default App;

