import { useEffect, useState } from "react";

interface Props { visible: boolean; isActive: boolean; }

const subtopics = [
  {
    id: "architecture",
    label: "ERS Architecture",
    color: "#4ade80",
    content: "The Energy Recovery System integrates two motor-generators, a lithium-ion energy store, and a control electronics unit. The system is regulated by the FIA: max 4 MJ stored per lap, max 120 kW from MGU-K, and max 2 MJ deployed from ES per lap. The architecture creates a closed-loop AC/DC energy cycle — harvesting, storing, and deploying within a single lap.",
    stats: [{ label: "Max Deploy", val: "2 MJ/lap" }, { label: "MGU-K Peak", val: "120 kW" }, { label: "Total Hybrid", val: "161 kW" }],
  },
  {
    id: "strategy",
    label: "Deployment Strategy",
    color: "#22c55e",
    content: "Drivers and engineers program ERS deployment on a corner-by-corner basis. Full 120kW ERS can be deployed for just 33 seconds per lap. Strategy dictates where to deploy: straight-line top speed vs. exit traction. The MGU-H can harvest independently and feed MGU-K without going via the battery, creating a 'direct path' for instant energy transfer — a critical overtaking tool.",
    stats: [{ label: "Full Deploy", val: "33 s/lap" }, { label: "Direct Path", val: "H→K" }, { label: "Boost zones", val: "3–5/lap" }],
  },
  {
    id: "conversion",
    label: "AC↔DC Conversion",
    color: "#86efac",
    content: "The inverter is the heart of ERS — converting between AC (motor operation) and DC (battery/bus). In regeneration mode, the MGU-K's 3-phase AC output is rectified to DC and stored. In deploy mode, DC is inverted back to variable-frequency AC to spin the rotor at the precise torque demanded by the driver's power request map. Transition between modes takes under 1ms.",
    stats: [{ label: "Switch time", val: "< 1ms" }, { label: "Efficiency", val: "97%" }, { label: "Phases", val: "3-phase" }],
  },
  {
    id: "thermal",
    label: "Thermal Management",
    color: "#a3e635",
    content: "ERS electronics dissipate significant heat — up to 5 kW in the inverter alone. Custom liquid cooling circuits with precision-machined aluminium cold plates maintain SiC junction temperatures below 150°C. The battery uses a separate glycol cooling circuit. Both circuits feed through the car's side radiators, adding thermal load that aerodynamicists must account for in cooling duct design.",
    stats: [{ label: "Inverter heat", val: "~5 kW" }, { label: "Max Tj", val: "150°C" }, { label: "Coolant", val: "Glycol" }],
  },
];

export default function Section3({ visible, isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [active, setActive] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [deployPct, setDeployPct] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setEnergyLevel(0);
      setDeployPct(0);
      const t1 = setTimeout(() => setShowContent(true), 150);
      const t2 = setTimeout(() => { setEnergyLevel(76); setDeployPct(62); }, 600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isActive]);

  const topic = subtopics[active];

  if (!visible) return <div className="w-full h-screen flex-shrink-0" />;

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#040a00] via-black to-[#001a05]" />
      <div className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
      <div className="absolute bottom-8 left-10 font-mono text-green-600/15 text-8xl font-black select-none pointer-events-none">03</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-8">
        {/* Left */}
        <div className="space-y-4" style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateY(30px)', transition: 'all 0.7s ease 0.1s' }}>
          <div>
            <span className="text-xs font-mono tracking-[0.4em] text-green-500 uppercase">Point 03</span>
            <h2 className="mt-1 text-4xl md:text-5xl font-black text-white leading-tight">HYBRID<br /><span className="text-green-400">ERS SYSTEM</span></h2>
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
            style={{ borderLeftColor: topic.color, borderLeftWidth: 3, transition: 'all 0.3s ease' }}>
            <h3 className="font-mono font-bold text-sm mb-2" style={{ color: topic.color }}>{topic.label}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{topic.content}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {topic.stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-mono font-bold text-sm" style={{ color: topic.color }}>{s.val}</div>
                  <div className="text-xs text-gray-500 font-mono">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ERS lap budget */}
          <div className="border border-green-900/40 bg-green-950/10 p-4 rounded">
            <p className="text-xs font-mono text-green-500/70 uppercase tracking-widest mb-3">ERS Lap Energy Budget</p>
            <div className="space-y-2">
              {[
                { label: "MGU-H Harvest (exhaust)", val: 70, color: "#4ade80" },
                { label: "MGU-K Harvest (braking)", val: 50, color: "#22c55e" },
                { label: "MGU-K Deploy", val: -100, color: "#e10600" },
                { label: "Net Balance", val: 20, color: "#86efac" },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs font-mono mb-0.5">
                    <span style={{ color: row.color }}>{row.label}</span>
                    <span className="text-gray-500">{row.val > 0 ? '+' : ''}{row.val}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-900 rounded overflow-hidden">
                    <div className="h-full rounded" style={{
                      width: `${Math.abs(row.val)}%`, background: row.color,
                      boxShadow: `0 0 6px ${row.color}66`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(40px)', transition: 'all 0.7s ease 0.25s' }}>
          {/* Battery store display */}
          <div className="border border-green-900/40 bg-black/70 p-5 rounded-lg mb-4" style={{ boxShadow: '0 0 40px rgba(74,222,128,0.06)' }}>
            <div className="flex justify-between mb-3">
              <span className="text-xs font-mono text-green-500/70 uppercase tracking-widest">ES Battery Store</span>
              <span className="text-xs font-mono text-green-400 font-bold">{energyLevel}% · {(energyLevel * 0.04).toFixed(2)} MJ</span>
            </div>
            <div className="relative h-10 bg-gray-900 rounded border border-green-900/40 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded transition-all"
                style={{ width: `${energyLevel}%`, transitionDuration: '1.5s', background: 'linear-gradient(90deg,#166534,#22c55e,#4ade80)', boxShadow: '0 0 15px rgba(74,222,128,0.3)' }} />
              {[25, 50, 75].map(p => <div key={p} className="absolute top-0 bottom-0 w-px bg-black/30" style={{ left: `${p}%` }} />)}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-white">{(energyLevel * 0.04).toFixed(2)} / 4.00 MJ</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-mono text-gray-500">Deploy this lap</span>
                <span className="text-xs font-mono text-red-400">{deployPct}%</span>
              </div>
              <div className="h-2 bg-gray-900 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-900 to-red-500 rounded transition-all"
                  style={{ width: `${deployPct}%`, transitionDuration: '1.2s', transitionDelay: '0.5s' }} />
              </div>
            </div>
          </div>

          {/* Power flow SVG */}
          <div className="border border-gray-800 bg-black/60 p-4 rounded mb-4">
            <p className="text-xs font-mono text-gray-600 mb-3 uppercase tracking-widest">ERS Power Flow — Lap Overview</p>
            <svg width="100%" height="120" viewBox="0 0 400 120" fill="none">
              <rect x="5" y="45" width="60" height="30" rx="3" stroke="#fb923c" strokeWidth="1.5" fill="rgba(251,146,60,0.1)" />
              <text x="35" y="58" textAnchor="middle" fill="#fb923c" fontSize="7" fontFamily="monospace">MGU-H</text>
              <text x="35" y="68" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace">AC gen</text>

              <rect x="160" y="38" width="80" height="44" rx="3" stroke="#4ade80" strokeWidth="2" fill="rgba(74,222,128,0.1)" />
              <text x="200" y="56" textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold">INVERTER</text>
              <text x="200" y="67" textAnchor="middle" fill="#888" fontSize="6.5" fontFamily="monospace">AC↔DC</text>
              <text x="200" y="77" textAnchor="middle" fill="#4ade80" fontSize="6" fontFamily="monospace">97% eff.</text>

              <rect x="335" y="45" width="60" height="30" rx="3" stroke="#86efac" strokeWidth="1.5" fill="rgba(134,239,172,0.1)" />
              <text x="365" y="58" textAnchor="middle" fill="#86efac" fontSize="7" fontFamily="monospace">MGU-K</text>
              <text x="365" y="68" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace">DC boost</text>

              <path d="M65 60 H160" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="3,2" />
              <polygon points="163,57 157,60 163,63" fill="#fb923c" />
              <path d="M240 60 H335" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3,2" />
              <polygon points="338,57 332,60 338,63" fill="#4ade80" />

              <rect x="160" y="95" width="80" height="20" rx="3" stroke="#e10600" strokeWidth="1" fill="rgba(225,6,0,0.1)" />
              <text x="200" y="108" textAnchor="middle" fill="#e10600" fontSize="7" fontFamily="monospace">400V BATTERY</text>
              <line x1="200" y1="82" x2="200" y2="95" stroke="#e10600" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: "1,200", u: "hp", l: "Total Power" },
              { v: "161", u: "kW", l: "Hybrid" },
              { v: "2 MJ", u: "", l: "Regen/Lap" },
              { v: "97%", u: "", l: "Efficiency" },
            ].map(c => (
              <div key={c.l} className="border border-gray-800 bg-gray-950 p-2 rounded text-center">
                <div className="font-mono font-bold text-sm text-green-400">{c.v}<span className="text-xs text-green-600 ml-0.5">{c.u}</span></div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
    </div>
  );
}
