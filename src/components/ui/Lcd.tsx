/** Siffror i "CD-spelardisplay"-stil. Använd sparsamt: betyg, speltid, poäng. */
export function Lcd({
  children,
  className = "",
  peak,
}: {
  children: React.ReactNode;
  className?: string;
  peak?: boolean;
}) {
  return (
    <span className={`lcd ${peak ? "text-accent" : ""} ${className}`}>{children}</span>
  );
}
