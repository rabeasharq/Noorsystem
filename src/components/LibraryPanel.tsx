/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CurriculumItem } from "../types";
import { Book, Upload, Search, Trash2, Library, Loader2, Sparkles, AlertCircle, Target } from "lucide-react";
import { cn } from "../lib/utils";
import * as pdfjs from 'pdfjs-dist';
import { GoogleGenAI, Type } from "@google/genai";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;

interface LibraryPanelProps {
  curriculum: CurriculumItem[];
  onSave: (items: CurriculumItem[]) => void;
  onDelete: (id: string) => void;
}

export function LibraryPanel({ curriculum, onSave, onDelete }: LibraryPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument(typedArray).promise;
          
          let fullText = "";
          // To save tokens and time, we analyze first 15 pages (usually TOC and first units)
          const pagesToScan = Math.min(pdf.numPages, 15);
          
          for (let i = 1; i <= pagesToScan; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += `--- Page ${i} ---\n${pageText}\n`;
          }

          await structureCurriculum(fullText);
        } catch (err) {
          console.error("PDF Parse Error:", err);
          setError("فشل في قراءة ملف PDF. تأكد أنه غير محمي بكلمة سر.");
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الملف.");
      setIsProcessing(false);
    }
  };

  const structureCurriculum = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `Analyze this extracted text from an Arabic school textbook and extract a list of lessons/units. 
            Return a JSON array of objects fitting this schema:
            {
              id: string (unique),
              grade: string (e.g. "7"),
              unit: string (e.g. "الوحدة الأولى"),
              title: string (Lesson name),
              subject: string (one of: reading, grammar, poetry, spelling, writing, expression),
              objectives: string[] (extracted or inferred educational objectives),
              keyConcepts: string[],
              suggestedIntro: string (a creative idea for lesson start)
            }
            
            Text: ${text}`
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: {
                   id: { type: Type.STRING },
                   grade: { type: Type.STRING },
                   unit: { type: Type.STRING },
                   title: { type: Type.STRING },
                   subject: { type: Type.STRING },
                   objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                   keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                   suggestedIntro: { type: Type.STRING }
                },
                required: ["id", "grade", "unit", "title", "subject", "objectives"]
             }
          }
        }
      });

      const items = JSON.parse(response.text || "[]");
      if (items.length > 0) {
        onSave(items);
      } else {
        setError("لم يتم العثور على دروس واضحة في هذا المقطع من الكتاب.");
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("فشل تحليل محتوى الكتاب عبر الذكاء الاصطناعي.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = curriculum.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.unit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto">
      <div className="relative p-10 glass-panel overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 noor-glow opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 noor-glow opacity-10 bg-sky-500/30"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h2 className="text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-4 font-naskh">
              <Library className="w-10 h-10 text-gold" />
              المكتبة المنهجية الذكية
            </h2>
            <p className="text-slate-400 text-base mt-2 max-w-md font-naskh">
              حوّل كتب اللغة العربية الرقمية (PDF) إلى قاعدة بيانات تفاعلية تدعم تخطيطك اليومي بذكاء.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <label className={cn(
              "relative flex items-center gap-4 px-8 py-4 bg-gold text-slate-950 rounded-2xl font-bold font-naskh cursor-pointer hover:scale-105 transition-all shadow-2xl shadow-gold/20 active:scale-95 group",
              isProcessing && "opacity-50 cursor-wait pointer-events-none"
            )}>
               {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
               <span className="text-lg">{isProcessing ? "جاري الاستيعاب رقمياً..." : "فهرسة كتاب مدرسي"}</span>
               <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
            {isProcessing && (
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-gold h-full animate-[progress_2s_infinite_linear]" style={{ width: '40%' }}></div>
              </div>
            )}
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">يدعم كتب المناهج اليمنية والعربية</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center gap-4 text-rose-400 font-naskh animate-in fade-in slide-in-from-top-4">
           <AlertCircle className="w-6 h-6 shrink-0" />
           <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row gap-6">
         <div className="flex-1 relative">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="البحث في فهرس الدروس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-panel !rounded-2xl py-5 pr-14 pl-6 text-white focus:border-gold outline-none transition-all font-naskh placeholder:text-slate-600"
            />
         </div>
         <div className="glass-panel !rounded-2xl px-10 flex flex-col justify-center items-center shrink-0 min-w-[200px]">
            <div className="text-3xl font-bold text-gold">{curriculum.length}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">درس متاح أوفلاين</div>
         </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filtered.length > 0 ? (
           filtered.map((item) => (
             <div key={item.id} className="glass-card p-8 group hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/5 blur-3xl group-hover:bg-sky-500/10 transition-colors -z-10"></div>
                
                <div className="flex justify-between items-start mb-6">
                   <div className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
                      الصف {item.grade}
                   </div>
                   <button 
                     onClick={() => onDelete(item.id)}
                     className="p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>

                <div className="space-y-2 mb-8 flex-1">
                   <div className="text-slate-500 text-xs font-bold uppercase tracking-widest font-naskh opacity-70">{item.unit}</div>
                   <h3 className="text-2xl font-bold text-white font-naskh leading-tight group-hover:text-gold transition-colors">{item.title}</h3>
                   <div className="pt-2">
                       <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-[10px] font-bold border border-white/5">
                          {item.subject}
                       </span>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                   <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase mb-3 tracking-widest">أهداف التعلم</div>
                      <div className="space-y-2">
                         {item.objectives.slice(0, 3).map((obj, i) => (
                           <div key={i} className="flex gap-2 items-start text-xs text-slate-400 font-naskh line-clamp-1">
                              <span className="text-gold">•</span> {obj}
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="p-4 bg-gold/5 rounded-2xl border border-gold/10 group-hover:border-gold/20 transition-all">
                      <div className="text-[10px] text-gold font-bold uppercase mb-2 flex items-center gap-2">
                         <Sparkles className="w-3 h-3" /> فكرة تفاعلية (جيل ألفا)
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed font-naskh italic">{item.suggestedIntro}</p>
                   </div>
                </div>
             </div>
           ))
         ) : (
           <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6 glass-panel border-dashed border-2">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                 <Book className="w-10 h-10 text-slate-700" />
              </div>
              <div className="text-center">
                 <h4 className="text-white font-bold text-xl font-naskh mb-2 text-slate-400">مكتبتك خاوية حالياً</h4>
                 <p className="text-slate-600 text-sm font-naskh max-w-sm">
                    ابدأ برفع أول كتاب مدرسي بصيغة PDF ليقوم نظام "نور" بتحليله وتوفير دروسه في قائمة التخطيط.
                 </p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
