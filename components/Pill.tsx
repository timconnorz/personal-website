export default function Pill({ text }: { text: string }) {
  return (
    <span className="inline-block bg-orange-600 rounded-full px-1.5 py-0.5 text-xs font-normal text-orange-100 mx-1 mb-1">
      {text}
    </span>
  );
}