export default function Pill({ text }: { text: string }) {
  return (
    <span className="inline-block bg-purple-500 rounded-full px-1.5 py-0.5 text-xs font-normal text-purple-100 mx-1 mb-1 leading-none align-middle">
      {text}
    </span>
  );
}