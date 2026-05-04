/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GRADES, SUBJECTS, DAYS, PERIODS, LESSON_TYPES, INTRO_TYPES, ALPHA_STRATEGIES, CHALLENGES, REVIEW_WEEKS } from "../constants/data";
import { YEMEN_CURRICULUM } from "../constants/curriculumData";
import { ERRORS } from "../constants/content";
import { LessonPlanForm, CurriculumItem } from "../types";
import { LayoutDashboard, BookOpen, GraduationCap, Users, Sparkles, Book } from "lucide-react";
import { CurriculumSelector } from "./CurriculumSelector";
import { cn } from "../lib/utils";

interface FormPanelProps {
  onGenerate: (form: LessonPlanForm) => void;
  initialProfile?: any;
  curriculum: CurriculumItem[];
  getInsight: (grade: string) => any;
  initCurriculum: (data: any[]) => void;
  preSelectedLesson?: CurriculumItem | null;
  onClearPreSelected?: () => void;
}

const EMPTY_FORM: LessonPlanForm = {
  teacherName: "",
  schoolName: "",
  supervisorName: "",
  grade: "",
  subject: "",
  subType: "",
  lessonTitle: "",
  bookUnit: "",
  day: "",
  period: "",
  date: new Date().toISOString().split("T")[0],
  duration: "35",
  week: "1",
  lessonType: "",
  introType: "",
  alphaStrategy: "",
  classProblems: [],
};

export function FormPanel({ onGenerate, initialProfile, curriculum, getInsight, initCurriculum, preSelectedLesson, onClearPreSelected }: FormPanelProps) {
  useEffect(() => {
    if (curriculum.length === 0) {
      initCurriculum(YEMEN_CURRICULUM);
    }
  }, [curriculum.length, initCurriculum]);

  useEffect(() => {
    if (preSelectedLesson) {
      handleSelectFromBook(preSelectedLesson);
      if (onClearPreSelected) onClearPreSelected();
    }
  }, [preSelectedLesson]);

  const [form, setForm] = useState<LessonPlanForm>(() => ({
    ...EMPTY_FORM,
    ...initialProfile,
  }));
  const [tab, setTab] = useState<"info" | "pedagogy" | "classroom">("info");
  const [showCurriculum, setShowCurriculum] = useState(true);

  const handleSelectFromBook = (item: CurriculumItem) => {
    setForm(prev => ({
      ...prev,
      subject: item.subject,
      lessonTitle: item.title,
      bookUnit: item.unit,
      curriculumId: item.id,
      bookObjectives: item.objectives
    }));
    setShowCurriculum(false);
  };

  const update = (key: keyof LessonPlanForm, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleProblem = (key: string) => {
    setForm((f) => ({
      ...f,
      classProblems: f.classProblems.includes(key)
        ? f.classProblems.filter((x) => x !== key)
        : [...f.classProblems, key],
    }));
  };

  const currentGrade = form.grade ? GRADES[parseInt(form.grade)] : null;
  const currentSubject = form.subject ? SUBJECTS[form.subject] : null;

  const handleSubmit = () => {
    onGenerate(form);
  };

  const tabs = [
    { id: "info", label: "بيانات الدرس", icon: <BookOpen className="w-4 h-4"/> },
    { id: "pedagogy", label: "الاقتراحات", icon: <GraduationCap className="w-4 h-4"/> },
    { id: "classroom", label: "ملف الصف", icon: <Users className="w-4 h-4"/> },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Navigation Rails */}
      <div className="flex gap-2 mb-10 glass-panel p-2 rounded-3xl w-fit mx-auto shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gold/5 blur-xl -z-10 group-hover:bg-gold/10 transition-colors"></div>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={cn(
              "flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-500 relative overflow-hidden z-10",
              tab === t.id 
                ? "bg-gold text-slate-950 shadow-xl shadow-gold/30 scale-105" 
                : "text-slate-500 hover:text-white hover:bg-white/5 active:scale-95"
            )}
          >
            {t.icon}
            <span className="font-naskh">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Review Indicator */}
      {REVIEW_WEEKS.includes(parseInt(form.week)) && (
        <div className="mb-10 p-6 glass-panel border-amber-500/30 flex items-center gap-6 animate-pulse">
          <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-amber-500/30">🔁</div>
          <div>
            <h4 className="text-amber-500 font-bold font-naskh text-lg">أسبوع المراجعة والتمكين</h4>
            <p className="text-slate-400 text-sm font-naskh italic">يُنصح بتجنب المفاهيم الجديدة والتركيز على تحليل الفجوات المعرفية.</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="space-y-10">
        {tab === "info" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {showCurriculum && form.grade && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                   <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">توصيات المحتوى الذكية</span>
                </div>
                <CurriculumSelector 
                   grade={form.grade} 
                   items={curriculum} 
                   onSelect={handleSelectFromBook} 
                   insight={getInsight(form.grade)}
                />
              </div>
            )}

            <Section 
              title="هوية المعلم والمؤسسة" 
              icon="🏫"
              className={cn(!showCurriculum && "opacity-60 transition-all hover:opacity-100")}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="المعلم" value={form.teacherName} onChange={v => update("teacherName", v)} placeholder="الاسم الكامل" />
                <Field label="المدرسة" value={form.schoolName} onChange={v => update("schoolName", v)} placeholder="اسم المدرسة" />
                <Field label="المشرف" value={form.supervisorName} onChange={v => update("supervisorName", v)} placeholder="اختياري" />
              </div>
            </Section>

            <Section 
              title={showCurriculum ? "تحديد سياق المادة" : "تفاصيل الدرس المختار"} 
              icon="📖"
              className={cn(!showCurriculum && "border-gold/30 bg-gold/[0.02] shadow-2xl shadow-gold/10")}
            >
              {!showCurriculum && (
                <button 
                  onClick={() => setShowCurriculum(true)}
                  className="mb-8 px-4 py-2 bg-white/5 rounded-xl text-[10px] text-gold font-bold flex items-center gap-2 hover:bg-gold hover:text-slate-950 transition-all active:scale-95 border border-gold/20"
                >
                  <Book className="w-3 h-3"/> اختيار درس آخر من المنهج
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select label="الصف" value={form.grade} onChange={v => update("grade", v)}>
                  <option value="">— اختر الصف —</option>
                  {Object.entries(GRADES).map(([k, g]) => <option key={k} value={k}>{g.label}</option>)}
                </Select>
                <Select label="المجال اللغوي" value={form.subject} onChange={v => update("subject", v)}>
                  <option value="">— اختر القسم —</option>
                  {Object.entries(SUBJECTS).map(([k, s]) => <option key={k} value={k}>{s.icon} {s.label}</option>)}
                </Select>
                {currentSubject?.sub?.length ? (
                  <Select label="النوع المحدد" value={form.subType} onChange={v => update("subType", v)}>
                    <option value="">— النوع —</option>
                    {currentSubject.sub.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                ) : <div className="h-0 md:hidden"></div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Field label="عنوان الدرس" value={form.lessonTitle} onChange={v => update("lessonTitle", v)} placeholder="أدخل عنوان الدرس" />
                <Field label="الوحدة / الفصل" value={form.bookUnit} onChange={v => update("bookUnit", v)} placeholder="مثال: الوحدة الثانية" />
              </div>
            </Section>

            <Section title="المجال الزمني" icon="🗓️">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <Select label="اليوم" value={form.day} onChange={v => update("day", v)}>
                  <option value="">— اليوم —</option>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </Select>
                <Select label="الحصة" value={form.period} onChange={v => update("period", v)}>
                  <option value="">— الحصة —</option>
                  {PERIODS.map((p, i) => <option key={i} value={i + 1}>الحصة {i + 1}</option>)}
                </Select>
                <Field label="التاريخ" type="date" value={form.date} onChange={v => update("date", v)} />
                <Select label="الجدول" value={form.duration} onChange={v => update("duration", v)}>
                  <option value="35">35د (شتوي)</option>
                  <option value="40">40د (صيفي)</option>
                </Select>
                <Select label="الأسبوع" value={form.week} onChange={v => update("week", v)}>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(w => <option key={w} value={w}>الأسبوع {w}</option>)}
                </Select>
              </div>
            </Section>
          </div>
        )}

        {tab === "pedagogy" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Section title="النمط البيداغوجي" icon="🎯">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(LESSON_TYPES).map(([k, v]) => (
                  <ChoiceCard 
                    key={k}
                    title={v.label}
                    desc={v.desc}
                    icon={v.icon}
                    selected={form.lessonType === k}
                    onClick={() => update("lessonType", k)}
                  />
                ))}
              </div>
            </Section>

            <Section title="هندسة التهيئة" icon="🌅">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(INTRO_TYPES).map(([k, v]) => (
                  <ChoiceCard 
                    key={k}
                    title={v.label}
                    desc={v.ex}
                    selected={form.introType === k}
                    onClick={() => update("introType", k)}
                  />
                ))}
              </div>
            </Section>

            <Section title="استراتيجيات ألفا التوليدية" icon="⚡">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ALPHA_STRATEGIES).map(([k, v]) => (
                  <ChoiceCard 
                    key={k}
                    title={v.label}
                    desc={v.desc}
                    selected={form.alphaStrategy === k}
                    onClick={() => update("alphaStrategy", k)}
                  />
                ))}
              </div>
            </Section>
          </div>
        )}

        {tab === "classroom" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <Section title="تحديات البيئة الصفية" icon="🧠">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(CHALLENGES).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => toggleProblem(k)}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-right transition-all group relative overflow-hidden",
                        form.classProblems.includes(k)
                          ? "bg-gold/10 border-gold text-gold"
                          : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{v.icon}</div>
                      <div className="text-sm font-bold font-naskh leading-snug">{v.label}</div>
                    </button>
                  ))}
                </div>
             </Section>

             {form.grade && form.subject && (
               <Section title="المخاطر المعرفية (تحليل استباقي)" icon="⚠️">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(ERRORS[form.subject]?.[parseInt(form.grade)] || []).map((e, idx) => (
                      <div key={idx} className="glass-card p-6 border-rose-500/20 group hover:border-rose-500/40 relative">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 blur-2xl -z-10 group-hover:bg-rose-500/10"></div>
                        <div className="text-rose-500 font-bold text-base mb-3 font-naskh">⚠️ {e}</div>
                        <div className="text-slate-500 text-xs leading-relaxed font-naskh">
                           <span className="text-rose-500/40 ml-1">بروتوكول المعالجة:</span> 
                           تصحيح فوري عبر تقنية التغذية الراجعة التقابلية (مثال وعكسه).
                        </div>
                      </div>
                    ))}
                  </div>
               </Section>
             )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-16 sticky bottom-8 z-30">
        <button 
          onClick={handleSubmit}
          className="w-full py-6 glass-panel !rounded-3xl bg-gold text-slate-950 font-black text-2xl shadow-[0_30px_60px_rgba(240,192,64,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all font-naskh border-none relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          ✨ إنشاء المنظومة التعليمية
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children, className }: any) {
  return (
    <div className={cn("p-6 bg-white/5 border border-white/10 rounded-3xl", className)}>
      <h3 className="text-white font-bold flex items-center gap-3 mb-6 text-lg">
        <span className="text-gold">{icon}</span>
        <span className="font-naskh">{title}</span>
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-slate-500 text-xs font-bold px-1">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold transition-colors font-naskh"
      />
    </div>
  );
}

function Select({ label, value, onChange, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-slate-500 text-xs font-bold px-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-gold transition-colors font-naskh appearance-none"
      >
        {children}
      </select>
    </div>
  );
}

function ChoiceCard({ title, desc, icon, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-right p-4 rounded-2xl border transition-all duration-300",
        selected 
          ? "bg-gold/10 border-gold shadow-lg shadow-gold/5" 
          : "bg-slate-950 border-white/5 hover:border-white/20"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={cn("font-bold font-naskh text-sm", selected ? "text-gold" : "text-white")}>
          {icon && <span className="ml-2">{icon}</span>}
          {title}
        </div>
        <div className={cn("w-4 h-4 rounded-full border-2", selected ? "border-gold bg-gold" : "border-slate-700")}></div>
      </div>
      <p className="text-slate-500 text-[11px] leading-relaxed">{desc}</p>
    </button>
  );
}
