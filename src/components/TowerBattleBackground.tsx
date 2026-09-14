import { useMemo } from 'react';
import { TowerInfo } from '../types/game';

interface TowerBattleBackgroundProps {
  tower: TowerInfo;
  floor: number;
}

export function TowerBattleBackground({ tower, floor }: TowerBattleBackgroundProps) {
  // 10가지 탑 번호에 따른 세부 배경 테마
  const bgTheme = useMemo(() => {
    switch (tower.id) {
      case 1: // 화염의 지옥탑 (불)
        return {
          sky: 'from-orange-950/80 via-red-950/60 to-black',
          ground: '#450a0a',
          groundBorder: '#dc2626',
          accent: '#ef4444',
          type: 'magma',
        };
      case 2: // 심연의 해저탑 (물)
        return {
          sky: 'from-blue-950/90 via-cyan-950/60 to-black',
          ground: '#082f49',
          groundBorder: '#0284c7',
          accent: '#38bdf8',
          type: 'deepsea',
        };
      case 3: // 비취의 거목탑 (나무)
        return {
          sky: 'from-emerald-950/80 via-teal-950/60 to-black',
          ground: '#064e3b',
          groundBorder: '#059669',
          accent: '#34d399',
          type: 'forest',
        };
      case 4: // 대지의 암석탑 (땅)
        return {
          sky: 'from-amber-950/80 via-stone-950/70 to-black',
          ground: '#451a03',
          groundBorder: '#b45309',
          accent: '#f59e0b',
          type: 'canyon',
        };
      case 5: // 강철의 기계탑 (쇠)
        return {
          sky: 'from-slate-900/90 via-zinc-950/70 to-black',
          ground: '#1e293b',
          groundBorder: '#64748b',
          accent: '#94a3b8',
          type: 'steampunk',
        };
      case 6: // 홍련의 연옥탑 (불)
        return {
          sky: 'from-red-950/90 via-rose-950/70 to-black',
          ground: '#3b0764',
          groundBorder: '#e11d48',
          accent: '#fb7185',
          type: 'purgatory',
        };
      case 7: // 빙결의 극지탑 (물)
        return {
          sky: 'from-sky-950/90 via-indigo-950/60 to-black',
          ground: '#0c4a6e',
          groundBorder: '#38bdf8',
          accent: '#bae6fd',
          type: 'glacier',
        };
      case 8: // 태고의 신목탑 (나무)
        return {
          sky: 'from-teal-950/90 via-green-950/70 to-black',
          ground: '#14532d',
          groundBorder: '#10b981',
          accent: '#6ee7b7',
          type: 'worldtree',
        };
      case 9: // 황금의 사막탑 (땅)
        return {
          sky: 'from-yellow-950/90 via-amber-950/70 to-black',
          ground: '#78350f',
          groundBorder: '#d97706',
          accent: '#fbbf24',
          type: 'desert',
        };
      case 10: // 천공의 신철탑 (쇠)
      default:
        return {
          sky: 'from-indigo-950/90 via-slate-950/70 to-black',
          ground: '#0f172a',
          groundBorder: '#818cf8',
          accent: '#a5b4fc',
          type: 'celestial',
        };
    }
  }, [tower.id]);

  return (
    <div
      id={`tower-bg-${tower.id}`}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-xl z-0"
    >
      {/* 1. 배경 하늘 그라데이션 */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgTheme.sky} transition-all duration-700`} />

      {/* 2. 도트/픽셀 스타일 환경 그래픽 (SVG 픽셀 렌더링) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen"
        viewBox="0 0 320 200"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        {/* 테마별 특색 있는 배경 오브젝트 */}
        {bgTheme.type === 'magma' && (
          <g>
            {/* 용암 산맥 및 불기둥 */}
            <polygon points="0,150 40,90 90,150" fill="#7f1d1d" />
            <polygon points="70,150 130,70 190,150" fill="#991b1b" />
            <polygon points="160,150 230,80 290,150" fill="#7f1d1d" />
            <polygon points="250,150 290,100 320,150" fill="#991b1b" />
            {/* 마그마 틈새 */}
            <rect x="30" y="110" width="8" height="4" fill="#fbbf24" />
            <rect x="120" y="90" width="10" height="4" fill="#fb923c" />
            <rect x="220" y="100" width="12" height="4" fill="#ef4444" />
            {/* 날리는 불티 픽셀들 */}
            <rect x="40" y="50" width="3" height="3" fill="#f97316" className="animate-pulse" />
            <rect x="140" y="35" width="4" height="4" fill="#facc15" className="animate-ping" />
            <rect x="260" y="45" width="3" height="3" fill="#ef4444" className="animate-pulse" />
          </g>
        )}

        {bgTheme.type === 'deepsea' && (
          <g>
            {/* 심해 해저 기둥 및 산호 유적 */}
            <rect x="20" y="70" width="16" height="80" fill="#0c4a6e" />
            <rect x="18" y="66" width="20" height="6" fill="#0369a1" />
            <rect x="280" y="60" width="20" height="90" fill="#0c4a6e" />
            <rect x="276" y="54" width="28" height="8" fill="#0284c7" />
            {/* 해초 실루엣 */}
            <rect x="70" y="120" width="4" height="30" fill="#047857" />
            <rect x="74" y="110" width="4" height="40" fill="#10b981" />
            <rect x="240" y="115" width="4" height="35" fill="#047857" />
            {/* 상승하는 기포 입자 */}
            <circle cx="85" cy="65" r="2.5" fill="#bae6fd" opacity="0.8" />
            <circle cx="160" cy="40" r="3.5" fill="#e0f2fe" opacity="0.7" />
            <circle cx="210" cy="75" r="2" fill="#7dd3fc" opacity="0.8" />
          </g>
        )}

        {bgTheme.type === 'forest' && (
          <g>
            {/* 비취의 거목 고대 숲 기둥들 */}
            <rect x="10" y="20" width="28" height="130" fill="#064e3b" />
            <rect x="5" y="40" width="38" height="16" fill="#047857" />
            <rect x="275" y="25" width="32" height="125" fill="#064e3b" />
            <rect x="270" y="50" width="42" height="18" fill="#047857" />
            {/* 덩굴 가지와 잎사귀 */}
            <rect x="50" y="80" width="30" height="4" fill="#059669" />
            <rect x="230" y="75" width="35" height="4" fill="#059669" />
            {/* 반딧불이 포자 빛 */}
            <circle cx="90" cy="60" r="2" fill="#6ee7b7" className="animate-pulse" />
            <circle cx="180" cy="50" r="3" fill="#a7f3d0" className="animate-ping" />
            <circle cx="230" cy="90" r="2" fill="#34d399" className="animate-pulse" />
          </g>
        )}

        {bgTheme.type === 'canyon' && (
          <g>
            {/* 험준한 암벽과 바위 층단 */}
            <polygon points="0,150 50,70 110,150" fill="#78350f" />
            <polygon points="80,150 160,85 240,150" fill="#92400e" />
            <polygon points="210,150 280,65 320,150" fill="#78350f" />
            {/* 빛나는 주황색 광맥 */}
            <rect x="40" y="95" width="8" height="3" fill="#f59e0b" />
            <rect x="150" y="105" width="10" height="3" fill="#fbbf24" />
            <rect x="260" y="85" width="9" height="3" fill="#f59e0b" />
          </g>
        )}

        {bgTheme.type === 'steampunk' && (
          <g>
            {/* 강철의 거대 톱니바퀴 (원형과 톱니 돌기) */}
            <circle cx="50" cy="60" r="22" fill="#334155" />
            <circle cx="50" cy="60" r="12" fill="#1e293b" />
            <rect x="46" y="32" width="8" height="6" fill="#475569" />
            <rect x="46" y="82" width="8" height="6" fill="#475569" />
            <rect x="22" y="56" width="6" height="8" fill="#475569" />
            <rect x="72" y="56" width="6" height="8" fill="#475569" />

            <circle cx="270" cy="55" r="28" fill="#334155" />
            <circle cx="270" cy="55" r="16" fill="#1e293b" />
            {/* 강철 증기 파이프 */}
            <rect x="0" y="115" width="320" height="8" fill="#475569" />
            <rect x="150" y="113" width="14" height="12" fill="#94a3b8" />
            {/* 스팀 증기 배출 */}
            <ellipse cx="157" cy="98" rx="8" ry="4" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="157" cy="85" rx="14" ry="6" fill="#e2e8f0" opacity="0.4" />
          </g>
        )}

        {bgTheme.type === 'purgatory' && (
          <g>
            {/* 홍련의 진홍빛 화염기둥 */}
            <polygon points="20,150 60,40 100,150" fill="#881337" />
            <polygon points="220,150 260,35 300,150" fill="#9f1239" />
            <rect x="52" y="55" width="16" height="60" fill="#e11d48" opacity="0.8" />
            <rect x="252" y="50" width="16" height="65" fill="#f43f5e" opacity="0.8" />
            <circle cx="160" cy="30" r="8" fill="#fda4af" opacity="0.5" className="animate-ping" />
          </g>
        )}

        {bgTheme.type === 'glacier' && (
          <g>
            {/* 만년설 고드름 및 오로라 */}
            <polygon points="30,0 45,60 60,0" fill="#38bdf8" opacity="0.8" />
            <polygon points="120,0 130,45 140,0" fill="#7dd3fc" opacity="0.7" />
            <polygon points="200,0 215,70 230,0" fill="#38bdf8" opacity="0.8" />
            <polygon points="270,0 280,50 290,0" fill="#bae6fd" opacity="0.7" />
            {/* 서리 눈꽃 */}
            <rect x="70" y="80" width="3" height="3" fill="#e0f2fe" />
            <rect x="170" y="60" width="3" height="3" fill="#ffffff" className="animate-pulse" />
            <rect x="250" y="90" width="4" height="4" fill="#e0f2fe" />
          </g>
        )}

        {bgTheme.type === 'worldtree' && (
          <g>
            {/* 황금 세계수 룬 가지 */}
            <rect x="145" y="0" width="30" height="150" fill="#14532d" />
            <rect x="135" y="40" width="50" height="10" fill="#166534" />
            {/* 고대 황금 룬 문자 */}
            <rect x="156" y="25" width="8" height="8" fill="#facc15" className="animate-pulse" />
            <rect x="156" y="60" width="8" height="8" fill="#fde047" className="animate-pulse" />
            <rect x="156" y="95" width="8" height="8" fill="#facc15" className="animate-pulse" />
          </g>
        )}

        {bgTheme.type === 'desert' && (
          <g>
            {/* 모래 언덕과 황금 피라미드 실루엣 */}
            <polygon points="20,150 90,75 160,150" fill="#92400e" />
            <polygon points="170,150 240,65 310,150" fill="#b45309" />
            <rect x="85" y="85" width="10" height="6" fill="#fde047" />
            <rect x="235" y="75" width="10" height="6" fill="#f59e0b" />
          </g>
        )}

        {bgTheme.type === 'celestial' && (
          <g>
            {/* 천공의 요새 기둥 및 네온 플라즈마 라인 */}
            <rect x="25" y="30" width="22" height="120" fill="#1e1b4b" />
            <rect x="270" y="30" width="22" height="120" fill="#1e1b4b" />
            <line x1="0" y1="90" x2="320" y2="90" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="160" cy="45" r="14" fill="#4338ca" />
            <circle cx="160" cy="45" r="8" fill="#818cf8" className="animate-pulse" />
          </g>
        )}

        {/* 3. 바닥 발판 (전투 플랫폼) */}
        <rect x="0" y="152" width="320" height="48" fill={bgTheme.ground} />
        <rect x="0" y="150" width="320" height="3" fill={bgTheme.groundBorder} />

        {/* 바닥 질감 픽셀 디테일 */}
        <rect x="30" y="160" width="40" height="3" fill={bgTheme.groundBorder} opacity="0.4" />
        <rect x="110" y="170" width="55" height="3" fill={bgTheme.groundBorder} opacity="0.3" />
        <rect x="200" y="162" width="45" height="3" fill={bgTheme.groundBorder} opacity="0.4" />
        <rect x="270" y="168" width="30" height="3" fill={bgTheme.groundBorder} opacity="0.3" />
      </svg>

      {/* 4. 층수에 따른 높이 감각 장식 배너 */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 opacity-70 text-[10px] font-mono text-zinc-300">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bgTheme.accent }} />
        <span>{tower.name} [{floor}F 환경]</span>
      </div>
    </div>
  );
}
