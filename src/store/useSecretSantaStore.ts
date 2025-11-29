import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Phase, Participant, SecretSantaStore } from '../types';
import { generateId } from '../utils/helpers';

const STORAGE_KEY = 'secret_santa_hat_v1';

export const useSecretSantaStore = create<SecretSantaStore>()(
  persist(
    (set, get) => ({
      // State
      phase: Phase.SETUP,
      participants: [],
      drawnIds: [],

      // Actions
      addParticipant: (name: string, photoUrl: string) => {
        const newParticipant: Participant = {
          id: generateId(),
          name,
          photoUrl,
          active: true,
        };
        set((state) => ({
          participants: [...state.participants, newParticipant],
        }));
      },

      updateParticipant: (id: string, name: string, photoUrl: string) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, name, photoUrl } : p
          ),
        }));
      },

      startDrawing: () => {
        const { participants } = get();
        if (participants.length < 2) return;
        set({ phase: Phase.DRAWING });
      },

      keepDraw: (id: string) => {
        set((state) => {
          const updatedParticipants = state.participants.map((p) =>
            p.id === id ? { ...p, active: false } : p
          );
          const activeCount = updatedParticipants.filter((p) => p.active).length;
          const newPhase = activeCount === 0 ? Phase.DONE : state.phase;

          return {
            participants: updatedParticipants,
            drawnIds: [...state.drawnIds, id],
            phase: newPhase,
          };
        });
      },

      backToSetup: () => {
        set((state) => ({
          phase: Phase.SETUP,
          participants: state.participants.map((p) => ({ ...p, active: true })),
          drawnIds: [],
        }));
      },

      reset: () => {
        set({
          phase: Phase.SETUP,
          participants: [],
          drawnIds: [],
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch (error) {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
              alert('Storage limit exceeded! Images are too large. Try using smaller images or image URLs instead.');
            }
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            // Silently fail
          }
        },
      },
    }
  )
);

// Computed selectors
export const useActiveParticipants = () => {
  return useSecretSantaStore((state) => state.participants.filter((p) => p.active));
};

export const useRemainingCount = () => {
  return useSecretSantaStore((state) => state.participants.filter((p) => p.active).length);
};

