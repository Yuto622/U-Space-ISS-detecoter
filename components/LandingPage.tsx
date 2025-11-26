import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="max-w-5xl w-full mx-auto space-y-16 flex flex-col items-center relative z-20">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-[fadeIn_1s_ease-out]">
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-white/20 tracking-tighter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            U-SPACE
          </h1>
          <p className="text-lg md:text-2xl text-cyan-200/80 font-mono tracking-[0.4em] uppercase border-y border-white/10 py-4 inline-block">
            International Space Station Tracker
          </p>
        </div>

        {/* Introduction Cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full animate-[slideUp_1s_ease-out_0.3s_both]">
          <div className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:bg-white/[0.07] hover:border-cyan-500/30 transition-all duration-300">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">🛰️</div>
            <h3 className="text-xl font-bold text-white mb-3 font-mono">ISSとは？</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              地上400kmを飛行する人類史上最大の宇宙実験施設。サッカーコートほどの巨大な建造物が、重力と遠心力の釣り合いの中で浮かんでいます。
            </p>
          </div>

          <div className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:bg-white/[0.07] hover:border-purple-500/30 transition-all duration-300">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">⚡</div>
            <h3 className="text-xl font-bold text-white mb-3 font-mono">秒速7.7kmの世界</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              時速約27,700kmという猛スピードで移動し、地球をわずか90分で一周します。中にいる宇宙飛行士は、1日に16回の日の出を目撃します。
            </p>
          </div>

          <div className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:bg-white/[0.07] hover:border-green-500/30 transition-all duration-300">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">👀</div>
            <h3 className="text-xl font-bold text-white mb-3 font-mono">夜空を駆ける光</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              太陽光を反射して輝くため、条件が良いときは一等星以上の明るさで見えます。U-Spaceは、その「感動の瞬間」を正確に予測します。
            </p>
          </div>
        </div>

        {/* Main Description */}
        <div className="max-w-2xl text-center space-y-4 animate-[fadeIn_1s_ease-out_0.6s_both]">
           <p className="text-white/80 text-lg font-light leading-relaxed">
             <span className="text-cyan-400 font-bold">「今夜、宇宙ステーションが見える」</span><br/>
             その情報を、あなたの場所に合わせてリアルタイムにお届けします。
           </p>
        </div>

        {/* CTA Button */}
        <div className="animate-[fadeIn_1s_ease-out_0.9s_both]">
          <button 
            onClick={onEnter}
            className="group relative px-16 py-5 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-3 text-white font-bold tracking-[0.2em] text-lg font-mono">
              SYSTEM LAUNCH
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </span>
          </button>
          <p className="mt-4 text-center text-white/20 text-xs font-mono tracking-widest">
            INITIALIZING ORBITAL DATA LINK...
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;