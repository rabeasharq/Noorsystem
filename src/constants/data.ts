/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grade, Subject } from "../types";

export const APP_VERSION = "1.1.0";
export const APP_NAME = "نور";
export const APP_FULL = "منظومة نور — تحضير دروس اللغة العربية";

export const GRADES: Record<number, Grade> = {
  7: { 
    label:"الصف السابع",  code:"G7", level:"مرحلة التأسيس المعزز",
    bloom:"التذكر والفهم والتطبيق",
    cog:"الطالب في مرحلة انتقالية — يحتاج ربط المعرفة بواقعه اليمني المباشر",
    alphaRisks:["ضعف التركيز بعد 10 دقائق","الحاجة للتحفيز الفوري","التعلم البصري قبل السمعي","ضعف الدافعية الذاتية"],
    color:"#1b3f7a", accent:"#3d8ef0", light:"#e8f2ff" 
  },
  8: { 
    label:"الصف الثامن", code:"G8", level:"مرحلة البناء والتعمق",
    bloom:"الفهم والتطبيق والتحليل",
    cog:"قادر على الربط والتحليل الأولي — يستجيب للتحدي المعرفي والمنافسة",
    alphaRisks:["التشتت عند المهام الطويلة","الحاجة للتحدي والمنافسة","ميل للعمل الجماعي","الفجوة المعرفية من سنوات الانقطاع"],
    color:"#0d4a28", accent:"#22c06b", light:"#e6faf0" 
  },
  9: { 
    label:"الصف التاسع",  code:"G9", level:"مرحلة الإتقان والإبداع",
    bloom:"التحليل والتقييم والإبداع",
    cog:"ذروة الاستعداد — يحتاج تحديات تحليلية وإبداعية مع استقلالية محدودة",
    alphaRisks:["التفكير النقدي الناشئ غير المنضبط","الاستقلالية الزائدة أحياناً","الإبداع بحاجة لقيود واضحة","ضعف الصبر على الشرح التقليدي"],
    color:"#3d1060", accent:"#a855f7", light:"#f5eeff" 
  },
};

export const SUBJECTS: Record<string, Subject> = {
  grammar:     { label:"النحو والصرف", icon:"⚖️",  sessions:2, sub:["نحو","صرف"],        color:"#1b3f7a" },
  texts:       { label:"النصوص",       icon:"📜",  sessions:1, sub:["نثر","شعر"],        color:"#7a3b00" },
  reading:     { label:"القراءة",      icon:"📖",  sessions:1, sub:[],                   color:"#1a5c1a" },
  dictation:   { label:"الإملاء",      icon:"✏️",  sessions:1, sub:["منقول","منظور","استماعي"], color:"#5c1a1a" },
  calligraphy: { label:"الخط",         icon:"🖊️", sessions:1, sub:["نسخ","رقعة"],       color:"#4a3a00" },
  expression:  { label:"التعبير",      icon:"💬",  sessions:1, sub:["شفهي","كتابي"],     color:"#3a005c" },
};

export const DAYS = ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء"];
export const PERIODS = ["7:30–8:05","8:10–8:45","8:50–9:25","9:30–10:05","10:10–10:45","10:50–11:25"];
export const REVIEW_WEEKS = [5, 10, 14];

export const LESSON_TYPES = {
  inductive:   { label:"استقرائية",      icon:"🔍", best:["grammar","dictation"],       desc:"من الأمثلة إلى القاعدة" },
  deductive:   { label:"استنتاجية",      icon:"💡", best:["reading","texts"],           desc:"من القاعدة إلى التطبيق" },
  cooperative: { label:"تعاونية",        icon:"🤝", best:["expression","texts"],        desc:"مجموعات صغيرة ذات أدوار" },
  station:     { label:"محطات التعلم",   icon:"🎯", best:["grammar","dictation","reading"], desc:"محطات 7 دقائق — لجيل ألفا" },
  gamified:    { label:"تلعيب",          icon:"🎮", best:["grammar","calligraphy"],     desc:"تحويل الدرس لتحدٍّ وألعاب" },
  flipped:     { label:"فصل مقلوب",     icon:"🔄", best:["texts","expression"],        desc:"الطالب يحضر — للصف التاسع" },
  project:     { label:"مشروعية",        icon:"🏗️", best:["expression","texts"],       desc:"مهمة مشروع متكاملة" },
  review_type: { label:"مراجعة وتثبيت", icon:"🔁", best:["grammar","reading","texts"], desc:"للأسابيع 5 و10 و14" },
};

export const INTRO_TYPES = {
  story:     { label:"القصة المشوقة",    ex:"قصة قصيرة من اليمن تُمهّد للموضوع" },
  question:  { label:"السؤال الإشكالي", ex:"سؤال محيّر لا إجابة له حتى نهاية الدرس" },
  riddle:    { label:"اللغز اللغوي",    ex:"لغز يُحل بتطبيق موضوع الدرس" },
  real_life: { label:"الموقف الحياتي",  ex:"موقف يومي يمني يقتضي استخدام الدرس" },
  challenge: { label:"تحدي البطل",      ex:"من يكتشف الخطأ في هذه الجملة؟" },
  review:    { label:"جسر المراجعة",    ex:"سؤالان سريعان من درس سابق كجسر" },
  image:     { label:"الصورة المثيرة",  ex:"صورة أو رسم يثير التساؤل والتفكير" },
};

export const ALPHA_STRATEGIES = {
  stations:    { label:"محطات التعلم السريع",      desc:"تقسيم الحصة لمحطات 7 دقائق بمهام واضحة" },
  puzzle:      { label:"التعلم بالألغاز",           desc:"المحتوى تحدٍّ يُحفز الفضول الفطري لجيل ألفا" },
  hero:        { label:"البطل اللغوي",              desc:"الدرس رحلة بطولية — المهارة كمستوى لعبة" },
  coop:        { label:"التعلم التعاوني الديناميكي",desc:"مجموعات متغيرة بأدوار واضحة" },
  yemeni:      { label:"ربط الواقع اليمني",         desc:"أمسية من صنعاء وعدن وحضرموت — معنى شخصي" },
  immediate:   { label:"التغذية الراجعة الفورية",   desc:"تصحيح وتعزيز آني — يُشبع حاجة جيل ألفا" },
  story_frame: { label:"قصة الدرس",                 desc:"المحتوى في قصة تبدأ وتكتمل خلال الحصة" },
  compete:     { label:"المنافسة الإيجابية",        desc:"تحديات سريعة بجوائز معنوية بين المجموعات" },
};

export const CHALLENGES: Record<string, { label: string, icon: string, recs: string[] }> = {
  distraction:  { label:"تشتت الانتباه",      icon:"🌀",
    recs:["محطات تعلم كل 7 دقائق","إشارات بصرية للانتقال بين الأنشطة","مهام قصيرة بنتيجة فورية","منافسة سريعة كل 10 دقائق"] },
  grammar_weak: { label:"ضعف نحوي",           icon:"📉",
    recs:["أمثلة من القرآن الكريم أولاً","ربط القاعدة بجمل من البيئة اليمنية","خريطة مفاهيم ملونة للقاعدة","تدريب متكرر بأسلوب اللعب"] },
  low_reading:  { label:"ضعف القراءة",         icon:"📚",
    recs:["قراءة جهرية جماعية يومياً","مسابقة القراءة السليمة داخل الفصل","شرح المفردات بالصور قبل القراءة","5 دقائق قراءة حرة أسبوعياً"] },
  passivity:    { label:"سلبية في المشاركة",  icon:"😶",
    recs:["نقاط تحفيزية فورية","أسئلة موجهة للهادئين بلطف","تعلم تعاوني بمجموعات صغيرة","بطاقة المشاركة اليومية"] },
  writing_weak: { label:"ضعف الكتابة",         icon:"✍️",
    recs:["إملاء منظور قبل الاستماعي","تمارين خط قصيرة يومياً","تصحيح ذاتي وتبادلي فوري","مفردات كتابية من البيئة اليمنية"] },
  mixed_levels: { label:"تفاوت المستويات",     icon:"📊",
    recs:["مهام متمايزة (سهل/متوسط/متقدم)","المتقدم يساعد المبتدئ","أنشطة متدرجة تُشبع كل مستوى","تقييم بنكي متعدد المستويات"] },
};

export const BADGES = [
  { id: "reader_gold", label: "القارئ الذهبي", icon: "📖", color: "#fbbf24", requirement: "إتقان القراءة والضبط" },
  { id: "calligrapher", label: "الخطاط المبدع", icon: "✒️", color: "#10b981", requirement: "جمال الخط والترتيب" },
  { id: "grammar_king", label: "فارس اللغة", icon: "⚖️", color: "#3b82f6", requirement: "التفوق في قواعد النحو" },
  { id: "perfect_notebook", label: "الدفتر المثالي", icon: "📓", color: "#f59e0b", requirement: "تنظيم الدفتر والواجب" },
  { id: "scholar", label: "المثابر الذكي", icon: "🎓", color: "#a855f7", requirement: "المشاركة الفعالة بالفصل" },
  { id: "behavior_star", label: "نجم الأخلاق", icon: "🌟", color: "#f43f5e", requirement: "السلوك القويم مع الزملاء" },
];
