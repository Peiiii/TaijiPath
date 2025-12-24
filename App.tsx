
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import TaijiIcon from './components/TaijiIcon';
import { ReflectionEntry, LifePillar } from './types';
import { getTaijiWisdom } from './services/geminiService';

const MOCK_ENTRIES: ReflectionEntry[] = [
  {
    id: '1',
    date: '2024/05/10',
    yinContent: '今日在团队讨论中过于强势，未能听取他人的真实需求。感到了内心的焦躁和对他人的不耐烦。',
    yangContent: '完成了核心代码的重构，并在晨间坚持了30分钟的冥想。主动承担了项目的紧急任务。',
    weaknessTags: ['自负', '急躁', '固执'],
    strengthTags: ['高产', '自律', '担当'],
    scores: { [LifePillar.Health]: 7, [LifePillar.Spirit]: 5, [LifePillar.Career]: 9, [LifePillar.Relations]: 4 },
    aiWisdom: '大音希声，大象无形。你的力量已足够强大，现在的课题是如何在强悍中融入温柔。正如水之德，利万物而不争。',
    balanceScore: 62
  }
];

const App: React.FC = () => {
  const [entries, setEntries] = useState<ReflectionEntry[]>(MOCK_ENTRIES);
  const [currentYin, setCurrentYin] = useState('');
  const [currentYang, setCurrentYang] = useState('');
  const [scores, setScores] = useState<Record<LifePillar, number>>({
    [LifePillar.Health]: 5, [LifePillar.Spirit]: 5, [LifePillar.Career]: 5, [LifePillar.Relations]: 5,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'reflect' | 'history'>('home');

  useEffect(() => {
    const saved = localStorage.getItem('taiji_greatness_entries');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) setEntries(parsed);
    }
  }, []);

  const handleReflect = async () => {
    if (!currentYin || !currentYang) return;
    setIsAnalyzing(true);
    const { wisdom, weaknesses, strengths } = await getTaijiWisdom({ yinContent: currentYin, yangContent: currentYang });
    
    const newEntry: ReflectionEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-CN'),
      yinContent: currentYin,
      yangContent: currentYang,
      weaknessTags: weaknesses,
      strengthTags: strengths,
      scores: { ...scores },
      aiWisdom: wisdom,
      balanceScore: Math.floor(Math.random() * 40) + 60
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('taiji_greatness_entries', JSON.stringify(updated));
    setCurrentYin('');
    setCurrentYang('');
    setIsAnalyzing(false);
    setActiveTab('home');
  };

  const latestEntry = entries[0];
  const chartData = [...entries].reverse().map(e => ({ date: e.date, score: e.balanceScore }));

  return (
    <div className="h-screen flex flex-col bg-[#f4f1ea] overflow-hidden text-[#1a1a1a]">
      {/* 顶部导航 */}
      <nav className="flex-none px-12 py-5 flex justify-between items-center z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <TaijiIcon size={32} animate={false} />
          <span className="serif-font text-lg font-black tracking-tighter">太极：至大无外</span>
        </div>
        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
          {['home', 'reflect', 'history'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)} 
              className={`hover:opacity-40 transition relative pb-1 ${activeTab === tab ? 'border-b-2 border-black' : ''}`}
            >
              {tab === 'home' ? '洞见' : tab === 'reflect' ? '修行' : '格物'}
            </button>
          ))}
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden px-12 pb-8 relative flex flex-col">
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
              <div className="hidden lg:flex flex-col items-end gap-6 border-r border-black/5 pr-12 py-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">YIN · 弊</h4>
                {latestEntry?.weaknessTags.map((tag, i) => (
                  <div key={i} className="text-4xl font-light serif-font opacity-40 hover:opacity-100 transition-all cursor-default writing-vertical">{tag}</div>
                ))}
              </div>
              <div className="flex-none max-w-[25vh] lg:max-w-none">
                <TaijiIcon size={Math.min(window.innerHeight * 0.35, 340)} />
              </div>
              <div className="hidden lg:flex flex-col items-start gap-6 border-l border-black/5 pl-12 py-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">YANG · 优</h4>
                {latestEntry?.strengthTags.map((tag, i) => (
                  <div key={i} className="text-4xl font-bold serif-font hover:tracking-widest transition-all cursor-default writing-vertical">{tag}</div>
                ))}
              </div>
            </div>
            <div className="mt-12 w-full max-w-2xl bg-white/30 backdrop-blur-sm p-8 rounded-[3rem] text-center border border-white/20 shadow-xl">
              <p className="text-lg lg:text-xl serif-font italic leading-relaxed text-gray-700">
                “{latestEntry?.aiWisdom || '大道至简，行而不辍。'}”
              </p>
              <div className="mt-8 flex items-center gap-4 justify-center">
                <span className="text-[10px] font-bold text-gray-400">平衡度</span>
                <div className="h-1 w-32 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-black transition-all duration-1000" style={{ width: `${latestEntry?.balanceScore}%` }} />
                </div>
                <span className="text-xs font-bold serif-font">{latestEntry?.balanceScore}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reflect' && (
          <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
              <div className="flex flex-col">
                <h3 className="flex-none text-[10px] font-bold tracking-widest uppercase mb-3 opacity-40">阴之卷 · 察己之过</h3>
                <textarea 
                  className="flex-1 bg-white/40 border border-black/5 rounded-[2.5rem] p-8 focus:bg-white transition-all outline-none text-base serif-font leading-relaxed resize-none custom-scrollbar"
                  placeholder="反思今日之不足..."
                  value={currentYin}
                  onChange={(e) => setCurrentYin(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <h3 className="flex-none text-[10px] font-bold tracking-widest uppercase mb-3 opacity-40">阳之卷 · 励己之行</h3>
                <textarea 
                  className="flex-1 bg-black text-white rounded-[2.5rem] p-8 focus:ring-4 focus:ring-black/5 outline-none text-base serif-font leading-relaxed resize-none custom-scrollbar shadow-2xl"
                  placeholder="记录今日之进取..."
                  value={currentYang}
                  onChange={(e) => setCurrentYang(e.target.value)}
                />
              </div>
            </div>
            
            {/* 底部滑块控制区 - 深度优化布局 */}
            <div className="flex-none mt-6 bg-white/60 p-4 lg:p-6 rounded-[3rem] flex flex-col lg:flex-row gap-6 items-center border border-white/80 shadow-sm">
               <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4 w-full px-4">
                 {Object.values(LifePillar).map(pillar => (
                   <div key={pillar} className="flex flex-col gap-3">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] font-bold serif-font opacity-60 tracking-tighter">{pillar}</span>
                       <span className="text-[10px] font-mono opacity-30">{scores[pillar]}</span>
                     </div>
                     <input 
                       type="range" min="1" max="10" 
                       value={scores[pillar]}
                       onChange={(e) => setScores({ ...scores, [pillar]: parseInt(e.target.value) })}
                     />
                   </div>
                 ))}
               </div>
               <div className="flex-none w-full lg:w-auto lg:border-l lg:border-black/5 lg:pl-8">
                 <button 
                   onClick={handleReflect}
                   disabled={isAnalyzing || !currentYin || !currentYang}
                   className="group relative w-full lg:w-36 py-4 bg-[#1a1a1a] text-white rounded-[2rem] font-bold transition-all hover:bg-black active:scale-95 disabled:opacity-20 disabled:active:scale-100 flex items-center justify-center gap-3 overflow-hidden"
                 >
                   <div className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none`}></div>
                   {isAnalyzing ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <span className="relative z-10 serif-font text-lg tracking-widest">入格</span>
                   )}
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-hidden">
            <header className="flex-none flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold serif-font italic">功过往昔</h2>
               <div className="w-32 h-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area type="monotone" dataKey="score" stroke="#000" fill="#000" fillOpacity={0.05} />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-gray-400">{entry.date}</span>
                    <div className="flex gap-2">
                      {entry.strengthTags.slice(0, 2).map(t => <span key={t} className="px-2 py-0.5 bg-black/5 text-[9px] font-bold rounded-md uppercase">{t}</span>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-xs text-gray-500 leading-relaxed mb-4">
                    <p className="border-l-2 border-gray-200 pl-3 italic">{entry.yinContent.substring(0, 60)}...</p>
                    <p className="border-l-2 border-black/20 pl-3 text-gray-800">{entry.yangContent.substring(0, 60)}...</p>
                  </div>
                  <div className="text-[11px] serif-font text-gray-400 bg-white/40 p-3 rounded-xl italic">
                    “{entry.aiWisdom}”
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="flex-none py-2 text-center pointer-events-none opacity-20">
        <span className="text-[7px] uppercase tracking-[0.8em]">Inner Balance · Outer Greatness</span>
      </footer>
    </div>
  );
};

export default App;
