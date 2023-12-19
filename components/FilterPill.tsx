
export default function FilterPill({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      className={`filter-pill ${active ? "active bg-gray-950" : ""} bg-gray-500 rounded-full px-2.5 py-1 text-xs font-normal text-gray-100 leading-none`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}