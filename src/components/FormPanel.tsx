/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GRADES, SUBJECTS, DAYS, PERIODS, LESSON_TYPES, INTRO_TYPES, ALPHA_STRATEGIES, CHALLENGES, REVIEW_WEEKS } from "../constants/data";
import { ERRORS } from "../constants/content";
import { LessonPlanForm } from "../types";
import { LayoutDashboard, BookOpen, GraduationCap, Users } from "lucide-react";
import { cn } from "../lib/utils";

interface FormPanelProps {
  onGenerate: (form: LessonPlanForm) => void;
  initialProfile?: any;
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

export function FormPanel({ onGenerate, initialProfile }: FormPanelProps) {
  const [form, setForm] = useState<LessonPlanForm>(() => ({
    ...EMPTY_FORM,
    ...initialProfile,
  }));
  const [tab, setTab] = useState<"info" | "pedagogy" | "classroom">("info");

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
    <div className="max-w-4xl mx-auto pb-20">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              tab === t.id 
                ? "bg-gold text-slate-950 shadow-lg shadow-gold/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {t.icon}
            <span className="font-naskh">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Review Banner */}
      {REVIEW_WEEKS.includes(parseInt(form.week)) && (
        <div className="mb-8 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl">🔁</div>
          <div>
            <h4 className="text-amber-500 font-bold font-naskh">هذا الأسبوع أسبوع مراجعة!</h4>
            <p className="text-amber-200/60 text-xs">يُنصح بالتركيز على تثبيت المهارات السابقة وتشخيص الفجوات.</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="space-y-8">
        {tab === "info" && (
          <div className="space-y-6">
            <Section title="هوية المعلم والمدرسة" icon="🏫">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="اسم المعلم" value={form.teacherName} onChange={v => update("teacherName", v)} placeholder="الاسم الكامل" />
                <Field label="اسم المدرسة" value={form.schoolName} onChange={v => update("schoolName", v)} placeholder="اسم المدرسة" />
                <Field label="الموجه التربوي" value={form.supervisorName} onChange={v => update("supervisorName", v)} placeholder="اختياري" />
              </div>
            </Section>

            <Section title="بيانات الدرس الأساسية" icon="📖">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select label="الصف الدراسي" value={form.grade} onChange={v => update("grade", v)}>
                  <option value="">— اختر الصف —</option>
                  {Object.entries(GRADES).map(([k, g]) => <option key={k} value={k}>{g.label}</option>)}
                </Select>
                <Select label="القسم / المادة" value={form.subject} onChange={v => update("subject", v)}>
                  <option value="">— اختر القسم —</option>
                  {Object.entries(SUBJECTS).map(([k, s]) => <option key={k} value={k}>{s.icon} {s.label}</option>)}
                </Select>
                {currentSubject?.sub?.length ? (
                  <Select label="النوع الفرعي" value={form.subType} onChange={v => update("subType", v)}>
                    <option value="">— النوع —</option>
                    {currentSubject.sub.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                ) : <div className="h-0 md:hidden"></div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="عنوان الدرس" value={form.lessonTitle} onChange={v => update("lessonTitle", v)} placeholder="أدخل عنوان الدرس" />
                <Field label="الوحدة / الفصل" value={form.bookUnit} onChange={v => update("bookUnit", v)} placeholder="مثال: الوحدة الثانية" />
              </div>
            </Section>

            <Section title="الجدول الزمني" icon="🗓️">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <Select label="اليوم" value={form.day} onChange={v => update("day", v)}>
                  <option value="">— اليوم —</option>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </Select>
                <Select label="الحصة" value={form.period} onChange={v => update("period", v)}>
                  <option value="">— الحصة —</option>
                  {PERIODS.map((p, i) => <option key={i} value={i + 1}>الحصة {i + 1}</option>)}
                </Select>
                <Field label="التاريخ" type="date" value={form.date} onChange={v => update("date", v)} />
                <Select label="المدة" value={form.duration} onChange={v => update("duration", v)}>
                  <option value="35">35 دقيقة</option>
                  <option value="30">30 دقيقة</option>
                </Select>
                <Select label="الأسبوع" value={form.week} onChange={v => update("week", v)}>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(w => <option key={w} value={w}>الأسبوع {w}</option>)}
                </Select>
              </div>
            </Section>
          </div>
        )}

        {tab === "pedagogy" && (
          <div className="space-y-6">
            <Section title="نمط الحصة الاستراتيجي" icon="🎯">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            <Section title="نوع التمهيد والتهيئة" icon="🌅">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            <Section title="استراتيجية جيل ألفا" icon="⚡">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="space-y-6">
             <Section title="تحديات الصف الحالية" icon="🧠">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(CHALLENGES).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => toggleProblem(k)}
                      className={cn(
                        "p-4 rounded-2xl border text-right transition-all",
                        form.classProblems.includes(k)
                          ? "bg-sky-500/20 border-sky-500 text-sky-400"
                          : "bg-slate-900 border-white/5 text-slate-400 hover:border-white/20"
                      )}
                    >
                      <div className="text-xl mb-1">{v.icon}</div>
                      <div className="text-sm font-bold font-naskh">{v.label}</div>
                    </button>
                  ))}
                </div>
             </Section>

             {form.grade && form.subject && (
               <Section title="الأخطاء المتوقعة (تحليل ذكي)" icon="⚠️">
                  <div className="space-y-3">
                    {(ERRORS[form.subject]?.[parseInt(form.grade)] || []).map((e, idx) => (
                      <div key={idx} className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                        <div className="text-rose-400 font-bold text-sm mb-1">⚠️ {e}</div>
                        <div className="text-slate-500 text-xs">الإجراء: تصحيح فوري بأسلوب التساؤل ثم مثال تصحيحي مقابل.</div>
                      </div>
                    ))}
                  </div>
               </Section>
             )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-12">
        <button 
          onClick={handleSubmit}
          className="w-full py-5 bg-gradient-to-r from-gold-dark to-gold text-slate-950 rounded-2xl font-bold text-xl shadow-2xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-naskh"
        >
          ✨ إنشاء خطة التحضير الاحترافية
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
