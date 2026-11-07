import React from 'react';
import { CATEGORIES } from '../data/categories';
import {
  ShieldAlert,
  Smartphone,
  ShieldCheck,
  Laptop,
  Mouse,
  Network,
  Wifi,
  Watch,
  Home,
  Gamepad2,
  Cpu,
  Layers,
  Camera,
  Headphones,
  HardDrive,
  Zap,
  Sparkles,
  Check,
} from 'lucide-react';

interface CategoryStripProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  productCounts?: Record<string, number>;
}

// Map category icons dynamically
const ICON_MAP: Record<string, React.ElementType> = {
  ShieldAlert,
  Smartphone,
  ShieldCheck,
  Laptop,
  Mouse,
  Network,
  Wifi,
  Watch,
  Home,
  Gamepad2,
  Cpu,
  Layers,
  Camera,
  Headphones,
  HardDrive,
  Zap,
  Sparkles,
};

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
  productCounts = {},
}) => {
  return (
    <section className="bg-[#050505] py-6 border-b border-[#1a1e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Browse Categories
            </h2>
            <span className="text-xs text-slate-500">· 17 Specialized Tech Sectors</span>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs text-[#00D9FF] hover:underline cursor-pointer font-medium"
            >
              Reset to All
            </button>
          )}
        </div>

        {/* Scrollable Categories List */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#087BFF] text-white shadow-md shadow-[#087BFF]/30'
                : 'bg-[#0c0d12] text-slate-400 hover:text-white hover:bg-[#151922] border border-[#1a1e27]'
            }`}
          >
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
            <span>All Categories</span>
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Cpu;
            const isSelected = selectedCategory === cat.name;
            const count = productCounts[cat.name];

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#087BFF] text-white shadow-md shadow-[#087BFF]/30 border-transparent'
                    : cat.highlight
                    ? 'bg-[#0c0d12] text-[#00D9FF] border border-[#00D9FF]/40 hover:bg-[#00D9FF]/10'
                    : 'bg-[#0c0d12] text-slate-400 hover:text-white hover:bg-[#151922] border border-[#1a1e27]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.highlight ? 'text-[#00D9FF]' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                {count !== undefined && count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono-numbers ${isSelected ? 'bg-black/30 text-white' : 'bg-[#1a1e27] text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
