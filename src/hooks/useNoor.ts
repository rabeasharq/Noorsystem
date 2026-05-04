/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { NoorDB } from "../lib/db";
import { LessonPlan, LessonPlanForm } from "../types";

export function useNoor() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAction = useCallback(async () => {
    setIsLoading(true);
    try {
      const [p, prof, s, a, curr] = await Promise.all([
        NoorDB.getPlans(),
        NoorDB.getPref("profile"),
        NoorDB.getStudents(),
        NoorDB.getAllActivities(),
        NoorDB.getCurriculum()
      ]);
      setPlans(p);
      setProfile(prof);
      setStudents(s);
      setActivities(a);
      setCurriculum(curr);
    } catch (e) {
      console.error("Failed to load local data", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAction();
  }, [refreshAction]);

  const savePlan = async (form: LessonPlanForm) => {
    await NoorDB.savePlan(form);
    await refreshAction();
  };

  const deletePlan = async (id: number) => {
    await NoorDB.deletePlan(id);
    await refreshAction();
  };

  const updateProfile = async (prof: any) => {
    await NoorDB.setPref("profile", prof);
    setProfile(prof);
  };

  const saveStudent = async (student: any) => {
    const updatedStudent = { ...student };
    if (!updatedStudent.loginCode) {
      updatedStudent.loginCode = `S-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    await NoorDB.saveStudent(updatedStudent);
    await refreshAction();
  };

  const deleteStudent = async (id: string) => {
    await NoorDB.deleteStudent(id);
    await refreshAction();
  };

  const logActivity = async (log: any) => {
    await NoorDB.logActivity(log);
    await refreshAction();
  };

  const exportBackup = async () => {
    return await NoorDB.exportData();
  };

  const importBackup = async (json: string) => {
    await NoorDB.importData(json);
    await refreshAction();
  };

  const getInsight = (grade: string): any => {
    const gradeActivities = activities.filter(a => {
      const student = students.find(s => s.id === a.studentId);
      return student?.grade === grade;
    });

    if (gradeActivities.length === 0) return null;

    const cats: Record<string, number> = {};
    gradeActivities.forEach(a => {
      cats[a.category] = (cats[a.category] || 0) + a.points;
    });

    const entries = Object.entries(cats);
    if (entries.length === 0) return null;

    const lowest = entries.sort((a,b) => a[1] - b[1])[0];
    const topPerformer = students.filter(s => s.grade === grade).sort((a,b) => b.points - a.points)[0];
    
    return {
      weakPoints: [lowest[0]],
      recommendation: lowest[0] === 'reading' 
        ? "لاحظت المنظومة ضعفاً في القراءة لدى هذا الصف، يُقترح بدء الدرس القادم بنشاط 'القراءة المعبرة' وتركيز النقاط عليها."
        : "يُقترح تعزيز مهارة متميزة في " + lowest[0] + " في الحصة القادمة لتطوير الطلاب المتعثرين.",
      prediction: {
        focus: lowest[0],
        expectedEngagement: "عالي",
        mentorStudent: topPerformer?.name
      }
    };
  };

  const initCurriculum = async (data: any[]) => {
    await NoorDB.saveCurriculumBatch(data);
    await refreshAction();
  };

  return {
    plans,
    profile,
    students,
    activities,
    curriculum,
    isLoading,
    savePlan,
    deletePlan,
    updateProfile,
    saveStudent,
    deleteStudent,
    logActivity,
    getInsight,
    initCurriculum,
    exportBackup,
    importBackup,
    refresh: refreshAction
  };
}
