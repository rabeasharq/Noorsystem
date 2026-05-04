/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GraduationCap, BookOpen, Key, Sparkles, ChevronRight, UserCircle } from "lucide-react";
import { Student } from "../types";
import { cn } from "../lib/utils";

interface AuthViewProps {
  students: Student[];
  onLogin: (role: "teacher" | "student", studentId?: string) => void;
}

export function AuthView({ students, onLogin }: AuthViewProps) {
  const [mode, setMode] = useState<"choose" | "student-login">("choose");
  const [studentCode, setStudentCode] = useState("");
  const [error, setError] = useState("");

  const handleStudentLogin = () => {
    const student = students.find(s => s.loginCode?.toUpperCase() === studentCode.toUpperCase());
    if (student) {
      onLogin("student", student.id);
    } else {
      setError("عذراً، رمز الدخول غير صحيح. تحقق من المعلم الخاص بك.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-700">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gold/10 text-gold mb-6 ring-1 ring-gold/20 shadow-2xl shadow-gold/20 animate-pulse">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-white font-naskh">نظام <span className="text-gold">نور</span> الذكي</h1>
          <p className="text-slate-400 font-naskh text-lg">بوابة التعلم المتكاملة لجيل ألفا</p>
        </div>

        {mode === "choose" ? (
          <div className="grid grid-cols-1 gap-6">
            <RoleCard 
              icon={<UserCircle className="w-8 h-8 text-gold" />}
              title="دخول المعلم"
              desc="إدارة المنهج، تحضير الدروس، ومتابعة الأداء"
              onClick={() => onLogin("teacher")}
              color="gold"
            />
            <RoleCard 
              icon={<GraduationCap className="w-8 h-8 text-sky-400" />}
              title="دخول الطالب"
              desc="عرض نقاطك، أوسمتك، ورحلتك التعليمية"
              onClick={() => setMode("student-login")}
              color="sky"
            />
          </div>
        ) : (
          <div className="glass-panel p-10 space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-white font-naskh">مرحباً بك يا بطل!</h2>
              <p className="text-slate-500 text-sm font-naskh">أدخل رمز الدخول الخاص بك للانتقال إلى عالمك</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="S-XXXX"
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 pr-12 pl-4 text-white text-xl font-mono text-center tracking-[0.5em] outline-none focus:border-gold transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleStudentLogin()}
                  autoFocus
                />
              </div>
              
              {error && (
                <p className="text-rose-500 text-xs text-center font-bold animate-bounce">{error}</p>
              )}

              <button 
                onClick={handleStudentLogin}
                className="w-full py-5 bg-gold text-slate-950 rounded-2xl font-black text-lg font-naskh hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gold/20"
              >
                انطلاق في الرحلة!
              </button>
              
              <button 
                onClick={() => setMode("choose")}
                className="w-full py-2 text-slate-500 hover:text-white text-xs font-bold transition-colors"
              >
                العودة للاختيار
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
           <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Smart Educational Hub v2.0</div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, desc, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "glass-panel p-8 text-right flex items-center gap-6 group hover:scale-[1.03] transition-all relative overflow-hidden",
        color === "gold" ? "hover:border-gold/40 border-gold/10" : "hover:border-sky-500/40 border-sky-500/10"
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:rotate-12",
        color === "gold" ? "bg-gold/10" : "bg-sky-500/10"
      )}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black text-white font-naskh mb-1">{title}</h3>
        <p className="text-slate-500 text-xs font-naskh leading-relaxed">{desc}</p>
      </div>
      <ChevronRight className="absolute left-6 w-6 h-6 text-slate-700 group-hover:text-white group-hover:translate-x-[-4px] transition-all" />
    </button>
  );
}
