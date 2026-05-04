/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BookOpen, Users, TrendingUp, Sparkles, Plus, ChevronRight, Library } from "lucide-react";
import { CurriculumItem, Student, LessonPlan } from "../types";
import { cn } from "../lib/utils";

interface DashboardPanelProps {
  students: Student[];
  curriculum: CurriculumItem[];
  plans: LessonPlan[];
  insight: any;
  onNavigate: (view: string) => void;
  onSelectLesson: (item: CurriculumItem) => void;
}

export function DashboardPanel({ students, curriculum, plans, insight, onNavigate, onSelectLesson }: DashboardPanelProps) {
  const topStudents = [...students].sort((a, b) => b.points - a.points).slice(0, 3);
  const recentLessons = curriculum.slice(-3).reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Smart Insight */}
      <section className="relative overflow-hidden p-8 glass-panel border-gold/20">
        <div className="absolute top-0 left-0 w-full h-full noor-glow opacity-10"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold font-naskh text-white">أهلاً بك في نظام <span className="text-gold">نور</span> الذكي</h1>
            <p className="text-slate-400 font-naskh leading-relaxed">
              محركك المتكامل لتحويل الكتب المدرسية التقليدية إلى تجارب تعلم غامرة لجيل ألفا.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate("form")}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-slate-950 rounded-2xl font-bold font-naskh hover:scale-105 transition-all shadow-xl shadow-gold/20"
              >
                <Plus className="w-5 h-5" /> تحضير درس جديد
              </button>
              <button 
                onClick={() => onNavigate("curriculum")}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold font-naskh hover:bg-white/10 transition-all"
              >
                <Library className="w-5 h-5" /> استكشاف المكتبة
              </button>
            </div>
          </div>
          
          {insight ? (
            <div className="p-6 bg-gold/5 border border-gold/20 rounded-3xl space-y-3 relative group">
              <div className="flex items-center gap-3 text-gold mb-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm font-naskh">رؤية المعلم الذكية</span>
              </div>
              <p className="text-slate-300 text-sm font-naskh leading-relaxed italic">"{insight.recommendation}"</p>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 pt-2 border-t border-gold/10">
                <span className="flex items-center gap-1"><Users className="w-3 h-3"/> الموجه: {insight.prediction.mentorStudent}</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3"/> التفاعل: {insight.prediction.expectedEngagement}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 opacity-50">
               <Sparkles className="w-8 h-8 text-slate-600" />
               <p className="text-xs text-slate-500 font-naskh">بانتظار تسجيل تفاعلاتك الأولى لتوليد رؤى ذكية</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-3 gap-4">
              <StatCard icon={<FilePlus className="w-4 h-4" />} label="الدروس المحضرة" value={plans.length} color="gold" />
              <StatCard icon={<BookOpen className="w-4 h-4" />} label="دروس المنهج" value={curriculum.length} color="sky" />
              <StatCard icon={<Users className="w-4 h-4" />} label="إجمالي الطلاب" value={students.length} color="emerald" />
           </div>

           {/* Recent Lessons from Library */}
           <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-lg font-bold text-white font-naskh">أحدث الدروس المفوهرسة</h3>
                <button onClick={() => onNavigate("curriculum")} className="text-xs text-gold font-bold flex items-center gap-1 hover:underline">المكتبة كاملة <ChevronRight className="w-3 h-3 rotate-180"/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentLessons.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => onSelectLesson(item)}
                    className="p-4 glass-card hover:border-gold/30 flex items-center gap-4 text-right group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs ring-1 ring-sky-500/20">
                      {item.grade}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-wide font-naskh group-hover:text-gold transition-colors">{item.title}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{item.unit}</div>
                    </div>
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Top Performers Sidebar */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white font-naskh px-2">نجوم جيل ألفا</h3>
          <div className="glass-panel p-6 space-y-6">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                     i === 0 ? "bg-gold text-slate-900" : "bg-white/5 text-slate-400"
                   )}>
                     {i + 1}
                   </div>
                   <div>
                     <div className="text-sm font-bold text-white font-naskh leading-none">{s.name}</div>
                     <div className="text-[10px] text-slate-500 font-bold">{s.grade} - {s.classId}</div>
                   </div>
                </div>
                <div className="text-gold font-mono font-bold">{s.points}</div>
              </div>
            ))}
            {students.length === 0 && (
              <div className="py-10 text-center opacity-30 italic text-sm">لا يوجد طلاب لترتيبهم حالياً</div>
            )}
            <button 
              onClick={() => onNavigate("students")}
              className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-400 transition-all mt-4"
            >
              عرض سجل الأداء الكامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: 'gold' | 'sky' | 'emerald' }) {
  const colors = {
    gold: "text-gold bg-gold/10 border-gold/20",
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  };
  return (
    <div className={cn("p-5 glass-card flex flex-col items-center justify-center gap-2", colors[color])}>
       <div className="text-3xl font-bold font-mono">{value}</div>
       <div className="text-[9px] font-bold uppercase tracking-widest opacity-80 text-center leading-tight">{label}</div>
    </div>
  );
}

// Fixed missing icon in DashboardPanel
import { FilePlus } from "lucide-react";
