import { Building2, Factory, PackageCheck, Ship, Sprout } from "lucide-react";

const nodes = [
  { x: 80, y: 180, label: "Nông trại", sub: "Gujarat, IN", icon: Sprout, tone: "text-emerald" },
  { x: 270, y: 92, label: "Kéo sợi", sub: "GreenWeave", icon: Factory, tone: "text-info" },
  {
    x: 470,
    y: 180,
    label: "May mặc",
    sub: "Vision Textile",
    icon: Building2,
    tone: "text-primary",
  },
  { x: 665, y: 92, label: "Vận chuyển", sub: "EU Corridor", icon: Ship, tone: "text-amber" },
  { x: 850, y: 180, label: "DPP EU", sub: "Đã xác minh", icon: PackageCheck, tone: "text-emerald" },
];

export function SupplyNetwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle_at_50%_0%,var(--primary-soft),transparent_55%)] p-4">
      <svg
        viewBox="0 0 930 285"
        className={compact ? "h-[230px] w-full" : "h-[300px] w-full"}
        role="img"
        aria-label="Mạng lưới dữ liệu chuỗi cung ứng"
      >
        <defs>
          <linearGradient id="flow" x1="0" x2="1">
            <stop stopColor="var(--emerald)" />
            <stop offset="0.55" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--info)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M80 180 C160 180 180 92 270 92 S390 180 470 180 S575 92 665 92 S760 180 850 180"
          fill="none"
          stroke="var(--border)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M80 180 C160 180 180 92 270 92 S390 180 470 180 S575 92 665 92 S760 180 850 180"
          fill="none"
          stroke="url(#flow)"
          strokeWidth="3"
          strokeDasharray="10 12"
          strokeLinecap="round"
          className="tp-flow-line"
        />
        {nodes.map((node, i) => (
          <g key={node.label} transform={`translate(${node.x} ${node.y})`}>
            <circle
              r="42"
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <circle
              r="34"
              fill={i === 4 ? "var(--emerald-soft)" : "var(--primary-soft)"}
              opacity=".9"
            />
            <foreignObject x="-16" y="-16" width="32" height="32">
              <node.icon className={`size-8 ${node.tone}`} />
            </foreignObject>
            <text y="62" textAnchor="middle" className="fill-foreground text-[15px] font-bold">
              {node.label}
            </text>
            <text y="81" textAnchor="middle" className="fill-muted-foreground text-[12px]">
              {node.sub}
            </text>
            <circle
              r="5"
              cx="-34"
              cy="-30"
              fill={i < 4 ? "var(--emerald)" : "var(--lime)"}
              className="tp-node"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          </g>
        ))}
      </svg>
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-emerald/25 bg-card/90 px-3 py-1.5 text-xs font-semibold text-emerald shadow-sm">
        <span className="size-2 rounded-full bg-emerald tp-live-dot" />5 mắt xích đang đồng bộ
      </div>
    </div>
  );
}
