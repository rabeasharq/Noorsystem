/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, Trophy, Star, TrendingUp, Calendar, ArrowRight, User, Heart, Sparkles, Book } from "lucide-react";
import { Student, ActivityLog } from "../types";
import { BADGES, GRADES } from "../constants/data";
import { cn } from "../lib/utils";

interface StudentPortalProps {
  student: Student;
  activities: ActivityLog[];
  onLogout: () => void;
}

export function StudentPortal({ student, activities, onLogout }: StudentPortalProps) {
  const studentActivities = activities
    .filter(a => a.studentId === student.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const recentBadges = student.badges.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header Profile Section */}
      <header className="relative bg-gradient-to-b from-slate-900 to-slate-950 p-10 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6 text-right">
             <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl border border-white/10 transition-transform group-hover:scale-105">
                   👤
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold text-slate-950 rounded-2xl flex items-center justify-center font-black shadow-xl ring-4 ring-slate-950">
                  {student.grade}
                </div>
             </div>
             <div className="space-y-1">
                <h1 className="text-4xl font-black text-white font-naskh">أهلاً بك، {student.name.split(' ')[0]}!</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                   <Star className="w-4 h-4 text-gold" />
                   {GRADES[student.grade]?.label} — الشعبة {student.classId}
                </p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="glass-panel p-4 flex items-center gap-4 border-gold/20 shadow-xl shadow-gold/5">
                <div className="text-right">
                   <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">إجمالي الرصيد</div>
                   <div className="text-3xl font-black text-gold font-mono">{student.points}</div>
                </div>
                <Trophy className="w-10 h-10 text-gold opacity-50" />
             </div>
             
             <button 
                onClick={onLogout}
                className="p-4 glass-panel border-white/5 text-slate-500 hover:text-white transition-all flex items-center gap-2"
             >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span className="font-naskh font-bold hidden md:block">تسجيل الخروج</span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-12 mt-[-3rem]">
         {/* Main Stats Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Badges Section */}
            <div className="lg:col-span-2 space-y-8">
               <section className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                     <h3 className="text-xl font-bold text-white font-naskh flex items-center gap-3">
                        <Award className="w-6 h-6 text-gold" />
                        أوسمتك المحققة
                     </h3>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{student.badges.length} وسام</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {student.badges.map((bName, i) => {
                        const bDef = BADGES.find(b => b.label === bName);
                        return (
                          <div key={i} className="glass-panel p-6 flex flex-col items-center justify-center gap-4 group hover:border-gold/30 transition-all cursor-default">
                             <div className="text-4xl transition-transform group-hover:scale-125 group-hover:rotate-12 duration-500">{bDef?.icon || "🏅"}</div>
                             <div className="text-xs font-bold text-white font-naskh text-center">{bName}</div>
                          </div>
                        );
                     })}
                     {student.badges.length === 0 && (
                        <div className="col-span-full py-16 glass-panel border-dashed border-white/10 text-center opacity-30 italic font-naskh">
                           بانتظار تحقيق أول إنجاز لك! استمر في التميز.
                        </div>
                     )}
                  </div>
               </section>

               {/* Activity Timeline */}
               <section className="space-y-4">
                  <h3 className="text-xl font-bold text-white font-naskh flex items-center gap-3 px-2">
                     <TrendingUp className="w-6 h-6 text-emerald-400" />
                     سجل الرحلة التعليمية
                  </h3>
                  <div className="space-y-4">
                     {studentActivities.map((act) => (
                        <div key={act.id} className="glass-panel p-6 flex items-center justify-between group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 translate-x-1 group-hover:translate-x-0 transition-transform"></div>
                           <div className="flex items-center gap-6">
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner",
                                act.type === 'positive' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                              )}>
                                 {act.type === 'positive' ? "✨" : "⚠️"}
                              </div>
                              <div>
                                 <div className="text-white font-bold font-naskh">{act.note}</div>
                                 <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                       <Calendar className="w-3 h-3"/>
                                       {new Date(act.timestamp).toLocaleDateString('ar-YE')}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{act.category}</span>
                                 </div>
                              </div>
                           </div>
                           <div className={cn(
                             "text-lg font-black font-mono",
                             act.type === 'positive' ? "text-emerald-500" : "text-rose-500"
                           )}>
                              {act.type === 'positive' ? "+" : "-"}{act.points}
                           </div>
                        </div>
                     ))}
                     {studentActivities.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-600 italic font-naskh">
                           لا توجد نشاطات مسجلة مؤخراً
                        </div>
                     )}
                  </div>
               </section>
            </div>

            {/* Side Progress */}
            <div className="space-y-8">
               <div className="glass-panel p-1 border-gold/10 group">
                  <div className="bg-gradient-to-b from-gold/10 to-transparent p-8 space-y-8">
                     <h4 className="text-gold font-bold text-lg font-naskh flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        رؤية تطويرية لك
                     </h4>
                     <p className="text-slate-400 text-sm font-naskh leading-relaxed">
                        أنت متميز جداً في <span className="text-emerald-400">المشاركة الصفية</span>. استمر في هذا الأداء الرائع! 
                        نقترح عليك التركيز قليلاً في المرة القادمة على <span className="text-sky-400">جماليات الخط العربي</span>.
                     </p>
                     
                     <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex justify-between items-end">
                           <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">مستوى الطاقة</div>
                           <div className="text-xs text-white font-bold">85%</div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-gold w-[85%] rounded-full shadow-[0_0_10px_rgba(240,192,64,0.5)]"></div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-8 space-y-6">
                  <h4 className="text-white font-bold text-lg font-naskh flex items-center gap-3">
                     <Book className="w-5 h-5 text-sky-400" />
                     مذكرتك التعليمية
                  </h4>
                  <div className="space-y-4">
                     <div className="p-4 bg-white/5 rounded-2xl flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                           <div className="text-xs text-white font-bold font-naskh">تحضير درس "النعت"</div>
                           <div className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-widest">تاريخ: غداً</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
