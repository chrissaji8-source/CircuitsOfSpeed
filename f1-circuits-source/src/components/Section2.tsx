import { useEffect, useState } from "react";

interface Props { visible: boolean; isActive: boolean; }

const subtopics = [
  {
    id: "mguh",
    label: "MGU-H Architecture",
    color: "#4488ff",
    content: "The Motor Generator Unit-Heat (MGU-H) is a high-speed 3-phase permanent magnet synchronous motor (PMSM) mounted on the turbocharger shaft between the compressor and turbine wheels. Spinning up to 125,000 RPM, it operates at electrical frequencies of ~2 kHz — far beyond standard AC systems. Field-oriented control (FOC) algorithms running at 100 kHz manage torque precisely.",
    stats: [{ label: "Max Speed", val: "125k RPM" }, { label: "Frequency", val: "~2 kHz" }, { label: "Control Rate", val: "100 kHz" }],
  },
  {
    id: "3phase",
    label: "3-Phase AC Theory",
    color: "#00ff96",
    content: "Three-phase AC is chosen over single-phase because it delivers constant, ripple-free power, enables higher torque density, and allows the motor to self-start. The three windings are displaced 120° apart, creating a rotating magnetic field. In F1, the phases are driven by silicon carbide (SiC) MOSFETs in a 6-switch inverter bridge at carrier frequencies exceeding 120 kHz.",
    stats: [{ label: "Phase Shift", val: "120°" }, { label: "Inverter", val: "6-switch" }, { label: "Switching", val: "120 kHz+" }],
  },
  {
    id: "inverter",
    label: "SiC Power Electronics",
    color: "#a78bfa",
    content: "Silicon Carbide (SiC) inverters are the key enabler of F1's AC/DC conversion. SiC switches at 10× higher frequencies than silicon with 3× higher thermal conductivity, allowing inverters to be smaller, lighter, and cooler. The F1 inverter converts 400V DC to 3-phase AC (and back) with 97% efficiency, while withstanding 200°C and severe vibration.",
    stats: [{ label: "Material", val: "SiC MOSFET" }, { label: "Efficiency", val: "97%" }, { label: "Temp rating", val: "200°C" }],
  },
  {
    id: "turbolag",
    label: "Eliminating Turbo Lag",
    color: "#fb923c",
    content: "Traditional turbos suffer lag because exhaust must first spool the turbine. The MGU-H solves this electrically: when the driver accelerates from a slow corner, the motor mode instantly spins the turbo shaft using battery power, delivering full boost pressure within milliseconds. On corner exit, the system switches to generator mode, harvesting excess boost energy as the engine reaches full throttle.",
    stats: [{ label: "Spool time", val: "< 50ms" }, { label: "Modes", val: "Motor/Gen" }, { label: "Benefit", val: "0 Lag" }],
  },
];

export default function Section2({ visible, isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [active, setActive] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    if (isActive) { setShowContent(false); setTimeout(() => setShowContent(true), 150); }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    let frame: number;
    const animate = () => { setWavePhase(p => p + 0.07); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isActive]);

  const topic = subtopics[active];
  const wave = (amp: number, freq: number, phase: number, offset: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= 400; x += 3) {
      const y = offset + amp * Math.sin((x / 400) * freq * Math.PI * 2 + phase);
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  if (!visible) return <div className="w-full h-screen flex-shrink-0" />;

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-bl from-[#000510] via-black to-[#020008]" />
      <div className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(68,136,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(68,136,255,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-600 to-transparent" />
      <div className="absolute top-8 right-10 font-mono text-blue-600/15 text-8xl font-black select-none pointer-events-none">02</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-16">
        {/* Left: oscilloscope + subtopics */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(-40px)', transition: 'all 0.7s ease 0.1s' }}>
          {/* Oscilloscope */}
          <p className="text-xs font-mono text-blue-400/60 uppercase tracking-widest mb-2">Oscilloscope — 3-Phase AC Live</p>
          <div className="relative border border-blue-900/40 bg-black/90 p-3 rounded-lg overflow-hidden mb-4"
            style={{ boxShadow: '0 0 30px rgba(68,136,255,0.1)' }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,100,0.15) 3px,rgba(0,255,100,0.15) 4px)' }} />
            <svg width="100%" height="130" viewBox="0 0 400 130" fill="none">
              {[32, 65, 98].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(0,255,150,0.08)" strokeWidth="1" />)}
              {[100, 200, 300].map(x => <line key={x} x1={x} y1="0" x2={x} y2="130" stroke="rgba(0,255,150,0.08)" strokeWidth="1" />)}
              <line x1="0" y1="65" x2="400" y2="65" stroke="rgba(0,255,150,0.25)" strokeWidth="1" />

              <path d={wave(45, 3, wavePhase, 65)} stroke="#00ff96" strokeWidth="2" fill="none" filter="url(#glow)" />
              <path d={wave(35, 3, wavePhase + 2.09, 65)} stroke="#4488ff" strokeWidth="1.5" fill="none" opacity={0.8} />
              <path d={wave(35, 3, wavePhase + 4.19, 65)} stroke="#fb923c" strokeWidth="1.5" fill="none" opacity={0.8} />
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
            </svg>
            <div className="flex gap-4 mt-1">
              {[['#00ff96','Phase A (0°)'],['#4488ff','Phase B (120°)'],['#fb923c','Phase C (240°)']].map(([c, l]) => (
                <span key={l} className="text-xs font-mono" style={{ color: c }}>● {l}</span>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs font-mono text-gray-600">f = 120 kHz · Vpp = 400V</span>
              <span className="text-xs font-mono text-green-400">● LIVE</span>
            </div>
          </div>

          {/* Subtopic tabs */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {subtopics.map((s, i) => (
              <button key={s.id} onClick={() => setActive(i)}
                className="text-left px-3 py-2 rounded border text-xs font-mono transition-all duration-300"
                style={{
                  opacity: showContent ? 1 : 0, transition: `all 0.5s ease ${0.3 + i * 0.08}s`,
                  borderColor: active === i ? s.color : 'rgba(255,255,255,0.08)',
                  background: active === i ? `${s.color}18` : 'rgba(0,0,0,0.4)',
                  color: active === i ? s.color : '#888',
                }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {topic.stats.map((s, i) => (
              <div key={s.label} className="border border-gray-800 bg-gray-950 p-3 rounded text-center"
                style={{ opacity: showContent ? 1 : 0, transition: `all 0.4s ease ${0.5 + i * 0.08}s` }}>
                <div className="font-mono font-bold text-sm" style={{ color: topic.color }}>{s.val}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5" style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(40px)', transition: 'all 0.7s ease 0.25s' }}>
          <div>
            <span className="text-xs font-mono tracking-[0.4em] text-blue-400 uppercase">Point 02</span>
            <h2 className="mt-1 text-4xl md:text-5xl font-black text-white leading-tight">AC MOTOR<br /><span className="text-blue-400">GENERATORS</span></h2>
          </div>

          {/* Active topic */}
          <div key={active} className="border border-gray-800 bg-gray-950/60 p-5 rounded-lg"
            style={{ borderLeftColor: topic.color, borderLeftWidth: 3 }}>
            <h3 className="font-mono font-bold text-sm mb-2" style={{ color: topic.color }}>{topic.label}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{topic.content}</p>
          </div>

          {/* MGU-H shaft diagram */}
          <div className="border border-gray-800 bg-black/60 p-4 rounded">
            <p className="text-xs font-mono text-gray-600 mb-3 uppercase tracking-widest">MGU-H Shaft Placement</p>
            <svg width="100%" height="80" viewBox="0 0 420 80" fill="none">
              {/* Turbine */}
              <rect x="5" y="20" width="70" height="40" rx="3" stroke="#fb923c" strokeWidth="1.5" fill="rgba(251,146,60,0.08)" />
              <text x="40" y="37" textAnchor="middle" fill="#fb923c" fontSize="7" fontFamily="monospace">TURBINE</text>
              <text x="40" y="49" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace">Exhaust</text>
              {/* Shaft */}
              <rect x="75" y="37" width="270" height="6" rx="2" fill="#555" />
              {/* MGU-H */}
              <rect x="155" y="15" width="90" height="50" rx="4" stroke="#4488ff" strokeWidth="2" fill="rgba(68,136,255,0.12)" />
              <text x="200" y="34" textAnchor="middle" fill="#4488ff" fontSize="8" fontFamily="monospace" fontWeight="bold">MGU-H</text>
              <text x="200" y="46" textAnchor="middle" fill="#00ff96" fontSize="7" fontFamily="monospace">125k RPM</text>
              <text x="200" y="57" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace">3-Phase AC</text>
              {/* Compressor */}
              <rect x="345" y="20" width="70" height="40" rx="3" stroke="#00ff96" strokeWidth="1.5" fill="rgba(0,255,150,0.08)" />
              <text x="380" y="37" textAnchor="middle" fill="#00ff96" fontSize="7" fontFamily="monospace">COMPRES.</text>
              <text x="380" y="49" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace">Boost air</text>
              {/* arrows */}
              <polygon points="155,40 148,37 148,43" fill="#4488ff" />
              <polygon points="345,40 352,37 352,43" fill="#4488ff" />
              {/* AC output */}
              <path d="M200 65 V75" stroke="#4488ff" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="200" y="78" textAnchor="middle" fill="#4488ff" fontSize="6.5" fontFamily="monospace">AC out → Inverter → DC Battery</text>
            </svg>
          </div>

          {/* Process steps */}
          <div className="space-y-2">
            {[
              "Exhaust spins turbine → shaft rotates at up to 125,000 RPM",
              "MGU-H generates 3-phase AC at ~2 kHz electrical frequency",
              "SiC inverter converts AC → 400V DC in microseconds",
              "DC stored in battery or dispatched directly to MGU-K",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-xs text-blue-400 shrink-0 mt-0.5">0{i + 1}</span>
                <div className="h-px w-5 bg-blue-500/50 mt-2.5 shrink-0" />
                <p className="text-xs text-gray-400">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
    </div>
  );
}
