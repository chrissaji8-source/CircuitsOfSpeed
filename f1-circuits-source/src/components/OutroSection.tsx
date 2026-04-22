import { useEffect, useState, useRef } from "react";

interface Props { visible: boolean; isActive: boolean; }

const takeaways = [
  { icon: "⚡", title: "DC is the Foundation", desc: "400V DC battery systems power everything — from the 120kW MGU-K to the 12V ECU sensors." },
  { icon: "〜", title: "AC Enables Recovery", desc: "3-phase AC motor-generators (MGU-H & MGU-K) harvest wasted energy from exhaust and braking." },
  { icon: "🔄", title: "Inverters Bridge Both", desc: "SiC inverters convert AC↔DC in under 1ms at 97% efficiency — the invisible heartbeat of ERS." },
  { icon: "🏎", title: "Future is Electric", desc: "GaN electronics, AI control, and solid-state batteries will redefine what F1 circuits are capable of." },
];

export default function OutroSection({ visible, isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; rot: number; size: number; speed: number }[]>([]);
  const [checkered, setCheckered] = useState(false);
  const [lapComplete, setLapComplete] = useState(false);
  const animRef = useRef<number>(0);
  const confettiRef = useRef<{ x: number; y: number; color: string; rot: number; size: number; speed: number; vy: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setCheckered(false);
      setLapComplete(false);
      setConfetti([]);
      const t1 = setTimeout(() => setShowContent(true), 150);
      const t2 = setTimeout(() => setCheckered(true), 600);
      const t3 = setTimeout(() => {
        setLapComplete(true);
        // Spawn confetti
        const pieces = Array.from({ length: 60 }, () => ({
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          color: ['#e10600', '#ffffff', '#ffcc00', '#4ade80', '#4488ff'][Math.floor(Math.random() * 5)],
          rot: Math.random() * 360,
          size: 4 + Math.random() * 6,
          speed: 0.3 + Math.random() * 0.4,
          vy: 1 + Math.random() * 2,
        }));
        confettiRef.current = pieces;
        setConfetti(pieces.map(p => ({ ...p })));
      }, 1000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      cancelAnimationFrame(animRef.current);
    }
  }, [isActive]);

  // Animate confetti fall
  useEffect(() => {
    if (!lapComplete) return;
    let active = true;
    const animate = () => {
      if (!active) return;
      confettiRef.current = confettiRef.current.map(p => ({
        ...p,
        y: p.y > 110 ? -10 : p.y + p.speed,
        rot: p.rot + 2,
        x: p.x + Math.sin(p.y * 0.05) * 0.3,
      }));
      setConfetti(confettiRef.current.map(p => ({ ...p })));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { active = false; cancelAnimationFrame(animRef.current); };
  }, [lapComplete]);

  if (!visible) return <div className="w-full h-screen flex-shrink-0" />;

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#080000] to-[#000000]" />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(225,6,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(225,6,0,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(225,6,0,0.08) 0%, transparent 70%)' }} />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((p, i) => (
          <div key={i} className="absolute"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: p.color,
              transform: `rotate(${p.rot}deg)`,
              borderRadius: i % 3 === 0 ? '50%' : '1px',
              opacity: 0.85,
            }} />
        ))}
      </div>

      {/* Checkered flag sweep across the top */}
      <div className="absolute top-0 left-0 right-0 h-14 overflow-hidden pointer-events-none"
        style={{ opacity: checkered ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {Array.from({ length: 20 }).map((_, col) =>
          Array.from({ length: 3 }).map((_, row) => (
            <div key={`${col}-${row}`}
              className="absolute"
              style={{
                width: '5%',
                left: `${col * 5}%`,
                top: `${row * 33}%`,
                height: '34%',
                background: (col + row) % 2 === 0 ? 'white' : 'black',
                opacity: 0.9,
                transform: checkered ? 'translateY(0)' : 'translateY(-100%)',
                transition: `transform 0.4s ease ${col * 0.02}s`,
              }} />
          ))
        )}
      </div>

      {/* Checkered flag bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden pointer-events-none"
        style={{ opacity: checkered ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}>
        {Array.from({ length: 20 }).map((_, col) =>
          Array.from({ length: 2 }).map((_, row) => (
            <div key={`b-${col}-${row}`}
              className="absolute"
              style={{
                width: '5%', height: '50%',
                left: `${col * 5}%`, top: `${row * 50}%`,
                background: (col + row) % 2 === 0 ? 'white' : 'black',
                opacity: 0.85,
              }} />
          ))
        )}
      </div>

      {/* Side stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, #e10600, transparent)', opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease' }} />
      <div className="absolute right-0 top-0 bottom-0 w-1.5 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, #e10600, transparent)', opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease' }} />

      {/* F1 car racing animation across screen */}
      <div className="absolute pointer-events-none"
        style={{
          bottom: '14%', left: 0, right: 0,
          opacity: lapComplete ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
        <div style={{
          display: 'inline-block',
          animation: lapComplete ? 'race-car-pass 3s cubic-bezier(0.25,0.1,0.25,1) 0.2s infinite' : 'none',
        }}>
          <svg width="180" height="50" viewBox="0 0 180 50" fill="none">
            {/* Wheels */}
            <ellipse cx="38" cy="40" rx="14" ry="9" fill="#222" stroke="#e10600" strokeWidth="1.5" />
            <ellipse cx="142" cy="40" rx="14" ry="9" fill="#222" stroke="#e10600" strokeWidth="1.5" />
            {/* Body */}
            <path d="M20 36 Q35 14 70 10 Q100 6 125 12 Q155 17 165 36 Z" fill="#e10600" />
            <path d="M65 10 Q85 2 110 4 Q130 6 135 12" fill="#cc0000" />
            {/* Cockpit */}
            <path d="M70 10 Q85 2 110 4 Q128 6 132 12 L70 12 Z" fill="#111" opacity={0.8} />
            {/* Halo */}
            <path d="M75 11 Q100 4 125 11" stroke="#888" strokeWidth="2" fill="none" />
            {/* Front wing */}
            <rect x="152" y="32" width="28" height="5" rx="2" fill="#cc0000" />
            {/* Rear wing */}
            <rect x="8" y="27" width="24" height="5" rx="2" fill="#cc0000" />
            <rect x="8" y="20" width="24" height="5" rx="2" fill="#cc0000" />
            {/* Number */}
            <text x="95" y="28" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold">44</text>
            {/* Exhaust flame */}
            <ellipse cx="6" cy="32" rx="10" ry="4" fill="#ff6600" opacity={0.7} />
            <ellipse cx="2" cy="32" rx="6" ry="3" fill="#ffcc00" opacity={0.8} />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 text-center">
        {/* Lap complete badge */}
        <div className="mb-4"
          style={{ opacity: lapComplete ? 1 : 0, transform: lapComplete ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s' }}>
          <span className="px-6 py-2 font-mono text-sm tracking-[0.4em] uppercase border"
            style={{ color: '#ffcc00', borderColor: 'rgba(255,204,0,0.4)', background: 'rgba(255,204,0,0.08)' }}>
            ⬛ Lap Complete — P1 ⬛
          </span>
        </div>

        {/* Title */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.3s' }}>
          <h2 className="font-mono text-4xl md:text-6xl font-black text-white mb-2 leading-tight">
            THE RACE FOR<br /><span className="text-red-500">INNOVATION</span>
          </h2>
          <p className="text-gray-400 text-sm font-mono tracking-wide max-w-xl mx-auto">
            Formula 1 is the fastest-moving electrical engineering laboratory on Earth.
            Every circuit, every inverter, every electron — optimised for one purpose.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px max-w-md mx-auto my-5 bg-gradient-to-r from-transparent via-red-600 to-transparent"
          style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease 0.6s' }} />

        {/* Key takeaways */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {takeaways.map((t, i) => (
            <div key={t.title}
              className="border border-gray-800 bg-gray-950/80 p-4 rounded-lg text-left group hover:border-red-900/50 transition-all duration-300"
              style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${0.5 + i * 0.1}s`,
              }}>
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="font-mono font-bold text-xs text-red-400 mb-1">{t.title}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-4"
          style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.6s ease 0.9s' }}>
          {[
            { v: "1,200", u: "HP", l: "Peak Power" },
            { v: "97%", u: "", l: "Inverter Efficiency" },
            { v: "125k", u: "RPM", l: "MGU-H Speed" },
            { v: "< 1ms", u: "", l: "AC↔DC Switch" },
            { v: "300+", u: "", l: "Sensors" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-xl font-black text-white">{s.v}<span className="text-red-500 text-sm ml-1">{s.u}</span></div>
              <div className="text-xs text-gray-500 font-mono">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease 1.1s' }}>
          <div className="flex justify-center items-center gap-2 mb-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5"
                style={{ background: i % 2 === 0 ? 'white' : '#111', border: '1px solid #333' }} />
            ))}
          </div>
          <p className="text-gray-600 text-xs font-mono tracking-widest uppercase">
            Formula 1 × BEEE · AC/DC Circuits · Computer Engineering
          </p>
        </div>
      </div>

      <style>{`
        @keyframes race-car-pass {
          0%   { transform: translateX(-200px); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }
      `}</style>
    </div>
  );
}
