/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CurriculumItem } from "../types";
import { Book, Upload, Search, Trash2, Library, Loader2, Sparkles, AlertCircle } from "lucide-react";
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-naskh">
            <Library className="w-8 h-8 text-gold" />
            المكتبة المنهجية الذكية
          </h2>
          <p className="text-slate-500 text-sm mt-1">قم برفع كتاب المادة (PDF) لتحليله وفهرسته تلقائياً</p>
        </div>

        <label className={cn(
          "relative flex items-center gap-3 px-6 py-3 bg-gold text-[#1a0a2a] rounded-2xl font-bold font-naskh cursor-pointer hover:scale-105 transition-all shadow-xl shadow-gold/20",
          isProcessing && "opacity-50 cursor-wait pointer-events-none"
        )}>
           {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
           {isProcessing ? "جاري التحليل والاستيعاب..." : "تحميل وفهرسة كتاب جديد"}
           <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2">
           <AlertCircle className="w-5 h-5" />
           {error}
        </div>
      )}

      {/* Stats and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-3 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="ابحث في الدروس المفوهرسة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-6 text-white focus:border-gold outline-none transition-all font-naskh"
            />
         </div>
         <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col justify-center items-center">
            <div className="text-2xl font-bold text-gold">{curriculum.length}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">إجمالي الدروس</div>
         </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.length > 0 ? (
           filtered.map((item) => (
             <div key={item.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:border-gold/30 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-sky-500/5 blur-3xl group-hover:bg-sky-500/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold">
                      {item.grade}
                   </div>
                   <button 
                     onClick={() => onDelete(item.id)}
                     className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>

                <div className="space-y-1 mb-4">
                   <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{item.unit}</div>
                   <h3 className="text-white font-bold text-lg font-naskh">{item.title}</h3>
                   <div className="flex gap-2 mt-2">
                       <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded text-[9px] font-bold border border-white/5">
                          {item.subject}
                       </span>
                   </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                   <div>
                      <div className="text-[9px] text-slate-600 font-bold uppercase mb-2">الأهداف المستخرجة</div>
                      <div className="flex flex-wrap gap-1">
                         {item.objectives.slice(0, 2).map((obj, i) => (
                           <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-lg truncate max-w-full">
                              • {obj}
                           </span>
                         ))}
                      </div>
                   </div>
                   
                   <div className="p-3 bg-gold/5 rounded-xl border border-gold/10 group-hover:border-gold/30 transition-all">
                      <div className="text-[9px] text-gold font-bold uppercase mb-1 flex items-center gap-1">
                         <Sparkles className="w-3 h-3" /> فكرة جيل ألفا
                      </div>
                      <p className="text-slate-300 text-[10px] leading-relaxed italic">{item.suggestedIntro}</p>
                   </div>
                </div>
             </div>
           ))
         ) : (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 space-y-4">
              <Book className="w-16 h-16 opacity-20" />
              <p className="font-naskh">لا توجد دروس تطابق بحثك أو لم يتم تحميل كتب بعد.</p>
           </div>
         )}
      </div>
    </div>
  );
}
