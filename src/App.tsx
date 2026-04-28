
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Brain, 
  Trophy, 
  BarChart2, 
  Hand, 
  Palette, 
  Camera, 
  Package,
  ChevronLeft,
  Moon,
  Sun,
  Layers,
  Search,
  Type,
  CheckCircle2,
  Download,
  Upload,
  ArrowLeft,
  Users,
  LogOut,
  X,
  Plus,
  Minus,
  TrendingUp,
  Zap,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Line, ComposedChart } from 'recharts';
import confetti from 'canvas-confetti';
import { useAppStore } from './store';
import { ModuleId, PALETA_CORES, ITENS_CATEGORIAS, FOTOS_MEMORIA } from './constants';

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const base = "rounded-[24px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg text-2xl py-6 px-8 select-none border-b-8";
  const variants: any = {
    primary: "bg-blue-500 text-white border-blue-700 hover:bg-blue-600",
    secondary: "bg-gray-400 text-white border-gray-600 hover:bg-gray-500",
    accent: "bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-600",
    warning: "bg-amber-400 text-black border-amber-600 hover:bg-amber-500",
    ghost: "bg-white text-brand-dark border-divider hover:bg-gray-50"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

// --- Module 1: Toque Luz ---
const ToqueLuz = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.TOQUE_LUZ].nivel;
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'ready' | 'result'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [message, setMessage] = useState('Toque para começar');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRound = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setReactionTime(null);
    setGameState('countdown');
    setCountdown(3);
    setMessage('');
    
    let count = 3;
    setCountdown(3);
    timerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 1) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setGameState('ready');
        setStartTime(Date.now());
        setCountdown(1);
        setMessage('CLIQUE AGORA!');
      } else {
        setCountdown(count);
      }
    }, 1000); // 1 segundo exato para o ritmo
  };

  const handleTap = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (gameState === 'idle' || gameState === 'result') {
      startRound();
    } else if (gameState === 'countdown') {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setGameState('result');
      setMessage('Cedo demais! Espere o Verde.');
      addPoints(ModuleId.TOQUE_LUZ, 0, 1);
    } else if (gameState === 'ready') {
      const time = (Date.now() - startTime) / 1000;
      setReactionTime(time);
      setGameState('result');
      
      const isError = time > 1.0;
      const points = Math.max(10, Math.floor((0.8 / Math.max(0.1, time)) * 30));
      
      setMessage(`${Math.floor(time * 1000)}ms`);
      if (!isError) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } else {
        setMessage(`${Math.floor(time * 1000)}ms (Lento)`);
      }
      addPoints(ModuleId.TOQUE_LUZ, points, isError ? 1 : 0);
    }
  };

  const getTrafficColor = () => {
    if (gameState === 'ready') return 'bg-emerald-500';
    if (gameState === 'countdown') {
      if (countdown === 3) return 'bg-red-500';
      if (countdown === 2) return 'bg-amber-400';
      if (countdown === 1) return 'bg-emerald-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-6" onClick={handleTap}>
      {gameState === 'countdown' || gameState === 'ready' ? (
        <div 
          className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center font-black text-white select-none leading-none shadow-2xl border-[12px] border-brand-divider ${getTrafficColor()}`}
        >
          {gameState === 'ready' ? (
            <span className="text-[50px] sm:text-[70px] text-center leading-tight">CLIQUE<br/>AGORA!</span>
          ) : (
            <span className="text-[180px] sm:text-[240px]">{countdown}</span>
          )}
        </div>
      ) : (
        <motion.div 
          key="game-idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`w-full max-w-sm aspect-square rounded-[60px] shadow-3xl flex flex-col items-center justify-center gap-4 sm:gap-6 border-[8px] sm:border-[12px] border-brand-divider p-8 sm:p-12 transition-all duration-300 ${
            gameState === 'result' ? 'bg-brand-divider/40 text-brand-dark' : 'bg-blue-500 text-white'
          }`}
        >
          <Hand className={`w-20 h-20 sm:w-28 sm:h-28 ${gameState === 'result' ? 'text-blue-500' : 'text-white'}`} />
          <span className="text-2xl sm:text-4xl font-black text-center leading-tight">{message}</span>
          {(gameState === 'idle' || gameState === 'result') && (
            <span className={`text-lg font-bold px-6 py-2 rounded-full mt-2 ${gameState === 'result' ? 'bg-brand-divider text-brand-dark' : 'bg-black/20 text-white'}`}>Toque para começar</span>
          )}
        </motion.div>
      )}
    </div>
  );
};

// --- Module 2: Cor Igual ---
const CorIgual = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.COR_IGUAL].nivel;
  const [options, setOptions] = useState<any[]>([]);
  const [target, setTarget] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const generateLevel = () => {
    setIsLocked(false);
    setErrorCount(0);
    // Níveis 2 a 10 cores
    const numOptions = Math.min(Math.max(2, nivel + 1), 10);
    const shuffled = [...PALETA_CORES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numOptions);
    const chosen = selected[Math.floor(Math.random() * selected.length)];
    setOptions(selected);
    setTarget(chosen);
    setFeedback('');
  };

  useEffect(() => { generateLevel(); }, [nivel]);

  const handleChoice = (choice: any) => {
    if (isLocked) return;
    setIsLocked(true);
    
    if (choice.codigo === target.codigo) {
      setFeedback('Muito bem!');
      confetti({ particleCount: 40, spread: 50 });
      addPoints(ModuleId.COR_IGUAL, 50 * nivel, errorCount);
      setTimeout(generateLevel, 1500);
    } else {
      setFeedback('Ops! Tente novamente.');
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('');
        setIsLocked(false);
      }, 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 gap-8 sm:gap-12 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-wider text-brand-dark">Qual cor é esta?</h2>
        <div 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl mx-auto shadow-2xl border-8 border-brand-divider ring-8 ring-brand-divider/20"
          style={{ backgroundColor: target?.codigo }}
        />
      </div>
      
      <div className={`grid gap-4 sm:gap-6 w-full max-w-2xl px-4 ${options.length > 6 ? 'grid-cols-4' : 'grid-cols-2 lg:grid-cols-3'}`}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleChoice(opt)}
            className="aspect-square rounded-[24px] sm:rounded-[32px] shadow-lg border-[4px] sm:border-[6px] border-brand-divider active:scale-95 transition-all flex items-center justify-center hover:shadow-2xl"
            style={{ backgroundColor: opt.codigo }}
          >
            <span className="sr-only">{opt.nome}</span>
          </button>
        ))}
      </div>
      
      <div className="h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.p 
              key={feedback}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-xl sm:text-2xl font-black text-blue-500 uppercase"
            >
              {feedback}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Module 3: Memória das Fotos ---
const MemoriaFotos = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.MEMORIA_FOTOS].nivel;
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const initGame = () => {
    // level 1 = 2 cards (1 pair), level 6 = 12 cards (6 pairs)
    const actualPairs = Math.min(Math.max(1, nivel), 6);
    
    let selectedPhotos = [...FOTOS_MEMORIA].sort(() => 0.5 - Math.random()).slice(0, actualPairs);
    let gameCards = [...selectedPhotos, ...selectedPhotos]
      .sort(() => 0.5 - Math.random())
      .map((p, i) => ({ ...p, uniqueId: i }));
      
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setIsLocked(false);
  };

  useEffect(() => { initGame(); }, [nivel]);

  const handleTap = (index: number) => {
    if (isLocked || flipped.includes(index) || matched.includes(cards[index].id)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setMatched(prev => [...prev, cards[first].id]);
        setFlipped([]);
        
        if (matched.length + 1 === cards.length / 2) {
          confetti({ particleCount: 60, spread: 60 });
          addPoints(ModuleId.MEMORIA_FOTOS, 150 * nivel);
          setTimeout(initGame, 2000);
        } else {
          setIsLocked(false);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8">
      <div 
        className="grid gap-4 w-full max-w-3xl" 
        style={{ 
          gridTemplateColumns: `repeat(${cards.length <= 4 ? 2 : cards.length <= 8 ? 3 : 4}, minmax(0, 1fr))` 
        }}
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            onClick={() => handleTap(idx)}
            className="aspect-square cursor-pointer"
          >
            <motion.div 
              animate={{ rotateY: matched.includes(card.id) || flipped.includes(idx) ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full"
            >
              <div 
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 bg-blue-500 rounded-[24px] sm:rounded-3xl flex items-center justify-center text-5xl text-white shadow-xl border-4 border-brand-divider"
              >
                ?
              </div>
              <div 
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                className="absolute inset-0 bg-card-bg rounded-[24px] sm:rounded-3xl flex items-center justify-center text-5xl sm:text-7xl shadow-xl border-4 border-brand-divider"
              >
                {card.emoji}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Module 4: Caixa de Separação ---
const CaixaSeparacao = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.CAIXA_SEPARACAO].nivel;
  const [item, setItem] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const generateNext = () => {
    setIsLocked(false);
    setErrorCount(0);
    const allCats = Array.from(new Set(ITENS_CATEGORIAS.map(i => i.categoria)));
    // Níveis 1 a 5: 2 a 6 caixas
    const numCats = Math.min(nivel + 1, 6);
    const selectedCats = allCats.sort(() => 0.5 - Math.random()).slice(0, numCats);
    const possibleItems = ITENS_CATEGORIAS.filter(i => selectedCats.includes(i.categoria));
    const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
    
    setCategories(selectedCats);
    setItem(randomItem);
    setFeedback('');
  };

  useEffect(() => { generateNext(); }, [nivel]);

  const handleDrop = (cat: string) => {
    if (isLocked) return;
    setIsLocked(true);

    if (cat === item.categoria) {
      setFeedback('Muito bem!');
      confetti({ particleCount: 20, gravity: 0.8 });
      addPoints(ModuleId.CAIXA_SEPARACAO, 25 * nivel, errorCount);
      setTimeout(generateNext, 1000);
    } else {
      setFeedback(`Ops! Tente novamente.`);
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('');
        setIsLocked(false);
      }, 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 gap-8 sm:gap-14 overflow-y-auto">
      <motion.div 
        key={item?.nome}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <span className="text-8xl sm:text-[120px] drop-shadow-xl select-none">{item?.imagem}</span>
        <h2 className="text-3xl sm:text-5xl font-black mt-2 uppercase text-brand-dark">{item?.nome}</h2>
      </motion.div>

      <div className={`grid gap-3 sm:gap-6 w-full max-w-4xl px-4 ${categories.length > 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleDrop(cat)}
            className="py-8 sm:py-10 bg-card-bg border-4 border-dashed border-brand-divider rounded-[24px] sm:rounded-[40px] flex flex-col items-center justify-center gap-2 sm:gap-3 hover:border-blue-400 hover:bg-blue-500/10 transition-all shadow-sm active:scale-95 text-brand-dark"
          >
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-brand-dark/30" />
            <span className="text-lg sm:text-2xl font-black uppercase tracking-tight">{cat}</span>
          </button>
        ))}
      </div>

      <div className="h-8">
        <AnimatePresence mode="wait">
          {feedback && <motion.p key={feedback} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black text-emerald-500">{feedback}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};


// --- Module 5: Sequência Lógica ---
const SequenciaLogica = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.SEQUENCIA_LOGICA].nivel;
  const emojis = ['🐶', '🐱', '🐥', '🦁', '🐘', '🐸'];
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [playingSequence, setPlayingSequence] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('Preste atenção na sequência');
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const startNewLevel = async () => {
    const length = 2 + Math.floor(nivel / 3);
    setErrorCount(0);
    const newSeq = Array.from({ length }, () => Math.floor(Math.random() * emojis.length));
    setSequence(newSeq);
    setUserSequence([]);
    setIsLocked(true);
    
    setCountdown(3);
    setFeedback('Prepare-se...');
    await new Promise(r => setTimeout(r, 800));
    setCountdown(2);
    await new Promise(r => setTimeout(r, 800));
    setCountdown(1);
    await new Promise(r => setTimeout(r, 800));
    setCountdown(null);
    
    setFeedback('Olhe a sequência...');
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    setPlayingSequence(true);
    setIsLocked(true);
    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await new Promise(r => setTimeout(r, 600));
      setActiveIndex(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setPlayingSequence(false);
    setIsLocked(false);
    setFeedback('Sua vez! Repita a sequência');
  };

  useEffect(() => { startNewLevel(); }, [nivel]);

  const handlePress = (idx: number) => {
    if (playingSequence || isLocked) return;

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);
    
    if (idx !== sequence[userSequence.length]) {
      setFeedback('Ops! Sequência errada.');
      setIsLocked(true);
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setIsLocked(false);
        setUserSequence([]);
        setFeedback('Tente novamente! Olhe a sequência...');
        playSequence(sequence);
      }, 1500);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setFeedback('CORRETO! Arrasou!');
      setIsLocked(true);
      confetti({ particleCount: 40, spread: 60 });
      addPoints(ModuleId.SEQUENCIA_LOGICA, 40 * nivel, errorCount);
      setTimeout(startNewLevel, 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 gap-8 sm:gap-12 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-black uppercase tracking-widest mb-2">{feedback}</h2>
        <div className="flex justify-center gap-2 h-14">
          {sequence.map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < userSequence.length ? 'bg-emerald-500' : 'bg-brand-divider'}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg px-2 relative overflow-hidden">
        {countdown !== null && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            key={countdown}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <span className="text-9xl font-black text-blue-500 drop-shadow-2xl">{countdown}</span>
          </motion.div>
        )}
        {emojis.map((emoji, idx) => (
          <motion.button
            key={idx}
            initial={false}
            animate={{ 
              scale: activeIndex === idx ? 1.15 : 1,
            }}
            onClick={() => handlePress(idx)}
            className={`aspect-square rounded-[32px] sm:rounded-[40px] shadow-lg border-[4px] sm:border-[8px] border-brand-divider flex items-center justify-center text-4xl sm:text-6xl active:scale-90 transition-all ${activeIndex === idx ? 'z-10 shadow-blue-500/30 bg-blue-500 text-white' : 'bg-card-bg text-brand-dark'}`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- Module 6: Matemática Fácil ---
const MatematicaFacil = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.MATEMATICA_FACIL].nivel;
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const generateProblem = () => {
    setIsLocked(false);
    setErrorCount(0);
    const range = 5 + nivel * 2;
    const a = Math.floor(Math.random() * range) + 1;
    const b = Math.floor(Math.random() * range) + 1;
    const isAdd = Math.random() > 0.4;
    
    const q = isAdd ? `${a} + ${b}` : `${a + b} - ${a}`;
    const ans = isAdd ? a + b : b;
    
    setProblem({ q, a: ans });

    const opts = [ans];
    while (opts.length < 4) {
      const wrong = ans + Math.floor(Math.random() * 10) - 5;
      if (wrong !== ans && wrong > 0 && !opts.includes(wrong)) {
        opts.push(wrong);
      }
    }
    setOptions(opts.sort(() => 0.5 - Math.random()));
    setFeedback('');
  };

  useEffect(() => { generateProblem(); }, [nivel]);

  const handleChoice = (val: number) => {
    if (isLocked) return;
    setIsLocked(true); // Bloqueia imediatamente

    if (val === problem.a) {
      setFeedback('Correto! 👏');
      confetti({ particleCount: 30, spread: 40 });
      addPoints(ModuleId.MATEMATICA_FACIL, 40 * nivel, errorCount);
      setTimeout(generateProblem, 1500);
    } else {
      setFeedback('Tente de novo!');
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('');
        setIsLocked(false);
      }, 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 gap-8 sm:gap-12 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-black text-brand-dark/40 uppercase tracking-widest mb-4">Quanto é?</h2>
        <div className="bg-blue-500 text-white rounded-[32px] sm:rounded-[40px] px-8 sm:px-12 py-6 sm:py-8 text-5xl sm:text-8xl font-black shadow-2xl border-[6px] sm:border-[8px] border-brand-divider">
          {problem.q}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl px-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoice(opt)}
            className="bg-card-bg py-6 sm:py-8 rounded-[24px] sm:rounded-[32px] text-3xl sm:text-5xl font-black shadow-lg border-b-[6px] sm:border-b-8 border-brand-divider hover:border-blue-500 active:scale-95 transition-all text-brand-dark"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="h-10 flex items-center justify-center">
        <AnimatePresence>
          {feedback && <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl sm:text-3xl font-black text-emerald-500 uppercase">{feedback}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Module 7: Busca Visual ---
const BuscaVisual = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.BUSCA_VISUAL].nivel;
  const [items, setItems] = useState<string[]>([]);
  const [target, setTarget] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const generateLevel = () => {
    setIsLocked(false);
    setErrorCount(0);
    setFeedback('');
    
    const emojiList = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕', '🫒', '🫑', '🥔', '🍠'];
    const chosen = emojiList.sort(() => 0.5 - Math.random());
    const mainEmoji = chosen[0];
    const intruderEmoji = chosen[1];
    
    // Nível 1: 4 itens, Nível 10: 25 itens
    const count = Math.min(4 + nivel * 2, 25);
    const grid = Array(count).fill(mainEmoji);
    const intruderPos = Math.floor(Math.random() * count);
    grid[intruderPos] = intruderEmoji;
    
    setItems(grid);
    setTarget(intruderEmoji);
  };

  useEffect(() => { generateLevel(); }, [nivel]);

  const handleTap = (emoji: string) => {
    if (isLocked) return;
    setIsLocked(true);

    if (emoji === target) {
      setFeedback('Encontrou! 🔍');
      confetti({ particleCount: 30, spread: 40 });
      addPoints(ModuleId.BUSCA_VISUAL, 50 * nivel, errorCount);
      setTimeout(generateLevel, 1500);
    } else {
      setFeedback('Tente procurar melhor...');
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('');
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 gap-8 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-4xl font-black uppercase mb-2 text-brand-dark">Encontre o diferente!</h2>
        <p className="text-brand-dark/40 font-bold uppercase tracking-widest">Apenas um é intruso</p>
      </div>

      <div className="grid gap-3 sm:gap-4 p-4 bg-card-bg/50 rounded-[40px] border-4 border-brand-divider shadow-xl" 
           style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(items.length))}, minmax(0, 1fr))` }}>
        {items.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => handleTap(emoji)}
            className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-5xl hover:bg-brand-divider/20 rounded-2xl transition-all active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="h-10">
        <AnimatePresence>
          {feedback && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black text-blue-500 uppercase">{feedback}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Module 8: Stroop Test ---
const StroopTest = () => {
  const { modulos, addPoints } = useAppStore();
  const nivel = modulos[ModuleId.STROOP_TEST].nivel;
  const [target, setTarget] = useState({ text: '', color: '' });
  const [options, setOptions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const generateLevel = () => {
    setIsLocked(false);
    setErrorCount(0);
    setFeedback('');
    
    const colors = [
      { nome: 'Vermelho', codigo: '#EF4444' },
      { nome: 'Azul', codigo: '#3B82F6' },
      { nome: 'Verde', codigo: '#10B981' },
      { nome: 'Amarelo', codigo: '#FBBF24' }
    ];
    
    const textIdx = Math.floor(Math.random() * colors.length);
    const colorIdx = Math.floor(Math.random() * colors.length);
    
    setTarget({ text: colors[textIdx].nome, color: colors[colorIdx].codigo });
    setOptions(colors.sort(() => 0.5 - Math.random()));
  };

  useEffect(() => { generateLevel(); }, [nivel]);

  const handleChoice = (color: any) => {
    if (isLocked) return;
    setIsLocked(true);

    if (color.codigo === target.color) {
      setFeedback('Correto! 🎨');
      confetti({ particleCount: 30, spread: 40 });
      addPoints(ModuleId.STROOP_TEST, 60 * nivel, errorCount);
      setTimeout(generateLevel, 1500);
    } else {
      setFeedback('Cuidado com o texto!');
      setErrorCount(prev => prev + 1);
      setTimeout(() => {
        setFeedback('');
        setIsLocked(false);
      }, 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-8 gap-12 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-black text-brand-dark/40 uppercase tracking-widest mb-6">Qual é a COR da tinta?</h2>
        <div 
          className="text-6xl sm:text-8xl font-black uppercase tracking-tighter drop-shadow-lg"
          style={{ color: target.color }}
        >
          {target.text}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoice(opt)}
            className="py-6 sm:py-10 rounded-[32px] bg-card-bg border-b-8 border-brand-divider font-black text-xl sm:text-2xl uppercase tracking-tighter text-brand-dark hover:border-blue-500 active:scale-95 transition-all shadow-md"
          >
            {opt.nome}
          </button>
        ))}
      </div>

      <div className="h-10">
        <AnimatePresence>
          {feedback && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black text-red-500 uppercase">{feedback}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- FAQ Component ---
const FAQ = () => {
  const { configuracoes } = useAppStore();
  
  const faqs = [
    {
      q: "Como funciona a Importação e Exportação de Dados?",
      a: "O Mente Ativa não utiliza bancos de dados em nuvem para garantir a total privacidade do seu histórico. Todo o progresso é salvo localmente no seu navegador. Você pode 'Exportar' um arquivo JSON com todos os dados e 'Importar' em outro momento ou dispositivo para continuar de onde parou. Isso elimina qualquer risco de vazamento de dados em servidores externos."
    },
    {
      q: "Os dados são seguros?",
      a: "Totalmente. Como os dados residem apenas na memória local do seu navegador ou no arquivo que você mesmo controla, não há processamento externo. Você é o único dono das suas informações de desempenho."
    },
    {
       q: "Quais são os jogos disponíveis?",
       a: "Temos 8 modalidades: Toque Luz (reflexo), Cor Igual (percepção), Memória (visual), Caixa de Separação (categorização), Sequência Lógica (memória de trabalho), Matemática (raciocínio quantitativo), Busca Visual (atenção seletiva) e Stroop Test (controle inibitório)."
    },
    {
      q: "Como as dificuldades funcionam?",
      a: "Conforme o usuário acerta sem erros, o nível sobe automaticamente, aumentando a complexidade (mais itens, cores ou tempo reduzido). É possível ajustar o nível manualmente no menu principal para adaptar ao perfil de cada um."
    }
  ];

  const gameDetails = [
    { id: ModuleId.TOQUE_LUZ, name: "Toque Luz", goal: "Treina tempo de reação e atenção sustentada. O objetivo é tocar o círculo exatamente quando ele ficar verde." },
    { id: ModuleId.COR_IGUAL, name: "Cor Igual", goal: "Estimula percepção visual e reconhecimento de padrões. Identifique a cor central entre as opções abaixo." },
    { id: ModuleId.MEMORIA_FOTOS, name: "Memória das Fotos", goal: "Trabalha a memória episódica visual. Encontre os pares de cartas idênticas." },
    { id: ModuleId.CAIXA_SEPARACAO, name: "Caixa de Separação", goal: "Foca em categorização semântica e funções executivas. Arraste ou clique no item para a categoria correta." },
    { id: ModuleId.SEQUENCIA_LOGICA, name: "Sequência Lógica", goal: "Melhora a memória de trabalho. Repita a sequência de emojis mostrada na tela." },
    { id: ModuleId.MATEMATICA_FACIL, name: "Matemática Fácil", goal: "Mantém o raciocínio numérico ativo com operações básicas de adição e subtração." },
    { id: ModuleId.BUSCA_VISUAL, name: "Busca Visual", goal: "Treina a atenção seletiva periférica. Encontre o único emoji diferente em um mar de repetidos." },
    { id: ModuleId.STROOP_TEST, name: "Stroop Test", goal: "Desafio clássico de interferência cognitiva. Você deve ignorar a palavra escrita e focar apenas na cor da tinta." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-blue-500 text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 relative z-10">Dúvidas Frequentes</h2>
        <p className="text-blue-100 text-lg font-medium relative z-10">Entenda como aproveitar ao máximo a plataforma Mente Ativa.</p>
        <Brain className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 rotate-12" />
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-widest px-4 border-l-8 border-blue-500">Guia Geral</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card-bg p-8 rounded-[32px] shadow-sm border border-brand-divider">
              <h4 className="font-black text-blue-500 text-lg mb-3 uppercase leading-tight">{faq.q}</h4>
              <p className="text-brand-dark/60 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-widest px-4 border-l-8 border-emerald-500">Manual dos Jogos</h3>
        <div className="grid grid-cols-1 gap-4">
          {gameDetails.map((game) => (
            <div key={game.id} className="bg-card-bg p-6 rounded-[24px] shadow-sm border border-brand-divider flex items-start gap-4">
               <div className="w-12 h-12 rounded-2xl bg-brand-divider/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
               </div>
               <div>
                  <h4 className="font-black text-brand-dark uppercase tracking-tight">{game.name}</h4>
                  <p className="text-brand-dark/60 text-sm font-medium">{game.goal}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-dark text-white p-10 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black uppercase mb-1">Fale com o Desenvolvedor</h3>
          <p className="text-white/60 font-medium">Sugestões, melhorias ou suporte técnico?</p>
        </div>
        <div className="bg-white/10 px-8 py-6 rounded-[24px] border border-white/20 text-center">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Contato Direto</p>
          <a href="mailto:brunorizzo@outlook.com" className="text-xl font-black hover:text-blue-400 transition-colors">
            brunorizzo@outlook.com
          </a>
          <p className="text-xs text-white/40 mt-2 font-bold uppercase">Bruno Rizzo</p>
        </div>
      </div>
    </div>
  );
};

// --- Report Component ---
const Relatorio = () => {
  const { historico, modulos, pontosTotal, nivelGlobal, resetStore, jogador } = useAppStore();
  
  const getModuleStats = (id: string) => {
    const sessions = historico.filter(s => s.moduleId === id);
    const avgPoints = sessions.length ? Math.floor(sessions.reduce((a, b) => a + b.points, 0) / sessions.length) : 0;
    const totalErrors = sessions.reduce((acc, s) => acc + (s.errors || 0), 0);
    return { avgPoints, sessions: sessions.length, totalErrors };
  };

  // Prepara dados para o gráfico geral
  const chartData = historico.slice(-20).map((h, i) => ({
    name: i + 1,
    pts: h.points,
    err: h.errors || 0,
    modulo: h.moduleId.split('_').pop()
  }));

  const getModuleChartData = (id: string) => {
    return historico
      .filter(h => h.moduleId === id)
      .slice(-15)
      .map((h, i) => ({
        name: i + 1,
        pts: h.points > 0 ? 1 : 0,
        err: h.errors || 0
      }));
  };

  const handleReset = () => {
    if (confirm('ATENÇÃO: Você irá apagar todo o progresso atual. Deseja continuar?')) {
      localStorage.clear();
      resetStore();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-card-bg p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] shadow-xl border-b-8 border-brand-divider flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black uppercase text-brand-dark tracking-tighter">Resumo de {jogador?.nome}</h2>
          <p className="text-brand-dark/50 text-xl font-medium">Evolução do treinamento cognitivo</p>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <div className="bg-blue-500/10 px-8 py-6 rounded-[32px] text-center shadow-inner">
            <p className="text-sm font-black text-blue-500/70 uppercase tracking-widest mb-1">PONTOS TOTAL</p>
            <p className="text-4xl font-black text-blue-600 leading-none">{pontosTotal.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-500/10 px-8 py-6 rounded-[32px] text-center shadow-inner">
            <p className="text-sm font-black text-emerald-500/70 uppercase tracking-widest mb-1">NÍVEL MÉDIO</p>
            <p className="text-4xl font-black text-emerald-600 leading-none">{nivelGlobal}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Object.entries(modulos).map(([id, stats]) => {
          const report = getModuleStats(id);
          return (
            <div key={id} className="bg-card-bg p-10 rounded-[48px] shadow-sm border-l-8 border-blue-500 space-y-6">
              <div className="flex flex-col gap-6">
                <div className="bg-brand-divider/20 p-6 rounded-[32px]">
                  <div className="flex gap-4 mb-6 items-center justify-between">
                    <h3 className="text-2xl font-black uppercase text-brand-dark tracking-tight leading-tight">{id.replace(/_/g, ' ')}</h3>
                    <span className="text-blue-500 font-black bg-blue-500/10 px-4 py-1 rounded-full text-sm tracking-wide shrink-0">NV. {stats.nivel}</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <p className="text-xs font-black text-brand-dark/40 uppercase tracking-widest mb-1">SESSÕES</p>
                      <p className="text-2xl font-black text-brand-dark">{stats.totalJogadas}</p>
                    </div>
                    {id !== ModuleId.MEMORIA_FOTOS && (
                      <div className="flex-1">
                        <p className="text-xs font-black text-red-500/60 uppercase tracking-widest mb-1">ERROS</p>
                        <p className="text-2xl font-black text-red-500">{report.totalErrors}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="h-[220px] bg-card-bg p-6 rounded-[36px] border border-brand-divider shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={getModuleChartData(id)} margin={{ top: 10, right: 10, bottom: 0, left: -30 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                      <XAxis dataKey="name" hide />
                      <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: 'currentColor' }} className="opacity-50" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card-bg)', 
                          color: 'var(--text-color)',
                          borderRadius: '16px', 
                          border: '1px solid var(--border-color)', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                          fontSize: '11px' 
                        }}
                        labelStyle={{ display: 'none' }}
                      />
                      <Bar dataKey="pts" name="Sucessos" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={16} />
                      {id !== ModuleId.MEMORIA_FOTOS && (
                        <Line type="monotone" dataKey="err" name="Erros" stroke="#EF4444" strokeWidth={3} dot={{ r: 3, fill: '#EF4444', strokeWidth: 0 }} />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-red-500/10 p-8 rounded-[40px] border-2 border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-red-500 uppercase mb-1">Zona de Perigo</h3>
          <p className="text-brand-dark/60 font-medium">Os dados apagados não podem ser recuperados.</p>
        </div>
        <button 
          onClick={handleReset}
          className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg border-b-4 border-red-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <X className="w-6 h-6" /> LIMPAR TUDO
        </button>
      </div>
    </div>
  );
};

// --- App Layout & Nav ---

export default function App() {
  const { 
    jogador, 
    setPlayer, 
    nivelGlobal, 
    pontosTotal, 
    modulos, 
    updateGlobalProgression,
    setModuleLevel,
    configuracoes,
    toggleTheme,
    resetStore,
    importStore
  } = useAppStore();
  
  const [activeScreen, setActiveScreen] = useState<'hub' | 'intro' | 'report' | string>('intro');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isInstalled) {
        alert('O aplicativo já está instalado!');
      } else {
        alert('Para instalar este app:\n\n1. No Chrome: Clique nos três pontinhos ⋮ e depois em "Instalar Aplicativo".\n2. No Safari (iOS): Toque no botão Compartilhar ⎙ e escolha "Adicionar à Tela de Início".');
      }
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Erro na instalação:', error);
    }
  };

  const handleSwitchPatient = () => {
    if (confirm('Deseja sair para trocar de usuário? Salve os dados antes se necessário (Exportar JSON no Relatório).')) {
      resetStore();
    }
  };

  useEffect(() => {
    if (jogador) {
       setActiveScreen('hub');
       updateGlobalProgression();
    }
  }, [jogador]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) setPlayer(tempName.trim());
  };

  const getModuleLabel = (id: string) => id.replace(/_/g, ' ').toUpperCase();

  const handleExport = () => {
    const state = useAppStore.getState();
    import('./store').then(m => m.exportStoreData(state));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (importStore(data)) {
          alert('Dados importados com sucesso!');
          setActiveScreen('hub');
        } else {
          alert('Arquivo inválido ou corrompido para este sistema.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo.');
      }
    };
    reader.readAsText(file);
  };

  if (activeScreen === 'intro' && !jogador) {
    return (
      <div className="min-h-screen w-full bg-brand-beige flex flex-col md:flex-row relative" data-theme={configuracoes.tema}>
        {/* Left Side: Information & Purpose */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 sm:p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden min-h-[50vh] md:min-h-screen">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 max-w-2xl mx-auto md:mx-0"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white/20 w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 shadow-2xl"
            >
              <Brain className="w-8 h-8" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-tighter leading-none uppercase"
            >
              Mente Ativa
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-100 mb-6 leading-tight"
            >
              Preservação cognitiva, reabilitação e desenvolvimento mental.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 mb-6"
            >
               <div className="flex items-center gap-2 mb-1">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
                 <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-emerald-400">Privacidade Total</h4>
               </div>
               <p className="text-white/80 text-xs font-medium leading-tight">
                 Seus dados nunca saem do seu dispositivo. Arquivos JSON locais garantem segurança absoluta.
               </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Users, title: 'Público Alvo', desc: 'Idosos, Crianças, Reabilitação.', color: 'text-blue-300', anim: { y: [0, -2, 0] } },
                { icon: Zap, title: 'Estímulo', desc: 'Neuroplasticidade e agilidade.', color: 'text-yellow-300', anim: { scale: [1, 1.2, 1] } },
                { icon: BarChart2, title: 'Evolução', desc: 'Relatórios científicos claros.', color: 'text-emerald-300', anim: { height: [12, 16, 12] } },
                { icon: Heart, title: 'Autonomia', desc: 'Manutenção de funções vitais.', color: 'text-pink-300', anim: { scale: [1, 1.1, 1] } }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="bg-white/5 p-4 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={item.anim}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </motion.div>
                    <h4 className="font-black uppercase text-[11px] tracking-wider text-white/90">{item.title}</h4>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm font-medium leading-tight">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-3"
            >
              <h4 className="text-blue-200 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Metodologias Aplicadas</h4>
              <div className="flex flex-wrap gap-2">
                {['Neuropsicologia', 'Gamificação', 'Design Inclusivo'].map((area) => (
                  <span key={area} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Animated Background Objects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300/10 rounded-full blur-[80px]"
            />
            
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  scale: [0, 1.2, 0],
                  x: [Math.random() * 800, Math.random() * 800],
                  y: [Math.random() * 800, Math.random() * 800],
                }}
                transition={{ 
                  duration: 8 + Math.random() * 12, 
                  repeat: Infinity,
                  delay: i * 1.5 
                }}
                className={`absolute w-24 h-24 rounded-full blur-2xl ${
                  ['bg-pink-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-blue-300', 'bg-white'][i % 5]
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Action Form */}
        <div className="flex-1 p-6 sm:p-12 flex flex-col justify-center items-center bg-brand-beige relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="w-full max-w-md z-10"
          >
            <div className="bg-card-bg p-8 lg:p-10 rounded-[48px] shadow-3xl border-t-[12px] border-blue-500 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-1 tracking-tighter text-brand-dark leading-none uppercase">Acessar Treino</h2>
                <p className="text-brand-dark/40 mb-8 text-[11px] font-bold uppercase tracking-widest">Identifique o Aluno / Paciente / Criança</p>
                
                <form onSubmit={handleStart} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Nome"
                    className="w-full text-center p-5 rounded-2xl border-4 border-brand-divider text-2xl font-bold focus:border-blue-500 outline-none transition-all placeholder:text-brand-dark/20 bg-brand-beige text-brand-dark"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                  />
                  <Button className="w-full h-16 text-xl group" variant="primary">
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2">
                       <Play className="fill-current w-6 h-6" /> Criar Arquivo / Pessoa
                    </motion.div>
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t-2 border-brand-divider grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 w-full py-4 text-blue-500 font-black text-xs uppercase tracking-wider hover:bg-blue-500/5 rounded-2xl transition-all border-2 border-transparent"
                  >
                    <Upload className="w-4 h-4" /> Importar Dados para Continuidade
                  </button>
                  <button 
                    onClick={() => setActiveScreen('faq')}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-600 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <Search className="w-5 h-5" /> Como Funciona?
                  </button>

                  {!isInstalled && (
                    <button 
                      onClick={handleInstallClick}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-600 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 animate-pulse-slow"
                    >
                      <Brain className="w-5 h-5" /> Instalar App (PWA)
                    </button>
                  )}
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
                <Brain className="w-48 h-48" />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.4em]">Mente Ativa • Tecnologia & Saúde</p>
            </div>
          </motion.div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImport} 
          className="hidden" 
          accept=".json"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans bg-brand-beige selection:bg-blue-100 text-brand-dark transition-all duration-500 ${isFullScreen ? 'overflow-hidden' : ''}`} data-theme={configuracoes.tema}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        className="hidden" 
        accept=".json"
      />
      {/* Header */}
      {!isFullScreen && (
        <header className="p-4 sm:p-6 flex items-center justify-between border-b-4 border-brand-divider max-w-[1400px] mx-auto w-full sticky top-0 bg-brand-beige/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            {activeScreen !== 'hub' && activeScreen !== 'intro' ? (
              <button 
                onClick={() => activeScreen === 'faq' ? setActiveScreen('intro') : setActiveScreen('hub')}
                className="p-3 bg-brand-dark text-white rounded-2xl shadow-lg active:scale-90 transition-all shrink-0"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            ) : jogador && activeScreen === 'hub' ? (
              <button 
                onClick={handleSwitchPatient}
                title="Sair / Mudar Usuário"
                className="p-3 bg-red-500 text-white rounded-2xl shadow-lg active:scale-90 transition-all shrink-0 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline font-black text-xs">SAIR</span>
              </button>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-xl shrink-0">
                <Brain />
              </div>
            )}
            <div className="flex flex-col truncate">
              <h1 className="text-lg sm:text-2xl font-black tracking-tighter leading-tight text-brand-dark truncate uppercase">
                {activeScreen === 'report' ? 'Relatório' : jogador?.nome || 'MENTE ATIVA'}
              </h1>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Nv. {nivelGlobal}</span>
                <span className="text-[10px] font-black text-brand-dark/40 uppercase tracking-wider leading-none">• {pontosTotal.toLocaleString()} PTS</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Importar Dados"
              className="p-3 sm:p-4 bg-card-bg rounded-2xl shadow-sm border-2 border-brand-divider text-brand-dark hover:bg-brand-divider/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline font-black text-xs">IMPORTAR</span>
            </button>
            <button 
              onClick={handleExport}
              title="Download do Progresso"
              className="p-3 sm:p-4 bg-card-bg rounded-2xl shadow-sm border-2 border-brand-divider text-brand-dark hover:bg-brand-divider/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline font-black text-xs">EXPORTAR</span>
            </button>
          </div>
        </header>
      )}

      <main className={`${isFullScreen ? 'h-screen w-screen p-0 m-0 overflow-hidden' : 'max-w-[1400px] mx-auto p-4 sm:p-8 pb-40 sm:pb-32'}`}>
        {activeScreen === 'hub' ? (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-10 tracking-widest text-center">Jogos de Treinamento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Object.entries(modulos).map(([id, stats]) => (
                <motion.div 
                  key={id}
                  whileHover={{ y: -5 }}
                  className="bg-card-bg p-6 sm:p-8 rounded-[40px] shadow-sm border-b-8 border-brand-divider hover:shadow-xl transition-all group flex flex-col justify-between min-h-[340px]"
                >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[24px] flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:rotate-6 transition-transform ${
                      id === ModuleId.TOQUE_LUZ ? 'bg-pink-500 text-white' :
                      id === ModuleId.COR_IGUAL ? 'bg-emerald-500 text-white' :
                      id === ModuleId.MEMORIA_FOTOS ? 'bg-purple-500 text-white' : 
                      id === ModuleId.CAIXA_SEPARACAO ? 'bg-orange-500 text-white' :
                      id === ModuleId.SEQUENCIA_LOGICA ? 'bg-blue-500 text-white' :
                      id === ModuleId.MATEMATICA_FACIL ? 'bg-amber-500 text-white' :
                      id === ModuleId.BUSCA_VISUAL ? 'bg-cyan-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {id === ModuleId.TOQUE_LUZ ? <Hand /> :
                       id === ModuleId.COR_IGUAL ? <Palette /> :
                       id === ModuleId.MEMORIA_FOTOS ? <Camera /> : 
                       id === ModuleId.CAIXA_SEPARACAO ? <Package /> :
                       id === ModuleId.SEQUENCIA_LOGICA ? <Layers /> :
                       id === ModuleId.MATEMATICA_FACIL ? <Brain /> :
                       id === ModuleId.BUSCA_VISUAL ? <Search /> : <Type />}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex items-center gap-1 bg-brand-divider/50 px-3 py-1 rounded-full">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        <span className="font-black text-xs text-brand-dark/70">{stats.pontos.toLocaleString()}</span>
                      </div>
                      {id !== ModuleId.TOQUE_LUZ && (
                        <div className="flex items-center gap-2 bg-card-bg border-2 border-brand-divider rounded-2xl p-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setModuleLevel(id, Math.max(1, stats.nivel - 1)); }}
                            className="w-8 h-8 rounded-xl hover:bg-brand-divider/30 flex items-center justify-center active:scale-90 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-black text-blue-500 text-sm w-12 text-center uppercase tracking-tighter">Nv. {stats.nivel}</span>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              let max = 10;
                              if (id === ModuleId.COR_IGUAL) max = 5;
                              if (id === ModuleId.CAIXA_SEPARACAO) max = 5;
                              if (id === ModuleId.MEMORIA_FOTOS) max = 6;
                              setModuleLevel(id, Math.min(max, stats.nivel + 1)); 
                            }}
                            className="w-8 h-8 rounded-xl hover:bg-brand-divider/30 flex items-center justify-center active:scale-90 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase mb-1 tracking-tight text-brand-dark leading-tight">{getModuleLabel(id)}</h2>
                  <p className="text-brand-dark/60 font-bold text-sm leading-tight mb-6">
                    {id === ModuleId.TOQUE_LUZ ? 'Teste seus reflexos no sinal verde' :
                     id === ModuleId.COR_IGUAL ? 'Identifique as cores mostradas' :
                     id === ModuleId.MEMORIA_FOTOS ? 'Encontre os pares de imagens' : 
                     id === ModuleId.CAIXA_SEPARACAO ? 'Separe os objetos em caixas' :
                     id === ModuleId.SEQUENCIA_LOGICA ? 'Memorize e repita o padrão' :
                     id === ModuleId.MATEMATICA_FACIL ? 'Resolva cálculos simples' :
                     id === ModuleId.BUSCA_VISUAL ? 'Encontre o objeto intruso' : 'Identifique a cor da tinta'}
                  </p>
                </div>
                
                <Button 
                  onClick={() => setActiveScreen(id)}
                  variant="primary"
                  className="w-full text-lg sm:text-xl py-3 sm:py-4 rounded-[20px] sm:rounded-[24px] border-b-4 flex items-center justify-center gap-3"
                >
                  <Play className="w-5 h-5 fill-current" /> JOGAR AGORA
                </Button>
              </motion.div>
            ))}
            </div>
          </div>
        ) : activeScreen === 'report' ? (
          <Relatorio />
        ) : activeScreen === 'faq' ? (
          <FAQ />
        ) : (
          <div className={`bg-card-bg shadow-3xl overflow-hidden relative transition-all duration-500 ${isFullScreen ? 'h-screen w-screen rounded-0 border-0' : 'rounded-[32px] sm:rounded-[60px] min-h-[65vh] sm:min-h-[75vh] border-b-[8px] sm:border-b-[16px] border-brand-divider'}`}>
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex gap-2 z-50">
              <button 
                onClick={() => {setActiveScreen('hub'); setIsFullScreen(false); updateGlobalProgression();}}
                className="p-3 sm:p-5 bg-black/5 hover:bg-black/10 rounded-full transition-all shadow-sm flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-3 sm:p-5 bg-black/5 hover:bg-black/10 rounded-full transition-all shadow-sm flex items-center justify-center font-black text-sm"
              >
                {isFullScreen ? 'SAIR TELA CHEIA' : 'TELA CHEIA'}
              </button>
            </div>
            <div className={`h-full ${isFullScreen ? 'pt-4' : 'pt-16 sm:pt-20'}`}>
              {activeScreen === ModuleId.TOQUE_LUZ && <ToqueLuz />}
              {activeScreen === ModuleId.COR_IGUAL && <CorIgual />}
              {activeScreen === ModuleId.MEMORIA_FOTOS && <MemoriaFotos />}
              {activeScreen === ModuleId.CAIXA_SEPARACAO && <CaixaSeparacao />}
              {activeScreen === ModuleId.SEQUENCIA_LOGICA && <SequenciaLogica />}
              {activeScreen === ModuleId.MATEMATICA_FACIL && <MatematicaFacil />}
              {activeScreen === ModuleId.BUSCA_VISUAL && <BuscaVisual />}
              {activeScreen === ModuleId.STROOP_TEST && <StroopTest />}
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      {!isFullScreen && !['intro', 'faq'].includes(activeScreen) && (
        <footer className="fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 sm:px-6 flex justify-between items-center gap-3 sm:gap-6 z-40">
          <div className="flex flex-1 gap-2 sm:gap-4 bg-card-bg/90 backdrop-blur-2xl p-2 sm:p-4 rounded-[32px] sm:rounded-[40px] shadow-3xl border-2 border-brand-divider">
            <button 
               onClick={() => {setActiveScreen('hub'); updateGlobalProgression();}}
               className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-[18px] sm:rounded-[24px] font-black text-sm sm:text-lg transition-all ${activeScreen === 'hub' ? 'bg-blue-500 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-black/5'}`}
            >
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" /> <span className="hidden xs:inline">TREINO</span>
            </button>
            <button 
               onClick={() => setActiveScreen('report')}
               className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-[18px] sm:rounded-[24px] font-black text-sm sm:text-lg transition-all ${activeScreen === 'report' ? 'bg-emerald-500 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-black/5'}`}
            >
              <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" /> <span className="hidden xs:inline">RELATÓRIO</span>
            </button>
            <button 
               onClick={toggleTheme}
               className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-black/5 rounded-[16px] sm:rounded-[20px] text-gray-400 hover:bg-black/10 transition-all active:scale-95"
            >
              {configuracoes.tema === 'claro' ? <Moon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </footer>
      )}
      {!isFullScreen && <div className="h-10 sm:h-20"></div>}
    </div>
  );
}
