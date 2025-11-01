"use client";

import { useState, useCallback } from "react";
import { UserPreferences, PreferenceKey } from "./types";
import {
  loadPreferences,
  savePreferences,
  updatePreference,
  getJob,
  getHPGoal,
  getLevelGoal,
  getAPRCostMeso,
  getAPRCostNX,
  getTheme,
  setJob,
  setHPGoal,
  setLevelGoal,
  setAPRCosts,
  setTheme,
  hasStoredPreferences,
} from "./index";
import { Job } from "@/app/models/job";

/**
 * Hook to manage all user preferences
 */
export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    loadPreferences()
  );

  const updatePreferences = useCallback(
    (newPreferences: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...newPreferences };
        savePreferences(updated);
        return updated;
      });
    },
    []
  );

  const updateSinglePreference = useCallback(
    <K extends PreferenceKey>(key: K, value: UserPreferences[K]) => {
      updatePreference(key, value);
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    preferences,
    updatePreferences,
    updateSinglePreference,
  };
};

/**
 * Hook for job selection
 */
export const useJob = () => {
  const [job, setJobState] = useState<Job>(() => getJob());

  const updateJob = useCallback((newJob: Job) => {
    setJob(newJob);
    setJobState(newJob);
  }, []);

  return { job, setJob: updateJob };
};

/**
 * Hook for HP goal
 */
export const useHPGoal = () => {
  const [hpGoal, setHPGoalState] = useState<number>(() => getHPGoal());

  const updateHPGoal = useCallback((newHPGoal: number) => {
    setHPGoal(newHPGoal);
    setHPGoalState(newHPGoal);
  }, []);

  return { hpGoal, setHPGoal: updateHPGoal };
};

/**
 * Hook for level goal
 */
export const useLevelGoal = () => {
  const [levelGoal, setLevelGoalState] = useState<number>(() => getLevelGoal());

  const updateLevelGoal = useCallback((newLevelGoal: number) => {
    setLevelGoal(newLevelGoal);
    setLevelGoalState(newLevelGoal);
  }, []);

  return { levelGoal, setLevelGoal: updateLevelGoal };
};

/**
 * Hook for APR costs
 */
export const useAPRCosts = () => {
  const [aprCostMeso, setAPRCostMesoState] = useState<number>(() =>
    getAPRCostMeso()
  );
  const [aprCostNX, setAPRCostNXState] = useState<number>(() => getAPRCostNX());

  const updateAPRCosts = useCallback((meso: number, nx: number) => {
    setAPRCosts(meso, nx);
    setAPRCostMesoState(meso);
    setAPRCostNXState(nx);
  }, []);

  return {
    aprCostMeso,
    aprCostNX,
    setAPRCosts: updateAPRCosts,
  };
};

/**
 * Hook for theme
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => getTheme());

  const updateTheme = useCallback((newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      setTheme(newTheme);
      return newTheme;
    });
  }, []);

  return { theme, setTheme: updateTheme, toggleTheme };
};

/**
 * Hook to check if preferences are stored
 */
export const useStoredPreferences = () => {
  const [hasStored] = useState<boolean>(() => hasStoredPreferences());

  return hasStored;
};
