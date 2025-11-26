import React, { useState, useEffect, useCallback } from 'react';
import { fetchISSPosition, fetchWeather, getMockPasses, generateBriefing } from './services/api';
import { ISSPosition, Coordinates, WeatherData, PassPrediction, MissionBriefing } from './types';
import GlassCard from './components/GlassCard';
import WorldMap from './components/WorldMap';
import RadarView from './components/RadarView';

function App() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [nextPasses, setNextPasses] = useState<PassPrediction[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [briefing, setBriefing] = useState<MissionBriefing | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [selectedPassIndex, setSelectedPassIndex] = useState<number>(0);

  // 1. Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(loc);
          // Once we have location, get weather and passes
          loadLocalData(loc);
        },
        (err) => {
          console.error("Location access denied", err);
          // Default to Tokyo for Japanese version if denied
          const defaultLoc = { latitude: 35.6762, longitude: 139.6503 };
          setUserLocation(defaultLoc);
          loadLocalData(defaultLoc);
        }
      );
    } else {
        // Default to Tokyo
        const defaultLoc = { latitude: 35.6762, longitude: 139.6503 };
        setUserLocation(defaultLoc);
        loadLocalData(defaultLoc);
    }
  }, []);

  const loadLocalData = async (loc: Coordinates) => {
    // Fetch Weather
    const w = await fetchWeather(loc.latitude, loc.longitude);
    setWeather(w);

    // Get Upcoming Passes (Mocked for stability without satellite.js)
    const passes = getMockPasses();
    setNextPasses(passes);
  };

  // 2. Poll ISS Position
  useEffect(() => {
    const tick = async () => {
      const pos = await fetchISSPosition();
      setIssPosition(pos);
    };
    tick();
    const interval = setInterval(tick, 5000);
    return () => clearInterval(interval);
  }, []);

  // 3. Generate Briefing when Pass/Weather/Location are available
  const updateBriefing = useCallback(async () => {
    if (nextPasses.length > 0 && weather && userLocation) {
      setLoadingBriefing(true);
      const pass = nextPasses[selectedPassIndex];
      const data = await generateBriefing(pass, weather, userLocation);
      setBriefing(data);
      setLoadingBriefing(false);
    }
  }, [nextPasses, weather, userLocation, selectedPassIndex]);

  // Initial briefing load
  useEffect(() => {
    if (!briefing && nextPasses.length > 0 && weather && userLocation) {
      updateBriefing();
    }
  }, [updateBriefing, briefing, nextPasses, weather, userLocation]);

  const handlePassSelect = (index: number) => {
    setSelectedPassIndex(index);
    setBriefing(null); 
    // Trigger effect will pick it up
  };

  if (!issPosition) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 animate-pulse">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest mb-4">U-SPACE</h1>
          <p className="text-sm font-mono text-cyan-200/50">衛星リンク接続中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 relative z-10 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <header className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            U-SPACE
          </h1>
          <p className="text-xs md:text-sm font-mono text-cyan-200/60 mt-1 tracking-[0.3em]">
            ISS リアルタイム追跡システム // V2.5
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-white/40 font-mono">現在の高度 (ALTITUDE)</div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {issPosition.altitude.toFixed(2)} <span className="text-xs text-cyan-400/50">KM</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Live Status */}
        <div className="space-y-6">
          <GlassCard title="現在の軌道" accent="cyan">
             <div className="mb-4 flex justify-between items-center font-mono text-xs text-white/60">
                <span>LAT: {issPosition.latitude.toFixed(4)}</span>
                <span>LON: {issPosition.longitude.toFixed(4)}</span>
             </div>
             {/* Pass userLocation to WorldMap */}
             <WorldMap issPosition={issPosition} userLocation={userLocation} />
             <div className="mt-4 flex justify-between items-center">
               <div className="flex flex-col">
                 <span className="text-xs text-white/40">速度 (VELOCITY)</span>
                 <span className="text-lg font-bold font-mono text-white">
                   {(issPosition.velocity).toLocaleString()} <span className="text-xs">km/h</span>
                 </span>
               </div>
               <div className="flex flex-col text-right">
                 <span className="text-xs text-white/40">可視状態 (VISIBILITY)</span>
                 <span className={`text-lg font-bold font-mono uppercase ${issPosition.visibility === 'daylight' ? 'text-amber-400' : 'text-purple-400'}`}>
                   {issPosition.visibility === 'daylight' ? '日照中' : '日陰'}
                 </span>
               </div>
             </div>
          </GlassCard>

          <GlassCard title="現在地の気象" accent="purple">
            {weather ? (
              <div className="flex items-center justify-between">
                 <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{weather.temperature}°C</div>
                    <div className="text-xs text-white/40 uppercase">気温</div>
                 </div>
                 <div className="h-10 w-px bg-white/10"></div>
                 <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{weather.cloudCover}%</div>
                    <div className="text-xs text-white/40 uppercase">雲量</div>
                 </div>
                 <div className="h-10 w-px bg-white/10"></div>
                 <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                      {weather.cloudCover < 30 ? '晴れ' : weather.cloudCover < 70 ? '曇り' : '悪天'}
                    </div>
                    <div className="text-xs text-white/40 uppercase">状況</div>
                 </div>
              </div>
            ) : (
              <div className="text-white/50 animate-pulse text-sm">現地の気象センサーをスキャン中...</div>
            )}
          </GlassCard>
        </div>

        {/* Column 2: Pass Predictions (Center Focus) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Briefing Card - The "Value Add" */}
          <GlassCard title="ミッション・ブリーフィング" accent={briefing?.visibilityScore && briefing.visibilityScore > 70 ? "green" : "amber"} className="min-h-[250px] flex flex-col justify-center">
             {loadingBriefing ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                 <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                 <p className="text-cyan-400 font-mono text-sm animate-pulse">現在地データおよび軌道を解析中...</p>
               </div>
             ) : briefing ? (
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        <span className="text-cyan-400 text-sm block mb-1 tracking-widest">STATUS UPDATE</span>
                        {briefing.headline}
                      </h2>
                    </div>
                    
                    {/* Location Badge */}
                    {briefing.locationName && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-cyan-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        LOCATION: {briefing.locationName}
                      </div>
                    )}

                    <p className="text-lg text-white/80 leading-relaxed font-light border-l-2 border-white/20 pl-4 whitespace-pre-wrap">
                      {briefing.message}
                    </p>
                  </div>
                  
                  {/* Score Circle */}
                  <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                     <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                          <circle cx="50%" cy="50%" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                          <circle 
                            cx="50%" cy="50%" r="40" 
                            stroke={briefing.color} 
                            strokeWidth="8" 
                            fill="none" 
                            strokeDasharray="251"
                            strokeDashoffset={251 - (251 * briefing.visibilityScore) / 100}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="text-2xl font-bold font-mono text-white">{briefing.visibilityScore}%</span>
                     </div>
                     <span className="text-xs uppercase tracking-widest text-white/50 mt-2">観測確率</span>
                  </div>
               </div>
             ) : (
               <div className="text-center py-8">
                 <p className="text-white/40 mb-4">リストから通過予測を選択して解析を開始してください。</p>
                 <button 
                  onClick={updateBriefing}
                  className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded-full text-cyan-300 transition-colors uppercase text-sm tracking-wider font-bold"
                 >
                   解析開始 (ANALYZE)
                 </button>
               </div>
             )}
          </GlassCard>

          {/* Pass List & Radar Split */}
          <div className="grid md:grid-cols-2 gap-6">
             <GlassCard title="今後の通過予報" accent="cyan">
               <div className="space-y-3">
                 {nextPasses.map((pass, idx) => {
                   const date = new Date(pass.risetime * 1000);
                   const isSelected = idx === selectedPassIndex;
                   return (
                     <div 
                        key={idx}
                        onClick={() => handlePassSelect(idx)}
                        className={`
                          p-3 rounded-lg border transition-all cursor-pointer group
                          ${isSelected 
                            ? 'bg-cyan-500/20 border-cyan-500/50' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}
                        `}
                     >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-mono font-bold ${isSelected ? 'text-white' : 'text-cyan-400'}`}>
                            {date.toLocaleDateString('ja-JP', {month: 'numeric', day: 'numeric'})} {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-xs text-white/50 uppercase tracking-wider">
                            {Math.floor(pass.duration / 60)}分 {pass.duration % 60}秒
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-white/60">
                           <span>最大仰角: {pass.maxElevation}°</span>
                           <span className="group-hover:text-cyan-300 transition-colors">
                             {isSelected ? 'TARGET LOCKED' : 'SELECT'}
                           </span>
                        </div>
                     </div>
                   );
                 })}
                 {nextPasses.length === 0 && (
                   <div className="text-center py-4 text-white/30 text-sm">軌道を計算中...</div>
                 )}
               </div>
             </GlassCard>

             <GlassCard title="スカイレーダー" accent="cyan" className="flex items-center justify-center">
                <RadarView pass={nextPasses[selectedPassIndex] || null} />
                <div className="absolute bottom-4 left-0 w-full text-center">
                   <p className="text-xs text-white/40 font-mono uppercase">
                     {nextPasses[selectedPassIndex]?.direction || "Scanning..."}
                   </p>
                </div>
             </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;