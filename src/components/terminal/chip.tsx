export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <li className="px-space-xs bg-surface-container text-secondary text-label-md">
      {children}
    </li>
  );
}
