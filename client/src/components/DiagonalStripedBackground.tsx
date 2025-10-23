export default function DiagonalStripedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="diagonal-stripes"
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
            patternTransform="rotate(-45)"
          >
            <rect x="0" y="0" width="50" height="100" fill="hsl(0 0% 8%)" />
            <rect x="50" y="0" width="50" height="100" fill="hsl(0 0% 12%)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
      </svg>
    </div>
  );
}
