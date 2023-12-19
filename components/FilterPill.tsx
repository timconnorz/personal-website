import { Badge } from "@/components/ui/badge"

export default function FilterPill({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
    >
      <Badge onClick={onClick} variant={active ? "default" : "outline"}>{children}</Badge>

    </button>
  );
}