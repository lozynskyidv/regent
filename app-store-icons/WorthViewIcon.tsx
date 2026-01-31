export function WorthViewIcon({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background with rounded corners */}
      <rect width="120" height="120" rx="26" fill="#1A1A1A" />
      
      {/* WV Monogram */}
      <text
        x="60"
        y="78"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="52"
        fontWeight="300"
        fill="#FAFAFA"
        textAnchor="middle"
        letterSpacing="-2"
      >
        WV
      </text>
    </svg>
  );
}
