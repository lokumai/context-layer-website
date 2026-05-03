import { Rocket, TrendingUp } from "lucide-react";

export function LandAndExpandStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Step
        num="01"
        icon={<Rocket size={24} strokeWidth={1.5} />}
        accentBg="#eff6ff"
        accentFg="#1d4ed8"
        kicker="Land"
        title="Deploy the Context Layer base product."
        body="Teams get documentation, onboarding, grounded Q&A, and a live health dashboard on day one. No architecture changes required."
      />
      <Step
        num="02"
        icon={<TrendingUp size={24} strokeWidth={1.5} />}
        accentBg="#ecfdf5"
        accentFg="#047857"
        kicker="Expand"
        title="Unlock premium workflows on the same substrate."
        body="Code Translation and Code Modernization reuse the same persistent Wiki. The second product is trivial to land once the first is in place."
      />
    </div>
  );
}

function Step({
  num,
  icon,
  accentBg,
  accentFg,
  kicker,
  title,
  body,
}: {
  num: string;
  icon: React.ReactNode;
  accentBg: string;
  accentFg: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-section p-8 shadow-[var(--shadow-outline-ring)] flex gap-6">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-12 h-12 rounded-comfortable flex items-center justify-center"
          style={{ backgroundColor: accentBg, color: accentFg }}
        >
          {icon}
        </div>
        <span className="text-button-upper" style={{ color: accentFg }}>
          {num}
        </span>
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-button-upper text-[#777169]">{kicker}</p>
        <h4 className="text-card-heading text-black">{title}</h4>
        <p className="text-body-standard text-[#4e4e4e]">{body}</p>
      </div>
    </div>
  );
}
