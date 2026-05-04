/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CurriculumItem } from "../types";
import { Sparkles, Book, ChevronLeft, Target, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";

interface CurriculumSelectorProps {
  grade: string;
  items: CurriculumItem[];
  onSelect: (item: CurriculumItem) => void;
  insight: any;
}

export function CurriculumSelector({ grade, items, onSelect, insight }: CurriculumSelectorProps) {
  const filtered = items.filter(i => i.grade === grade);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {insight && (
        <div className="glass-panel p-6 border-gold/30 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -z-10 group-hover:bg-gold/10 transition-colors"></div>
           <div className="flex gap-5 items-start">
              <div className="w-12 h-12 glass-card flex items-center justify-center text-gold shadow-xl border-gold/20">
                <Lightbulb className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5 flex-1 relative z-10">
                 <h4 className="text-gold font-bold text-base font-naskh">الرؤية التحليلية للمستوى {grade}</h4>
                 <p className="text-slate-400 text-sm leading-relaxed font-naskh italic">{insight.recommendation}</p>
                 <div className="flex gap-4 mt-4">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">تركيز المهندس: {insight.focus || 'عام'}</div>
                    <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-full">التفاعل المتوقع: {insight.expectedEngagement || '85%'}+</div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-white text-lg font-bold flex items-center gap-3 font-naskh">
            <Book className="w-6 h-6 text-sky-400" />
            منظومة المنهج الرقمي
          </h3>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">{filtered.length} دروس مفهرسة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full p-16 text-center glass-panel border-dashed border-white/10 text-slate-600 text-sm italic font-naskh">
               قاعدة بيانات المنهج فارغة لهذا المستوى.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="glass-card p-5 group flex items-center justify-between hover:bg-sky-500/[0.04] hover:border-sky-500/30 transition-all text-right relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex flex-col items-center justify-center text-sky-400 transition-transform group-hover:scale-110 shadow-2xl">
                    <div className="text-[8px] font-bold uppercase tracking-tighter opacity-50">UNIT</div>
                    <div className="text-xl font-black font-mono">0{item.unit.match(/\d+/) || 'X'}</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base font-naskh mb-0.5 group-hover:text-sky-400 transition-colors">{item.title}</div>
                    <div className="flex items-center gap-2">
                       <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{item.subject}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                       <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{item.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                   {item.objectives.length > 0 && (
                     <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-xl border border-emerald-500/20">
                        <Target className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">READY</span>
                     </div>
                   )}
                   <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-white group-hover:translate-x-[-4px] transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
