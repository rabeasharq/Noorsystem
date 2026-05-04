/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { LessonPlan, Student } from "../types";
import { Clock, Play, Pause, RotateCcw, Award, Ghost, Star, BookOpen, PenTool, MessageSquare, Notebook, Heart, AlertCircle, X, ChevronRight, Trophy } from "lucide-react";
import { cn } from "../lib/utils";
import { BADGES } from "../constants/data";

interface ClassroomManagerProps {
  plan: LessonPlan;
  students: Student[];
  onLogActivity: (log: any) => void;
  onUpdateStudent: (student: Student) => void;
  onClose: () => void;
}

export function ClassroomManager({ plan, students, onLogActivity, onUpdateStudent, onClose }: ClassroomManagerProps) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(plan.stages[0].t * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pointsNote, setPointsNote] = useState("");

  const activeStage = plan.stages[activeStageIdx];

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeStageIdx < plan.stages.length - 1) {
      // Auto advance or highlight?
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, activeStageIdx, plan.stages.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStageChange = (idx: number) => {
    setActiveStageIdx(idx);
    setTimeLeft(plan.stages[idx].t * 60);
    setIsActive(false);
  };

  const awardPoints = (points: number, category: string, note?: string) => {
    if (!selectedStudent) return;
    onLogActivity({
      id: Date.now().toString(),
      studentId: selectedStudent.id,
      type: points > 0 ? 'positive' : 'negative',
      category,
      points,
      note: note || pointsNote || "",
      timestamp: new Date().toISOString(),
      lessonId: plan.id
    });
    setPointsNote("");
    // We don't deselect to allow multiple awards faster?
  };

  const assignBadge = (badgeLabel: string) => {
    if (!selectedStudent) return;
    const has = selectedStudent.badges.includes(badgeLabel);
    if (has) return; // Already has it
    
    const updated = {
      ...selectedStudent,
      badges: [...selectedStudent.badges, badgeLabel]
    };
    onUpdateStudent(updated);
  };

  const filteredStudents = students.filter(s => s.grade === plan.meta.gradeNum.toString());

  return (
    <div className="fixed inset-0 z-50 bg-[#080c1a] flex flex-col font-amiri overflow-hidden">
      {/* Top Status Bar */}
      <header className="h-16 border-b border-white/5 bg-[#0f1528]/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
         <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
               <X className="w-6 h-6" />
            </button>
            <div className="h-6 w-px bg-white/5"></div>
            <div>
               <h2 className="text-white font-bold font-naskh">{plan.meta.lessonTitle}</h2>
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{plan.meta.subject} · {plan.meta.grade}</p>
            </div>
         </div>

         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
               {plan.stages.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleStageChange(i)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all border-2",
                      activeStageIdx === i ? "scale-125 border-gold bg-gold" : 
                      activeStageIdx > i ? "border-emerald-500 bg-emerald-500" : "border-slate-700 bg-transparent"
                    )}
                    title={s.name}
                  />
               ))}
            </div>
            
            <div className={cn(
              "flex items-center gap-4 px-6 py-2 rounded-2xl border transition-all",
              timeLeft < 60 ? "bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse" : "bg-white/5 border-white/10 text-white"
            )}>
               <Clock className="w-5 h-5" />
               <span className="text-2xl font-mono font-bold tracking-tighter">{formatTime(timeLeft)}</span>
               <div className="flex gap-2">
                 <button onClick={() => setIsActive(!isActive)} className="p-1 hover:text-gold transition-colors">
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                 </button>
                 <button onClick={() => setTimeLeft(activeStage.t * 60)} className="p-1 hover:text-white transition-colors">
                    <RotateCcw className="w-4 h-4" />
                 </button>
               </div>
            </div>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Lesson Guide & Active Stage */}
        <aside className="w-1/3 border-l border-white/5 bg-[#0b1124] p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8">
           <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gold font-bold font-naskh flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  المرحلة الحالية: {activeStage.name}
                </h3>
                <span className="text-xs text-slate-500">{activeStage.t} دقيقة</span>
              </div>
              <div className="space-y-2">
                 {activeStage.acts.map((act, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3">
                       <div className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i+1}</div>
                       <p className="text-slate-300 text-sm leading-relaxed font-naskh">{act}</p>
                    </div>
                 ))}
              </div>
           </section>

           <div className="h-px bg-white/5"></div>

           <section className="space-y-4">
              <h3 className="text-rose-400 font-bold font-naskh flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                تذكير بالأخطاء المتوقعة
              </h3>
              <div className="space-y-2">
                 {plan.expectedErrors.map((err, i) => (
                    <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                       <p className="text-rose-200 text-xs font-bold font-naskh mb-1">المنبه: {err}</p>
                       <p className="text-slate-500 text-[10px] leading-relaxed italic">{plan.errorRemedies[i]}</p>
                    </div>
                 ))}
              </div>
           </section>

           <div className="mt-auto p-5 bg-gold/5 border border-gold/10 rounded-2xl">
              <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-2 font-naskh">استراتيجية الألفا النشطة</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{plan.alphaStrategy}: {plan.alphaDesc}</p>
           </div>
        </aside>

        {/* Right: Gamified Classroom Interaction */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-950/20">
           <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-white font-bold font-naskh text-xl">تفاعل الطلاب (لوحة التحكم النشطة)</h3>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">فرز حسب:</span>
                    <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white outline-none">
                       <option>ترتيب الجلوس</option>
                       <option>أكثر النقاط</option>
                       <option>آخر تفاعل</option>
                    </select>
                 </div>
              </div>

              {/* Student Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 {filteredStudents.length === 0 ? (
                    <div className="col-span-full py-20 text-center opacity-30">
                       <p className="font-naskh">لا يوجد طلاب مسجلين لهذا الصف. أضف طلاباً من القائمة الجانبية أولاً.</p>
                    </div>
                 ) : (
                    filteredStudents.map(s => (
                       <button 
                          key={s.id}
                          onClick={() => setSelectedStudent(s)}
                          className={cn(
                             "relative p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group",
                             selectedStudent?.id === s.id 
                               ? "bg-gold border-gold scale-105 shadow-xl shadow-gold/20" 
                               : "bg-white/5 border-white/5 hover:border-gold/30 hover:bg-white/10"
                          )}
                        >
                          <div className={cn(
                             "w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner",
                             selectedStudent?.id === s.id ? "bg-slate-950/20 text-slate-950" : "bg-slate-900 text-slate-500"
                          )}>
                             {s.name[0]}
                          </div>
                          <span className={cn(
                             "text-[10px] font-bold font-naskh truncate w-full text-center",
                             selectedStudent?.id === s.id ? "text-slate-950" : "text-white"
                          )}>{s.name.split(" ")[0]}</span>
                          <div className={cn(
                             "text-[9px] font-mono font-bold",
                             selectedStudent?.id === s.id ? "text-slate-950/60" : "text-slate-500"
                          )}>{s.points} PTS</div>
                       </button>
                    ))
                 )}
              </div>

              {/* Interactive Award Panel */}
              {selectedStudent && (
                 <div className="mt-8 p-6 bg-slate-900 rounded-[2.5rem] border border-white/10 animate-in slide-in-from-bottom-8">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold text-xl font-bold">
                             {selectedStudent.name[0]}
                          </div>
                          <div>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-naskh">منح الجائزة للطالب:</p>
                             <h4 className="text-white font-bold text-lg">{selectedStudent.name}</h4>
                          </div>
                       </div>
                       <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-500 hover:text-white">
                          <RotateCcw className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                       <AwardBtn icon={<BookOpen />} label="قراءة متميزة" points={5} color="gold" onClick={() => awardPoints(5, 'reading')} />
                       <AwardBtn icon={<PenTool />} label="خط جميل" points={5} color="emerald" onClick={() => awardPoints(5, 'calligraphy')} />
                       <AwardBtn icon={<Notebook />} label="دفتر مرتب" points={10} color="sky" onClick={() => awardPoints(10, 'notebook')} />
                       <AwardBtn icon={<MessageSquare />} label="مشاركة ذكية" points={3} color="amber" onClick={() => awardPoints(3, 'participation')} />
                       <AwardBtn icon={<Heart />} label="أدب وسلوك" points={10} color="rose" onClick={() => awardPoints(10, 'behavior')} />
                       <AwardBtn icon={<Star />} label="حفظ متقن" points={15} color="indigo" onClick={() => awardPoints(15, 'memorization')} />
                       <AwardBtn icon={<Ghost />} label="حسم نقطة" points={-5} color="slate" onClick={() => awardPoints(-5, 'behavior', 'سلوك غير مرغوب')} />
                    </div>

                    <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                       <h5 className="text-[10px] text-slate-500 font-bold uppercase mb-3 font-naskh">منح وسام التميز</h5>
                       <div className="flex flex-wrap gap-2">
                          {BADGES.map(b => (
                            <button 
                              key={b.id}
                              disabled={selectedStudent.badges.includes(b.label)}
                              onClick={() => assignBadge(b.label)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all",
                                selectedStudent.badges.includes(b.label)
                                  ? "bg-gold/40 border-gold/60 text-slate-950 cursor-default"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-gold/20 hover:border-gold/30 hover:text-gold"
                              )}
                            >
                               <span>{b.icon}</span>
                               {b.label}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <input 
                          type="text" 
                          value={pointsNote}
                          onChange={(e) => setPointsNote(e.target.value)}
                          placeholder="أضف ملاحظة خاصة (اختياري)..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 text-sm text-white outline-none focus:border-gold"
                       />
                       <button 
                          onClick={() => setSelectedStudent(null)}
                          className="px-8 py-3 bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/10 transition-all font-naskh"
                       >
                          إغلاق
                       </button>
                    </div>
                 </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
}

function AwardBtn({ icon, label, points, color, onClick }: any) {
   const colors: any = {
      gold: "hover:bg-gold hover:text-slate-950 text-gold",
      emerald: "hover:bg-emerald-500 hover:text-white text-emerald-400",
      sky: "hover:bg-sky-500 hover:text-white text-sky-400",
      amber: "hover:bg-amber-500 hover:text-white text-amber-400",
      rose: "hover:bg-rose-500 hover:text-white text-rose-400",
      indigo: "hover:bg-indigo-500 hover:text-white text-indigo-400",
      slate: "hover:bg-slate-400 hover:text-slate-950 text-slate-400",
   };

   return (
      <button 
         onClick={onClick}
         className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all group active:scale-95",
            colors[color]
         )}
      >
         <div className="p-2 transition-transform group-hover:scale-110">
            {React.cloneElement(icon, { size: 24 })}
         </div>
         <span className="text-[10px] font-bold font-naskh">{label}</span>
         <span className="text-[9px] font-mono font-bold opacity-60">+{points}</span>
      </button>
   );
}
