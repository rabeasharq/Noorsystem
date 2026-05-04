/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Grade {
  label: string;
  code: string;
  level: string;
  bloom: string;
  cog: string;
  alphaRisks: string[];
  color: string;
  accent: string;
  light: string;
}

export interface Subject {
  label: string;
  icon: string;
  sessions: number;
  sub: string[];
  color: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  classId: string; // e.g. "أ", "ب"
  points: number;
  badges: string[];
  lastActivityAt?: string;
  loginCode?: string; // Format: S-XXXX
}

export interface ActivityLog {
  id: string;
  studentId: string;
  type: 'positive' | 'negative';
  category: 'reading' | 'calligraphy' | 'homework' | 'behavior' | 'participation' | 'memorization' | 'notebook';
  points: number;
  note: string;
  timestamp: string;
  lessonId?: number;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  requirement: string;
  color: string;
}

export interface CurriculumItem {
  id: string;
  grade: string;
  subject: string;
  unit: string;
  title: string;
  objectives: string[];
  keyConcepts: string[];
  suggestedIntro: string;
}

export interface TeacherInsight {
  date: string;
  summary: string;
  weakPoints: string[];
  strongPoints: string[];
  recommendationForNext: string;
}

export interface LessonPlanForm {
  teacherName: string;
  schoolName: string;
  supervisorName: string;
  grade: string;
  subject: string;
  subType: string;
  lessonTitle: string;
  bookUnit: string;
  day: string;
  period: string;
  date: string;
  duration: string; // "35" | "40"
  week: string;
  lessonType: string;
  introType: string;
  alphaStrategy: string;
  classProblems: string[];
  curriculumId?: string;
  bookObjectives?: string[];
}

export interface LessonPlanStage {
  name: string;
  t: number;
  acts: string[];
  color: string;
}

export interface LessonPlan {
  id: number;
  form: LessonPlanForm;
  meta: {
    grade: string;
    gradeNum: number;
    gradeCode: string;
    subject: string;
    subjectKey: string;
    subType: string;
    lessonTitle: string;
    bookUnit: string;
    teacherName: string;
    schoolName: string;
    supervisorName: string;
    day: string;
    period: string;
    periodNum: string;
    date: string;
    rawDate: string;
    duration: string;
    week: string;
    level: string;
    bloom: string;
    cogNote: string;
    lessonTypeLabel: string;
    introTypeLabel: string;
    alphaLabel: string;
    color: string;
    accent: string;
    light: string;
  };
  objectives: string[];
  strategies: string[];
  tools: string[];
  stages: LessonPlanStage[];
  alphaStrategy: string;
  alphaDesc: string;
  introLabel: string;
  introEx: string;
  introDesc: string;
  lessonTypeLabel: string;
  lessonTypeDesc: string;
  expectedErrors: string[];
  errorRemedies: string[];
  assessments: string[];
  homework: string;
  challengeRecs: string[];
  references: string[];
  savedAt?: string;
}
