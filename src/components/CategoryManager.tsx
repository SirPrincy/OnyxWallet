import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Edit3, Trash2, ChevronRight, 
  ShoppingBag, Palette, LayoutGrid, ArrowLeft, Star
} from 'lucide-react';
import { useTransactions } from '../context/useTransactions';
import { Category } from '../types';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../constants';

interface CategoryManagerProps {
  onBack: () => void;
}

export default function CategoryManager({ onBack }: CategoryManagerProps) {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useTransactions();

  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form states for Category
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('shopping_bag');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [tempSub, setTempSub] = useState('');
  const [tempSubIcon, setTempSubIcon] = useState('star');

  const resetForm = () => {
    setName('');
    setIcon('shopping_bag');
    setColor(COLOR_OPTIONS[0]);
    setType('expense');
    setTempSub('');
    setTempSubIcon('star');
  };

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setType(cat.type);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingCat) {
      updateCategory(editingCat.id, {
        name, icon, color, type
      });
    } else {
      addCategory({
        name, icon, color, type,
        subcategories: []
      });
    }
    setIsAdding(false);
    setEditingCat(null);
    resetForm();
  };

  const handleAddSub = () => {
    if (!tempSub.trim() || !selectedCat) return;
    const updatedSubs = [...selectedCat.subcategories, { name: tempSub.trim(), icon: tempSubIcon }];
    updateCategory(selectedCat.id, { subcategories: updatedSubs });
    setTempSub('');
    setTempSubIcon('star');
    // Update local selectedCat to reflect change
    setSelectedCat({ ...selectedCat, subcategories: updatedSubs });
  };

  const handleRemoveSub = (index: number) => {
    if (!selectedCat) return;
    const updatedSubs = selectedCat.subcategories.filter((_, i) => i !== index);
    updateCategory(selectedCat.id, { subcategories: updatedSubs });
    setSelectedCat({ ...selectedCat, subcategories: updatedSubs });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-[150] bg-background flex flex-col"
    >
      <header className="h-20 flex items-center px-6 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <button onClick={onBack} className="p-2 -ml-2 text-on-surface-variant hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-4">
          <h1 className="font-headline italic text-2xl text-primary tracking-tight">Categorization Hub</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Architecture of Flow</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/60">Primary Entities</h2>
            <button 
              onClick={() => { setEditingCat(null); resetForm(); setIsAdding(true); }}
              className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Manifest New
            </button>
          </div>

          <div className="grid gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`group relative p-5 rounded-2xl bg-surface-container-low border border-outline-variant/5 hover:border-primary/30 transition-all cursor-pointer ${selectedCat?.id === cat.id ? 'ring-2 ring-primary border-transparent' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      {React.createElement(ICON_OPTIONS.find(i => i.id === cat.icon)?.icon || ShoppingBag, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <h3 className="font-medium text-on-surface">{cat.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
                        {cat.type} • {cat.subcategories.length} Subsets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); if(selectedCat?.id === cat.id) setSelectedCat(null); }}
                      className="p-2 text-on-surface-variant hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                  </div>
                </div>

                {/* Subcategories pill preview */}
                {cat.subcategories.length > 0 && selectedCat?.id !== cat.id && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.subcategories.slice(0, 3).map((sub, idx) => {
                      const SubIcon = ICON_OPTIONS.find(i => i.id === sub.icon)?.icon || Star;
                      return (
                        <span key={idx} className="flex items-center gap-1.5 text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-on-surface-variant font-medium">
                          <SubIcon className="w-2.5 h-2.5 opacity-60" />
                          {sub.name}
                        </span>
                      );
                    })}
                    {cat.subcategories.length > 3 && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-on-surface-variant font-medium">
                        +{cat.subcategories.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel/Drawer for Subcategories */}
      <AnimatePresence>
        {selectedCat && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCat(null)}
              className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-low border-l border-white/5 z-[170] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${selectedCat.color}15`, color: selectedCat.color }}>
                     {React.createElement(ICON_OPTIONS.find(i => i.id === selectedCat.icon)?.icon || ShoppingBag, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl text-on-surface italic">{selectedCat.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Refining Subsets</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCat(null)} className="p-2 text-on-surface-variant hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Append Subset</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={tempSub}
                        onChange={(e) => setTempSub(e.target.value)}
                        placeholder="e.g. Fine Wine"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-white/10"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSub()}
                      />
                      <button 
                        onClick={handleAddSub}
                        className="px-6 rounded-xl bg-primary text-background font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Authorize
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/40 font-bold px-1">Subset Icon</label>
                      <div className="grid grid-cols-6 gap-2">
                        {ICON_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setTempSubIcon(opt.id)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${tempSubIcon === opt.id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'}`}
                          >
                            <opt.icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">Current Architecture</h4>
                    {selectedCat.subcategories.length === 0 ? (
                      <div className="py-8 text-center text-on-surface-variant/40 italic">
                        No subsets defined for this entity.
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {selectedCat.subcategories.map((sub, idx) => {
                          const SubIcon = ICON_OPTIONS.find(i => i.id === sub.icon)?.icon || Star;
                          return (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-highest/20 border border-white/5 group hover:border-primary/20 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-on-surface-variant">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-on-surface font-medium">{sub.name}</span>
                              </div>
                              <button 
                                onClick={() => handleRemoveSub(idx)}
                                className="p-1.5 text-on-surface-variant hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Editor Modal (Create/Edit) */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 z-[180] bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-surface-container-low rounded-[2.5rem] p-8 z-[190] border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-3xl text-on-surface italic">{editingCat ? 'Manifest Refinement' : 'New Financial Entity'}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">Classification Core</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 text-on-surface-variant hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Group Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Asset Management"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Visual Identity</label>
                   <div className="grid grid-cols-6 gap-3">
                     {ICON_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setIcon(opt.id)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${icon === opt.id ? 'bg-primary border-primary text-background scale-110 shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'}`}
                        >
                          <opt.icon className="w-5 h-5" />
                        </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Signature Tone</label>
                   <div className="flex flex-wrap gap-3">
                     {COLOR_OPTIONS.map(c => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'scale-125 border-white shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          style={{ backgroundColor: c }}
                        />
                     ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setType('income')}
                    className={`py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'income' ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'}`}
                  >
                    Revenue
                  </button>
                  <button 
                    onClick={() => setType('expense')}
                    className={`py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-red-400/20 border-red-400 text-red-400 shadow-lg shadow-red-400/10' : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'}`}
                  >
                    Expense
                  </button>
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full py-5 bg-primary text-background rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingCat ? 'Manifest Changes' : 'Authorize Creation'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
