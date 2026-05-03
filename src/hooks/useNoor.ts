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
  const [isLoading, setIsLoading] = useState(true);

  const refreshAction = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = await NoorDB.getPlans();
      const prof = await NoorDB.getPref("profile");
      setPlans(p);
      setProfile(prof);
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

  const exportBackup = async () => {
    return await NoorDB.exportData();
  };

  const importBackup = async (json: string) => {
    await NoorDB.importData(json);
    await refreshAction();
  };

  return {
    plans,
    profile,
    isLoading,
    savePlan,
    deletePlan,
    updateProfile,
    exportBackup,
    importBackup,
    refresh: refreshAction
  };
}
