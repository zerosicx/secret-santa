interface AddParticipantCardProps {
  onAdd: () => void;
}

export function AddParticipantCard({ onAdd }: AddParticipantCardProps) {
  return (
    <button
      type="button"
      className="focus-outline flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-red-200 text-red-500 bg-red-50/60 hover:bg-red-100/80 hover:border-red-400 transition min-h-[140px]"
      aria-label="Add participant"
      onClick={onAdd}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl font-bold border border-red-200">
        +
      </div>
      <p className="text-xs font-medium text-red-700">Add participant</p>
    </button>
  );
}

