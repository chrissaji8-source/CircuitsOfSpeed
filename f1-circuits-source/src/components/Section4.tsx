import { useEffect, useState } from "react";

interface Props { visible: boolean; isActive: boolean; }

const subtopics = [
  {
    id: "full-ev",
    label: "Full Electric Powerunit",
    color: "#e10600",
    content: "Post-2030 F1 proposals explore 100% electric powerunits with 1,000+ kW output. The challenges are immense: batteries must store 10× more energy in half the weight, and inverters must handle multi-megawatt transients. Solid-state battery technology — with energy densities of 500+ Wh/kg — is the key enabler.",
    stats: [{ label: "Target Power", val: "1,000+ kW" }, { label: "Battery", val: "Solid-state" }, { label: "Target wt.", val: "< 100 kg" }],
  },
  {
    id: "gan",
    label: "GaN Power Electronics",
    color: "#ff6600",
    content: "Gallium Nitride (GaN) is the next evolution beyond SiC. GaN transistors switch at over 1 MHz with near-zero switching losses, enabling inverters that are 50% smaller and 30% lighter than current SiC units. GaN's electron mobility is 5× higher than silicon, making it ideal for the extreme thermal and frequency demands of F1.",
    stats: [{ label: "Switching", val: "> 1 MHz" }, { label: "Size vs SiC", val: "−50%" }, { label: "Weight", val: "−30%" }],
  },
  {
    id: "ai-control",
    label: "AI Inverter Control",
    color: "#a78bfa",
    content: "Machine learning models are beginning to replace hand-tuned FOC (Field Oriented Control) algorithms. Neural networks trained on millions of simulated laps can optimise torque delivery in real-time based on tyre temperature, G-loads, and circuit position. Adaptive control reduces energy waste by up to 3% per lap — worth half a second at Monaco.",
    stats: [{ label: "Energy saved", val: "~3%/lap" }, { label: "Lap benefit", val: "~0.5s" }, { label: "Method", val: "ML FOC" }],
  },
  {
    id: "wireless",
    label: "Wireless Power & Data",
    color: "#4ade80",
    content: "Next-gen F1 cars may use inductive power transfer for pitstop charging and 5G mmWave links for 10 Gbps telemetry. Bidirectional wireless DC charging could charge the battery during pitstops without physical connectors, reducing stop time and risk. High-frequency radio links would allow engineers to update inverter firmware on the fly.",
    stats: [{ label: "Telemetry", val: "10 Gbps" }, { label: "Charging", val: "Inductive" }, { label: "Pitstop", val: "< 2s" }],
  },
];

export default function Section4({ visible, isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (isActive) { setShowContent(false); setTimeout(() => setShowContent(true), 150); }
  }, [isActive]);

  const topic = subtopics[active];

  if (!visible) return <div className="w-full h-screen flex-shrink-0" />;

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050010] via-black to-[#0a0005]" />
      <div className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(167,139,250,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Animated orbit rings */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
        {[120, 180, 240].map((r, i) => (
          <div key={r} className="absolute border border-purple-500 rounded-full"
            style={{
              width: r * 2, height: r * 2,
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              animation: `spin-slow ${10 + i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            }} />
        ))}
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-white/3 text-9xl font-black select-none pointer-events-none">04</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-10">
        {/* Left */}
        <div className="space-y-5" style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(-40px)', transition: 'all 0.7s ease 0.1s' }}>
          <div>
            <span className="text-xs font-mono tracking-[0.4em] text-purple-400 uppercase">Point 04</span>
            <h2 className="mt-1 text-4xl md:text-5xl font-black text-white leading-tight">THE FUTURE OF<br /><span className="text-red-500">F1 CIRCUITS</span></h2>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              As Formula 1 targets net-zero carbon by 2030, AC/DC technology is advancing faster than ever before.
              The race is no longer just on track — it's in the lab.
            </p>
          </div>

          {/* Subtopic tabs */}
          <div className="grid grid-cols-2 gap-2">
            {subtopics.map((s, i) => (
              <button key={s.id} onClick={() => setActive(i)}
                className="text-left px-3 py-2 rounded border text-xs font-mono transition-all duration-300"
                style={{
                  opacity: showContent ? 1 : 0, transition: `all 0.5s ease ${0.2 + i * 0.08}s`,
                  borderColor: active === i ? s.color : 'rgba(255,255,255,0.08)',
                  background: active === i ? `${s.color}18` : 'rgba(0,0,0,0.4)',
                  color: active === i ? s.color : '#888',
                }}>
                {s.label}
              </button>
            ))}
          </div>

          <div key={active} className="border border-gray-800 bg-gray-950/60 p-5 rounded-lg"
            style={{ borderLeftColor: topic.color, borderLeftWidth: 3 }}>
            <h3 className="font-mono font-bold text-sm mb-2" style={{ color: topic.color }}>{topic.label}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{topic.content}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {topic.stats.map(s => (
                <div key={s.label}>
                  <div className="font-mono font-bold text-sm" style={{ color: topic.color }}>{s.val}</div>
                  <div className="text-xs text-gray-500 font-mono">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(40px)', transition: 'all 0.7s ease 0.25s' }}>
          {/* Timeline */}
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Technology Roadmap</p>
          <div className="space-y-3 mb-6">
            {[
              { year: "2024", label: "Current: SiC Inverters + Li-Ion ERS", done: true, color: "#4ade80" },
              { year: "2026", label: "New PU: 50% electric, e-fuels mandate", done: true, color: "#22c55e" },
              { year: "2028", label: "GaN power electronics integration", done: false, color: "#a78bfa" },
              { year: "2030", label: "Net-zero operations + AI adaptive control", done: false, color: "#818cf8" },
              { year: "2035+", label: "Fully electric F1 — solid-state batteries", done: false, color: "#e10600" },
            ].map((item, i) => (
              <div key={item.year} className="flex items-center gap-4"
                style={{ opacity: showContent ? 1 : 0, transition: `all 0.5s ease ${0.3 + i * 0.1}s` }}>
                <div className="text-xs font-mono font-bold shrink-0 w-10" style={{ color: item.color }}>{item.year}</div>
                <div className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${item.color}60, transparent)` }} />
                <div className="text-xs font-mono text-gray-400 shrink-0 max-w-[200px] text-right">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Key stats summary */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: "1,200 hp", label: "2024 Peak Power", highlight: false },
              { val: "97%", label: "Current Inverter Eff.", highlight: true },
              { val: "125k RPM", label: "MGU-H Max Speed", highlight: false },
              { val: "< 1ms", label: "AC↔DC Transition", highlight: true },
              { val: "300+", label: "Sensors Per Car", highlight: false },
              { val: "4 MJ", label: "Max ES Energy/Lap", highlight: false },
            ].map((card, i) => (
              <div key={card.label} className="border p-3 rounded text-center transition-all duration-500"
                style={{
                  borderColor: card.highlight ? 'rgba(225,6,0,0.4)' : 'rgba(255,255,255,0.06)',
                  background: card.highlight ? 'rgba(225,6,0,0.08)' : 'rgba(0,0,0,0.4)',
                  opacity: showContent ? 1 : 0,
                  transition: `all 0.5s ease ${0.5 + i * 0.07}s`,
                }}>
                <div className="font-mono font-bold text-base" style={{ color: card.highlight ? '#e10600' : 'white' }}>{card.val}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-600/30 to-transparent" />
    </div>
  );
}
