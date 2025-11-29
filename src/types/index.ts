export enum Phase {
  SETUP = 'setup',
  DRAWING = 'drawing',
  DONE = 'done',
}

export interface Participant {
  id: string;
  name: string;
  photoUrl: string;
  active: boolean;
}

export interface SecretSantaState {
  phase: Phase;
  participants: Participant[];
  drawnIds: string[];
}

export interface SecretSantaActions {
  addParticipant: (name: string, photoUrl: string) => void;
  updateParticipant: (id: string, name: string, photoUrl: string) => void;
  startDrawing: () => void;
  keepDraw: (id: string) => void;
  backToSetup: () => void;
  reset: () => void;
}

export type SecretSantaStore = SecretSantaState & SecretSantaActions;

