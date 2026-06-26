import React, { useState } from 'react';
import { BlogPost } from '../types';
import { blogPosts } from '../data';
import { BookOpen, Heart, ThumbsUp, Sparkles, Filter, CheckSquare, Square, AlignLeft, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogProps {
  onAddPoints: (points: number) => void;
  onUnlockBadge: (badgeId: string) => void;
  onAddToActivityLog: (log: string) => void;
}

const DEFAULT_CHECKLIST = [
  { id: "check-1", text: "Registrar peso do Pet na balança", points: 15, done: false },
  { id: "check-2", text: "Verificar validade de vermífugos e antipulgas", points: 20, done: false },
  { id: "check-3", text: "Escovação dentária preventiva com pasta pet", points: 25, done: false },
  { id: "check-4", text: "30 minutos de passeio ou brincadeiras dinâmicas", points: 15, done: false },
  { id: "check-5", text: "Higienizar vasilha de água com sabão suave", points: 10, done: false }
];

export default function Blog({ onAddPoints, onUnlockBadge, onAddToActivityLog }: BlogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [likesState, setLikesState] = useState<Record<string, { count: number; userLiked: boolean }>>({
    'post-1': { count: 45, userLiked: false },
    'post-2': { count: 82, userLiked: false },
    'post-3': { count: 104, userLiked: false }
  });

  // Daily tutor health checklist state
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);

  const filterCategories = ['todos', 'Saúde', 'Dicas', 'Comportamento', 'Nutrição'];

  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory === 'todos') return true;
    return post.category === selectedCategory;
  });

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening read modal

    setLikesState(prev => {
      const current = prev[postId] || { count: 50, userLiked: false };
      const liked = !current.userLiked;
      const nextCount = liked ? current.count + 1 : current.count - 1;
      
      if (liked) {
        onAddToActivityLog(`Curtiu o artigo do blog: ${blogPosts.find(p => p.id === postId)?.title}`);
      }

      return {
        ...prev,
        [postId]: { count: nextCount, userLiked: liked }
      };
    });
  };

  const handleToggleCheck = (id: string) => {
    setChecklist(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const isDone = !item.done;
          if (isDone) {
            onAddPoints(item.points);
            onAddToActivityLog(`Completou tarefa: "${item.text}" e ganhou +${item.points} XP`);
            
            // Check if all are done
            const allChecked = prev.every(t => t.id === id ? isDone : t.done);
            if (allChecked) {
              onUnlockBadge("badge-5"); // Mestre da saúde badge
            }
          }
          return { ...item, done: isDone };
        }
        return item;
      });
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="blog-care-container">
      {/* Upper banner section */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" /> Portal de Cuidados & Dicas Saudáveis
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Eduque-se com guias aprovados por médicos veterinários especialistas e organize as tarefas diárias.
          </p>
        </div>

        {/* Dynamic header stats of checklist accomplishments */}
        <div className="bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-500" /> Checklist Diário no Ar
        </div>
      </div>

      {/* Main Grid: Checklist right, Articles Left */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tutor Checklist Section (1/3) */}
        <div className="md:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs h-fit space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-display">Checklist de Cuidados</h3>
            <p className="text-[10px] text-slate-400">Complete deveres para faturar pontos e desbloquear bônus</p>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 text-xs ${
                  item.done
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-800 line-through'
                    : 'border-slate-150 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.done ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <p className="font-semibold leading-relaxed leading-snug">{item.text}</p>
                  <span className={`text-[9px] font-extrabold block mt-1 ${item.done ? 'text-emerald-650' : 'text-emerald-600'}`}>
                    +{item.points} XP de Cuidado
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-2 border-t font-medium">
            Renova-se diariamente às 00:00.
          </div>
        </div>

        {/* Blog articles selection grid (2/3) */}
        <div className="md:col-span-2 space-y-4">
          {/* Categories Pill controllers */}
          <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 overflow-x-auto">
            {filterCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {cat === 'todos' ? 'Todos os Assuntos' : cat}
              </button>
            ))}
          </div>

          {/* Posts list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const likeInfo = likesState[post.id] || { count: post.likes, userLiked: false };

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedArticle(post)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative">
                    <img src={post.image} alt={post.title} className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-[10px] text-slate-400 gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5" /> {post.date} • Leitura: {post.readingTime}
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 leading-snug group-hover:text-emerald-700 transition line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{post.summary}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-xs">
                      <button
                        onClick={(e) => toggleLike(post.id, e)}
                        className={`flex items-center gap-1 font-bold ${
                          likeInfo.userLiked ? 'text-rose-500 font-extrabold' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likeInfo.userLiked ? 'fill-rose-500' : ''}`} />
                        <span>{likeInfo.count}</span>
                      </button>

                      <span className="text-[10px] font-bold text-emerald-600 group-hover:underline flex items-center">
                        Ler Artigo &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Reader Modal popup */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs"
            id="article-read-modal"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-100 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-800 focus:outline-none"
              >
                &times;
              </button>

              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                  {selectedArticle.category}
                </span>
                <h3 className="font-bold font-display text-lg md:text-xl text-slate-800 leading-tight">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-slate-450 font-medium">{selectedArticle.date} • Escrito por especialistas cadastrados • {selectedArticle.readingTime} de leitura</p>
              </div>

              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-48 object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-4">
                <div className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line p-3 bg-slate-50 rounded-2xl border">
                  {selectedArticle.content}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="py-2.5 px-6 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
                >
                  Voltar
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => toggleLike(selectedArticle.id, e as any)}
                    className={`flex items-center gap-1 font-bold text-xs p-2 rounded-xl border ${
                      likesState[selectedArticle.id]?.userLiked 
                        ? 'border-rose-200 bg-rose-50 text-rose-500' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likesState[selectedArticle.id]?.userLiked ? 'fill-rose-500' : ''}`} />
                    <span>Curtir ({likesState[selectedArticle.id]?.count || selectedArticle.likes})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
