/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Student } from "../types";
import { Plus, UserPlus, Trash2, Search, GraduationCap, Award, MapPin } from "lucide-react";
import { GRADES, BADGES } from "../constants/data";
import { cn } from "../lib/utils";

interface StudentManagerProps {
  students: Student[];
  onSave: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentManager({ students, onSave, onDelete }: StudentManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const toggleBadge = (student: Student, badgeLabel: string) => {
    const has = student.badges.includes(badgeLabel);
    const newBadges = has 
      ? student.badges.filter(b => b !== badgeLabel)
      : [...student.badges, badgeLabel];
    
    onSave({ ...student, badges: newBadges });
  };
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    grade: "7",
    classId: "أ",
    points: 0,
    badges: []
  });

  const handleAdd = () => {
    if (!newStudent.name) return;
    onSave({
      ...newStudent,
      id: Date.now().toString(),
      points: 0,
      badges: []
    } as Student);
    setNewStudent({ ...newStudent, name: "" });
    setShowAdd(false);
  };

  const filtered = students.filter(s => 
    s.name.includes(search) || 
    s.grade.includes(search)
  ).sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث عن طالب..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white text-sm outline-none focus:border-gold transition-all font-naskh"
          />
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-gold text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all font-naskh"
        >
          <UserPlus className="w-5 h-5" />
          إضافة طالب جديد
        </button>
      </div>

      {showAdd && (
        <div className="p-6 bg-slate-900 border border-gold/30 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <h3 className="text-gold font-bold mb-4 font-naskh border-b border-gold/10 pb-2">بيانات الطالب الجديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pr-1">الاسم الرباعي</label>
              <input 
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pr-1">الصف</label>
              <select 
                value={newStudent.grade}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold appearance-none"
              >
                {Object.entries(GRADES).map(([num, g]) => (
                  <option key={num} value={num} className="bg-slate-900">{g.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pr-1">الشعبة</label>
              <input 
                type="text"
                value={newStudent.classId}
                onChange={(e) => setNewStudent({...newStudent, classId: e.target.value})}
                placeholder="أ، ب، ج..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-gold transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setShowAdd(false)}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              إلغاء
            </button>
            <button 
              onClick={handleAdd}
              className="bg-gold px-8 py-2 rounded-lg text-slate-950 font-bold font-naskh hover:bg-yellow-400"
            >
              حفظ الطالب
            </button>
          </div>
        </div>
      )}

      {students.length === 0 ? (
        <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
           <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-10" />
           <p className="text-slate-500 font-naskh">لا يوجد طلاب مسجلين حالياً. ابدأ بإضافة طلابك لبدء التحفيز.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <div 
              key={s.id}
              className={cn(
                "bg-white/5 border border-white/5 p-5 rounded-2xl group transition-all relative overflow-hidden",
                selectedStudentId === s.id ? "border-gold bg-gold/[0.03]" : "hover:border-gold/30 hover:bg-gold/[0.02]"
              )}
              onClick={() => setSelectedStudentId(selectedStudentId === s.id ? null : s.id)}
            >
              {/* Rank Badge */}
              <div className="absolute -left-2 -top-2 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-end pl-3 pt-3 rotate-12 text-gold font-bold text-lg opacity-20 group-hover:opacity-40 transition-opacity">
                {i + 1}
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <h4 className="text-white font-bold font-naskh text-lg">{s.name}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {GRADES[s.grade]?.label} ({s.classId})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold border border-gold/20">
                    {s.points} نقطة
                  </div>
                  <button 
                    onClick={() => { if(window.confirm(`حذف الطالب ${s.name}؟`)) onDelete(s.id); }}
                    className="p-1.5 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1">
                {s.badges.length > 0 ? s.badges.map((bLabel, idx) => {
                  const bDef = BADGES.find(bd => bd.label === bLabel);
                  return (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded-md bg-white/10 flex items-center gap-1 text-[10px] font-bold border border-white/10" 
                      style={{ color: bDef?.color }}
                    >
                      {bDef?.icon || "🏷️"} {bLabel}
                    </span>
                  );
                }) : (
                  <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">لا توجد أوسمة بعد</div>
                )}
              </div>

              {selectedStudentId === s.id && (
                <div className="mt-6 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[9px] text-slate-500 font-bold uppercase mb-3 text-center">تخصيص الأوسمة</p>
                   <div className="grid grid-cols-2 gap-2">
                      {BADGES.map((b) => (
                        <button
                          key={b.id}
                          onClick={(e) => { e.stopPropagation(); toggleBadge(s, b.label); }}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg text-[10px] font-bold border transition-all",
                            s.badges.includes(b.label) 
                              ? "bg-gold/20 border-gold/40 text-gold" 
                              : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                          )}
                        >
                          <span className="text-sm">{b.icon}</span>
                          {b.label}
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
