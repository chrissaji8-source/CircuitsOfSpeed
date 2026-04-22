import { useEffect, useState, useRef } from "react";

interface Props {
  visible: boolean;
  isActive: boolean;
}

const title = "CIRCUITS OF SPEED";

export default function HeroSection({ visible, isActive }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [lapTime, setLapTime] = useState(0);
  const [gear, setGear] = useState(1);
  const [speed, setSpeed] = useState(0);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      setShowContent(false);
      setCharIdx(0);
      setRpm(0);
      setLapTime(0);
      setSpeed(0);
      setGear(1);
      const t = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  // Typewriter
  useEffect(() => {
    if (!showContent) return;
    if (charIdx >= title.length) return;
    const t = setTimeout(() => setCharIdx(c => c + 1), 55);
    return () => clearTimeout(t);
  }, [showContent, charIdx]);

  // Live telemetry animation
  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const t = Math.min(elapsed / 2.5, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setRpm(Math.round(eased * 15800));
      setSpeed(Math.round(eased * 342));
      setLapTime(elapsed);
      if (t < 0.3) setGear(1);
      else if (t < 0.5) setGear(2);
      else if (t < 0.65) setGear(3);
      else if (t < 0.78) setGear(4);
      else if (t < 0.88) setGear(5);
      else if (t < 0.95) setGear(6);
      else setGear(7);
      if (t < 1) animFrameRef.current = requestAnimationFrame(animate);
    };
    const delay = setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(animate);
    }, 400);
    return () => { clearTimeout(delay); cancelAnimationFrame(animFrameRef.current); };
  }, [isActive]);

  const rpmPct = rpm / 15800;
  const rpmColor = rpmPct > 0.85 ? '#ff0000' : rpmPct > 0.7 ? '#ffcc00' : '#00ff96';

  if (!visible) return <div className="w-full h-screen flex-shrink-0" />;

  return (
    <div className="relative w-full h-screen flex-shrink-0 overflow-hidden flex flex-col items-center justify-center">
      {/* Deep background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#0a0000] to-[#000000]" />

      {/* Grid overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(225,6,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial spotlight */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(180,0,0,0.12) 0%, transparent 70%)' }} />

      {/* Animated SVG circuit board background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" fill="none">
        {/* Track outline - left side */}
        <path d="M-20 700 Q100 680 180 580 Q260 480 220 360 Q180 240 300 180 Q420 120 520 200 Q620 280 580 400"
          stroke="rgba(225,6,0,0.15)" strokeWidth="2" fill="none" strokeDasharray="8,6"
          style={{ animation: isActive ? 'none' : undefined }} />
        {/* Track outline - right side */}
        <path d="M1460 200 Q1340 220 1260 320 Q1180 420 1220 540 Q1260 660 1140 720 Q1020 780 920 700 Q820 620 860 500"
          stroke="rgba(225,6,0,0.15)" strokeWidth="2" fill="none" strokeDasharray="8,6" />

        {/* Animated circuit trace */}
        <path d="M0 450 H180 L260 340 H480 L580 450 H800 L900 210 H1080 L1180 450 H1440"
          stroke="#e10600" strokeWidth="1.5" fill="none"
          strokeDasharray="1200" strokeDashoffset={isActive ? 0 : 1200}
          style={{ transition: 'stroke-dashoffset 2.5s ease-out 0.2s' }} />

        {/* Secondary traces */}
        <path d="M0 550 H120 L200 650 H640 L740 550 H1440"
          stroke="rgba(225,6,0,0.3)" strokeWidth="1" fill="none"
          strokeDasharray="1200" strokeDashoffset={isActive ? 0 : 1200}
          style={{ transition: 'stroke-dashoffset 2.8s ease-out 0.5s' }} />

        {/* Checkered flag pattern - top left */}
        {Array.from({ length: 10 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => (
            <rect key={`tl-${i}-${j}`} x={30 + i * 16} y={20 + j * 16} width="14" height="14"
              fill={(i + j) % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'}
              rx="1"
              style={{
                opacity: showContent ? 1 : 0,
                transition: `opacity 0.4s ease ${0.8 + (i + j) * 0.02}s`,
              }} />
          ))
        )}
        {/* Checkered flag pattern - top right */}
        {Array.from({ length: 10 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => (
            <rect key={`tr-${i}-${j}`} x={1250 + i * 16} y={20 + j * 16} width="14" height="14"
              fill={(i + j) % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'}
              rx="1"
              style={{
                opacity: showContent ? 1 : 0,
                transition: `opacity 0.4s ease ${0.8 + (i + j) * 0.02}s`,
              }} />
          ))
        )}

        {/* Glowing nodes at corners */}
        {[[200, 180], [580, 450], [900, 210], [1180, 450]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="6" fill="#e10600" opacity={showContent ? 1 : 0}
              style={{ transition: `opacity 0.3s ease ${1 + i * 0.15}s`, filter: 'blur(0px)' }} />
            <circle cx={cx} cy={cy} r="14" fill="none" stroke="#e10600" strokeWidth="1" opacity={showContent ? 0.4 : 0}
              style={{ transition: `opacity 0.3s ease ${1.1 + i * 0.15}s` }} />
          </g>
        ))}

        {/* F1 car silhouette - bottom right, large */}
        <g style={{
          opacity: showContent ? 0.12 : 0,
          transition: 'opacity 1s ease 1.5s, transform 1s ease 1.5s',
          transform: showContent ? 'translateX(0)' : 'translateX(80px)',
        }}>
          <ellipse cx="1080" cy="790" rx="50" ry="18" fill="white" />
          <ellipse cx="1240" cy="790" rx="50" ry="18" fill="white" />
          <path d="M990 780 Q1040 730 1120 720 Q1180 715 1240 726 Q1290 735 1310 760 Q1330 780 1320 790 L990 790 Z" fill="white" />
          <path d="M1060 720 Q1090 700 1140 696 Q1190 700 1210 720" fill="white" />
          <rect x="1000" y="776" width="330" height="18" rx="4" fill="white" />
          {/* Front wing */}
          <rect x="1290" y="782" width="50" height="6" rx="2" fill="white" />
          {/* Rear wing */}
          <rect x="975" y="775" width="40" height="5" rx="2" fill="white" />
          <rect x="975" y="768" width="40" height="4" rx="2" fill="white" />
        </g>
      </svg>

      {/* Top red bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #e10600 20%, #e10600 80%, transparent)', opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease' }} />

      {/* Corner brackets */}
      <div className="absolute top-5 left-5 w-12 h-12 border-l-2 border-t-2 border-red-600 opacity-50" />
      <div className="absolute top-5 right-5 w-12 h-12 border-r-2 border-t-2 border-red-600 opacity-50" />
      <div className="absolute bottom-5 left-5 w-12 h-12 border-l-2 border-b-2 border-red-600 opacity-50" />
      <div className="absolute bottom-5 right-5 w-12 h-12 border-r-2 border-b-2 border-red-600 opacity-50" />

      {/* ── TELEMETRY HUD – left ── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10"
        style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateX(0) translateY(-50%)' : 'translateX(-30px) translateY(-50%)', transition: 'all 0.7s ease 1s' }}>
        {/* Gear */}
        <div className="border border-red-900/60 bg-black/80 px-4 py-3 text-center" style={{ minWidth: 70 }}>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Gear</div>
          <div className="text-5xl font-black font-mono text-white leading-none mt-1">{gear}</div>
        </div>
        {/* Speed */}
        <div className="border border-red-900/60 bg-black/80 px-3 py-2 text-center">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Speed</div>
          <div className="text-2xl font-black font-mono text-red-400 leading-none">{speed}</div>
          <div className="text-xs font-mono text-gray-600">km/h</div>
        </div>
        {/* DRS */}
        <div className="border px-3 py-2 text-center"
          style={{ borderColor: rpmPct > 0.8 ? '#00ff96' : '#333', background: rpmPct > 0.8 ? 'rgba(0,255,150,0.1)' : 'rgba(0,0,0,0.8)' }}>
          <div className="text-xs font-mono tracking-widest" style={{ color: rpmPct > 0.8 ? '#00ff96' : '#555' }}>DRS</div>
          <div className="text-sm font-mono font-bold" style={{ color: rpmPct > 0.8 ? '#00ff96' : '#555' }}>
            {rpmPct > 0.8 ? 'OPEN' : 'CLOSED'}
          </div>
        </div>
      </div>

      {/* ── TELEMETRY HUD – right ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10"
        style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateX(0) translateY(-50%)' : 'translateX(30px) translateY(-50%)', transition: 'all 0.7s ease 1s' }}>
        {/* Lap timer */}
        <div className="border border-red-900/60 bg-black/80 px-3 py-2 text-right">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Lap Time</div>
          <div className="text-xl font-mono font-bold text-yellow-400">
            {String(Math.floor(lapTime / 60)).padStart(1, '0')}:
            {String(Math.floor(lapTime % 60)).padStart(2, '0')}.
            {String(Math.floor((lapTime % 1) * 999)).padStart(3, '0')}
          </div>
        </div>
        {/* Tyre */}
        <div className="border border-red-900/60 bg-black/80 px-3 py-2 text-right">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Tyre</div>
          <div className="text-lg font-mono font-bold" style={{ color: '#ffcc00' }}>SOFT</div>
          <div className="text-xs font-mono text-gray-600">Lap 47 / 70</div>
        </div>
        {/* ERS */}
        <div className="border border-blue-900/60 bg-black/80 px-3 py-2 text-right">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">ERS</div>
          <div className="h-2 bg-gray-900 rounded-full mt-1 overflow-hidden w-20 ml-auto">
            <div className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full"
              style={{ width: `${Math.round(rpmPct * 100)}%`, transition: 'width 0.1s' }} />
          </div>
          <div className="text-xs font-mono text-blue-400 mt-1">{Math.round(rpmPct * 100)}%</div>
        </div>
      </div>

      {/* ── RPM Bar at top ── */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 w-80"
        style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease 1.2s' }}>
        <div className="flex justify-between text-xs font-mono text-gray-600 mb-1">
          <span>RPM</span><span style={{ color: rpmColor }}>{rpm.toLocaleString()}</span>
        </div>
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden flex gap-px">
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = i / 20 < rpmPct;
            const isRedline = i >= 17;
            const isWarn = i >= 14 && i < 17;
            return (
              <div key={i} className="flex-1 rounded-sm transition-all duration-75"
                style={{
                  background: filled
                    ? isRedline ? '#e10600' : isWarn ? '#ffcc00' : '#00ff96'
                    : '#1a1a1a',
                  boxShadow: filled && isRedline ? '0 0 6px #e10600' : 'none',
                }} />
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full flex flex-col items-center text-center px-4 gap-3">
        {/* Badge */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(-16px)', transition: 'all 0.6s ease 0.2s' }}>
          <span className="px-4 py-1.5 text-xs font-mono tracking-[0.35em] uppercase text-red-400 border border-red-500/40 bg-red-500/8">
            Formula 1 x BEEE
          </span>
        </div>

        {/* Typewriter title */}
        <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
          {title.split('').map((char, i) => (
            <span key={i}
              className={`inline-block transition-all duration-200 ${char === ' ' ? 'mr-4' : ''}`}
              style={{
                opacity: i < charIdx ? 1 : 0,
                transform: i < charIdx ? 'translateY(0)' : 'translateY(24px)',
                color: i < 8 ? '#e10600' : 'white',
                textShadow: i < 8 ? '0 0 40px rgba(225,6,0,0.5)' : 'none',
              }}>
              {char}
            </span>
          ))}
        </h1>

        {/* Divider */}
        <div className="h-px w-80"
          style={{
            background: 'linear-gradient(90deg, transparent, #e10600, transparent)',
            opacity: charIdx >= title.length ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }} />

        {/* Subtitle */}
        <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s ease 1.4s' }}>
          <p className="text-gray-200 text-base md:text-lg font-light tracking-wide">
            The Role of <span className="text-red-400 font-semibold">AC & DC Circuits</span> in Formula 1
          </p>
          <p className="text-gray-500 text-xs mt-1 font-mono tracking-wide">
            Where Computer Engineering meets the pinnacle of motorsport
          </p>
        </div>

        {/* Team radio bar */}
        <div className="flex items-center justify-center gap-3"
          style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s ease 1.8s' }}>
          <div className="flex gap-0.5 items-end h-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-1 bg-red-500 rounded-t"
                style={{
                  height: `${20 + Math.sin(i * 0.8 + Date.now() / 300) * 12}%`,
                  animation: `radio-bar ${0.4 + i * 0.07}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.05}s`,
                }} />
            ))}
          </div>
          <span className="text-xs font-mono text-red-400/70 tracking-widest uppercase">TEAM RADIO · ACTIVE</span>
          <div className="flex gap-0.5 items-end h-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-1 bg-red-500 rounded-t"
                style={{
                  height: `${20 + Math.sin(i * 1.2 + Date.now() / 250) * 12}%`,
                  animation: `radio-bar ${0.5 + i * 0.06}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.04}s`,
                }} />
            ))}
          </div>
        </div>

        {/* ── TEAM LEADERBOARD ── */}
        <div className="w-full max-w-md"
          style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 1.6s' }}>
          <div className="border border-red-900/40 bg-black/80 rounded-lg overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(225,6,0,0.08)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-red-900/30 bg-red-950/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-red-400">Team Leaderboard</span>
              </div>
              <span className="text-xs font-mono text-gray-600">BEEE · 2024–25</span>
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-12 px-4 py-1 border-b border-gray-900">
              <span className="col-span-1 text-xs font-mono text-gray-600">POS</span>
              <span className="col-span-7 text-xs font-mono text-gray-600">DRIVER</span>
              <span className="col-span-4 text-xs font-mono text-gray-600 text-right">ROLL NO.</span>
            </div>
            {/* Rows */}
            {[
              { pos: 1, name: "Chris Sam Saji", roll: "11007", color: "#ffcc00" },
              { pos: 2, name: "Paras Bagwe",    roll: "10999", color: "#c0c0c0" },
              { pos: 3, name: "Eamon Chettiar", roll: "11006", color: "#cd7f32" },
              { pos: 4, name: "Zaid Sheikh",    roll: "11055", color: "#e10600" },
            ].map((member, i) => (
              <div key={member.roll}
                className="grid grid-cols-12 px-4 py-2 items-center border-b border-gray-900/50 last:border-0 hover:bg-white/[0.02] transition-colors"
                style={{
                  opacity: showContent ? 1 : 0,
                  transform: showContent ? 'translateX(0)' : 'translateX(-16px)',
                  transition: `all 0.5s ease ${1.7 + i * 0.08}s`,
                }}>
                <div className="col-span-1">
                  <span className="font-mono font-black text-sm" style={{ color: member.color }}>P{member.pos}</span>
                </div>
                <div className="col-span-7 flex items-center gap-2">
                  <div className="flex gap-px">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="w-1.5 h-3"
                        style={{ background: (j + i) % 2 === 0 ? 'white' : '#111', border: '0.5px solid #333' }} />
                    ))}
                  </div>
                  <span className="font-mono text-sm font-semibold text-white tracking-wide">{member.name}</span>
                </div>
                <div className="col-span-4 flex items-center justify-end gap-2">
                  <span className="font-mono text-xs text-gray-400">{member.roll}</span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: member.color, boxShadow: `0 0 6px ${member.color}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-1"
          style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.6s ease 2.2s' }}>
          <span className="text-xs text-gray-600 font-mono tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-5 bg-gradient-to-b from-red-500 to-transparent animate-pulse" />
        </div>
      </div>

      {/* RPM fill bar bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div className="h-full transition-all duration-2000"
          style={{
            width: isActive ? '100%' : '0%',
            transitionDuration: '2s',
            transitionDelay: '0.3s',
            background: `linear-gradient(90deg, #7f0000, #e10600, ${rpmPct > 0.8 ? '#ffcc00' : '#e10600'})`,
          }} />
      </div>

      <style>{`
        @keyframes radio-bar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
