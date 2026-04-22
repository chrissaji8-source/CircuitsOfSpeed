import { useEffect, useState } from "react";

interface Props { visible: boolean; isActive: boolean; }

const subtopics = [
  {
    id: "battery",
    label: "High-Voltage Battery",
    color: "#e10600",
    content: "The F1 Energy Store (ES) is a 400V lithium-ion battery pack capable of storing up to 4 MJ per lap. It uses cylindrical or pouch cells arranged in series/parallel configurations, protected by a Battery Management System (BMS) that monitors cell voltage, temperature, and state-of-charge at 1,000 Hz. The pack must survive extreme G-forces and vibration while maintaining consistent DC output.",
    stats: [{ label: "Voltage", val: "400V DC" }, { label: "Max Energy", val: "4 MJ" }, { label: "BMS Rate", val: "1 kHz" }],
  },
  {
    id: "regen",
    label: "Regenerative Braking",
    color: "#ff6600",
    content: "When the driver brakes, the MGU-K operates as a generator, converting kinetic energy into electrical energy. The DC bus voltage rises as current flows back into the battery. The system can recover up to 2 MJ per lap — equivalent to the energy used in roughly 33 seconds of full ERS deployment. The power electronics must clamp voltage spikes to protect the battery from over-voltage.",
    stats: [{ label: "Recovery", val: "2 MJ/lap" }, { label: "Peak Current", val: "~400A DC" }, { label: "Brake %", val: "~35%" }],
  },
  {
    id: "pdn",
    label: "Power Distribution",
    color: "#ffcc00",
    content: "F1 cars run three parallel DC buses: the 400V HV bus for MGU-K, a 24V bus for actuators (DRS, brake bias, differential), and a 12V bus for the ECU, sensors, and telemetry. Custom DC-DC converters, designed for minimal EMI, step down HV power. All wiring uses lightweight PTFE-insulated cables with aircraft-grade connectors — the entire electrical harness weighs under 7 kg.",
    stats: [{ label: "HV Bus", val: "400V" }, { label: "Actuators", val: "24V DC" }, { label: "Harness", val: "< 7 kg" }],
  },
  {
    id: "sensors",
    label: "Sensors & ECU",
    color: "#4ade80",
    content: "Over 300 sensors feed the McLaren Electronic Systems (MES) standard ECU, which runs on a 12V DC supply. Sensors measure temperature (200+ points), pressure, displacement, strain, acceleration, and optical data. All sensor data is multiplexed over CAN bus and transmitted to pit wall at 4 Mbps via a 900 MHz telemetry link.",
    stats: [{ label: "Sensors", val: "300+" }, { label: "Telemetry", val: "4 Mbps" }, { label: "ECU Supply", val: "12V DC" }],
  },
];

export default function Section1({ visible, isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      const t = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const topic = subtopics[active];

  if (!visible) return <div className="w-full h-screen flex-shrink-0" />;

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0000] via-black to-[#0d0505]" />
      <div className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(225,6,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(225,6,0,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-red-600 to-transparent" />
      <div className="absolute top-8 left-10 font-mono text-red-600/20 text-8xl font-black select-none pointer-events-none">01</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-16">
        {/* Left */}
        <div className="space-y-5">
          <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(-40px)', transition: 'all 0.7s ease 0.1s' }}>
            <span className="text-xs font-mono tracking-[0.4em] text-red-500 uppercase">Point 01</span>
            <h2 className="mt-1 text-4xl md:text-5xl font-black text-white leading-tight">DC POWER<br /><span className="text-red-500">SYSTEMS</span></h2>
          </div>

          {/* Subtopic tabs */}
          <div className="grid grid-cols-2 gap-2">
            {subtopics.map((s, i) => (
              <button key={s.id} onClick={() => setActive(i)}
                className="text-left px-3 py-2 rounded border text-xs font-mono transition-all duration-300"
                style={{
                  opacity: showContent ? 1 : 0,
                  transition: `all 0.5s ease ${0.2 + i * 0.08}s`,
                  borderColor: active === i ? s.color : 'rgba(255,255,255,0.08)',
                  background: active === i ? `${s.color}18` : 'rgba(0,0,0,0.4)',
                  color: active === i ? s.color : '#888',
                }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Active topic content */}
          <div key={active} className="border border-gray-800 bg-gray-950/60 p-5 rounded-lg"
            style={{ borderLeftColor: topic.color, borderLeftWidth: 3, opacity: showContent ? 1 : 0, transition: 'all 0.4s ease 0.4s' }}>
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
        </div>

        {/* Right: DC voltage map */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(40px)', transition: 'all 0.7s ease 0.25s' }}>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Live DC Voltage Map</p>

          {[
            { label: "400V HV Battery Bus", pct: 100, color: "#e10600", note: "Energy Store → MGU-K" },
            { label: "120kW MGU-K Deploy", pct: 88, color: "#ff6600", note: "Kinetic motor output" },
            { label: "24V Actuator Bus", pct: 42, color: "#ffcc00", note: "DRS, brakes, diff" },
            { label: "12V ECU + Sensors", pct: 22, color: "#4ade80", note: "Control electronics" },
            { label: "Regen Recovery", pct: 74, color: "#4488ff", note: "Braking → battery" },
          ].map((row, i) => (
            <div key={row.label} className="mb-4"
              style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'none' : 'translateX(20px)', transition: `all 0.5s ease ${0.35 + i * 0.1}s` }}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-mono text-gray-400">{row.label}</span>
                <span className="text-xs font-mono text-gray-500">{row.note}</span>
              </div>
              <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                  style={{
                    width: showContent ? `${row.pct}%` : '0%',
                    background: `linear-gradient(90deg,${row.color}88,${row.color})`,
                    boxShadow: `0 0 8px ${row.color}55`,
                    transition: `width 1.2s ease ${0.5 + i * 0.12}s`,
                  }} />
              </div>
            </div>
          ))}

          {/* Circuit flow diagram */}
          <div className="mt-4 border border-gray-800 bg-black/60 p-4 rounded">
            <p className="text-xs font-mono text-gray-600 mb-3 uppercase tracking-widest">DC Power Flow</p>
            <svg width="100%" height="90" viewBox="0 0 420 90" fill="none">
              <rect x="5" y="28" width="70" height="34" rx="3" stroke="#e10600" strokeWidth="1.5" fill="rgba(225,6,0,0.08)" />
              <text x="40" y="42" textAnchor="middle" fill="#e10600" fontSize="7" fontFamily="monospace">BATTERY</text>
              <text x="40" y="53" textAnchor="middle" fill="#ff6600" fontSize="6.5" fontFamily="monospace">400V DC</text>

              <path d="M75 45 H135" stroke="#e10600" strokeWidth="1.5" strokeDasharray="4,2" />
              <polygon points="138,42 132,45 138,48" fill="#e10600" />

              <rect x="138" y="25" width="65" height="40" rx="3" stroke="#ff6600" strokeWidth="1.5" fill="rgba(255,102,0,0.08)" />
              <text x="170" y="40" textAnchor="middle" fill="#ff6600" fontSize="7" fontFamily="monospace">INVERTER</text>
              <text x="170" y="51" textAnchor="middle" fill="#ffcc00" fontSize="6.5" fontFamily="monospace">DC↔AC</text>
              <text x="170" y="60" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace">97% eff.</text>

              <path d="M203 45 H263" stroke="#ff6600" strokeWidth="1.5" strokeDasharray="4,2" />
              <polygon points="266,42 260,45 266,48" fill="#ff6600" />

              <rect x="266" y="28" width="65" height="34" rx="3" stroke="#4ade80" strokeWidth="1.5" fill="rgba(74,222,128,0.08)" />
              <text x="298" y="42" textAnchor="middle" fill="#4ade80" fontSize="7" fontFamily="monospace">MGU-K</text>
              <text x="298" y="53" textAnchor="middle" fill="#fff" fontSize="6.5" fontFamily="monospace">120 kW</text>

              <path d="M331 45 H390" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4,2" />
              <rect x="390" y="35" width="25" height="20" rx="3" stroke="#4ade80" strokeWidth="1" fill="rgba(74,222,128,0.1)" />
              <text x="402" y="47" textAnchor="middle" fill="#4ade80" fontSize="6" fontFamily="monospace">⚙</text>

              <text x="210" y="84" textAnchor="middle" fill="#444" fontSize="7" fontFamily="monospace">DIRECT CURRENT POWER FLOW → F1 DRIVETRAIN</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
    </div>
  );
}
