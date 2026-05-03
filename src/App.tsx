/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { BackupPanel } from "./components/BackupPanel";
import { FormPanel } from "./components/FormPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { GuidePanel } from "./components/GuidePanel";
import { useNoor } from "./hooks/useNoor";
import { AnimatePresence, motion } from "motion/react";
import { buildPlan } from "./lib/engine";
import { LessonPlan, LessonPlanForm } from "./types";

export default function App() {
  const [view, setView] = useState("form");
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState<{msg:string, type:'success'|'error'|'info'} | null>(null);
  const { plans, profile, isLoading, savePlan, deletePlan, refresh, updateProfile } = useNoor();

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = (form: LessonPlanForm) => {
    try {
      const plan = buildPlan(form);
      setActivePlan(plan);
      setIsSaved(false);
      setView("preview");
      // Persist profile automatically
      updateProfile({
        teacherName: form.teacherName,
        schoolName: form.schoolName,
        supervisorName: form.supervisorName,
        grade: form.grade
      });
    } catch (e) {
      showToast("فشل إنشاء الخطة. تأكد من إكمال البيانات الأساسية.", "error");
    }
  };

  const handleSaveActive = async () => {
    if (!activePlan) return;
    try {
      await savePlan(activePlan.form);
      setIsSaved(true);
      showToast("تم حفظ الخطة بنجاح في قاعدة البيانات المحلية", "success");
    } catch (e) {
      showToast("خطأ أثناء الحفظ", "error");
    }
  };

  const handleLoadHistory = (p: LessonPlan) => {
    const plan = buildPlan(p.form);
    setActivePlan(plan);
    setIsSaved(true);
    setView("preview");
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      await deletePlan(id);
      showToast("تم الحذف بنجاح", "info");
    } catch (e) {
      showToast("تعذر الحذف", "error");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c1a] font-amiri select-none">
      <Sidebar view={view} setView={setView} plansCount={plans.length} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#0f1528] flex items-center justify-between px-8 no-print shrink-0 z-10">
           <h2 className="text-xl font-bold text-white font-naskh">
             {view === "form" && "إنشاء تحضير جديد"}
             {view === "history" && "سجل الخطط المحفوظة"}
             {view === "feedback" && "التغذية الراجعة التطورية"}
             {view === "backup" && "إدارة البيانات والأمان"}
             {view === "guide" && "دليل الاستخدام"}
             {view === "preview" && "معاينة الخطة"}
           </h2>
           <div className="flex items-center gap-4">
             {profile?.teacherName && (
               <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                 مرحباً أ. {profile.teacherName}
               </div>
             )}
             <div className="h-6 w-px bg-white/5"></div>
             <div className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               محلي وآمن
             </div>
           </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === "form" && <FormPanel onGenerate={handleGenerate} initialProfile={profile} />}
              {view === "preview" && activePlan && (
                <PreviewPanel 
                  plan={activePlan} 
                  onBack={() => setView("form")} 
                  onSave={handleSaveActive}
                  saved={isSaved}
                />
              )}
              {view === "history" && (
                <HistoryPanel 
                  plans={plans} 
                  onLoad={handleLoadHistory} 
                  onDelete={handleDeleteHistory} 
                />
              )}
              {view === "feedback" && <FeedbackPanel plans={plans} />}
              {view === "backup" && <BackupPanel onImported={refresh} toast={showToast} />}
              {view === "guide" && <GuidePanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[9999] border ${
                toast.type === 'success' ? 'bg-emerald-600 border-emerald-400' : 
                toast.type === 'error' ? 'bg-rose-600 border-rose-400' : 'bg-slate-800 border-slate-600'
              } text-white font-bold font-naskh flex items-center gap-3 text-sm`}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; }`}</style>
    </div>
  );
}
