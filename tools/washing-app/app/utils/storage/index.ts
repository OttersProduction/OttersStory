import { UserPreferences, PreferenceKey, StorageError } from "./types";
import { DEFAULT_PREFERENCES } from "@/app/models/defaults";
import { Job } from "@/app/models/job";

const STORAGE_KEY = "washing-app-preferences";

/**
 * Validate a stored value against expected type
 */
const validateValue = (key: PreferenceKey, value: any): boolean => {
  switch (key) {
    case "job":
      return Object.values(Job).includes(value);
    case "hpGoal":
    case "levelGoal":
    case "aprCostMeso":
    case "aprCostNX":
      return typeof value === "number" && value > 0;
    case "theme":
      return value === "light" || value === "dark";
    default:
      return false;
  }
};

/**
 * Save user preferences to localStorage
 */
export const savePreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
};

/**
 * Load user preferences from localStorage
 */
export const loadPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored) as UserPreferences;

    // Validate all values and use defaults for invalid ones
    const validated: UserPreferences = {
      job: validateValue("job", parsed.job)
        ? parsed.job
        : DEFAULT_PREFERENCES.job,
      hpGoal: validateValue("hpGoal", parsed.hpGoal)
        ? parsed.hpGoal
        : DEFAULT_PREFERENCES.hpGoal,
      levelGoal: validateValue("levelGoal", parsed.levelGoal)
        ? parsed.levelGoal
        : DEFAULT_PREFERENCES.levelGoal,
      aprCostMeso: validateValue("aprCostMeso", parsed.aprCostMeso)
        ? parsed.aprCostMeso
        : DEFAULT_PREFERENCES.aprCostMeso,
      aprCostNX: validateValue("aprCostNX", parsed.aprCostNX)
        ? parsed.aprCostNX
        : DEFAULT_PREFERENCES.aprCostNX,
      theme: validateValue("theme", parsed.theme)
        ? parsed.theme
        : DEFAULT_PREFERENCES.theme,
    };

    return validated;
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Update a single preference value
 */
export const updatePreference = <K extends PreferenceKey>(
  key: K,
  value: UserPreferences[K]
): void => {
  const preferences = loadPreferences();
  preferences[key] = value;
  savePreferences(preferences);
};

/**
 * Clear all stored preferences
 */
export const clearPreferences = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear preferences:", error);
  }
};

/**
 * Individual preference getters
 */
export const getJob = (): Job => loadPreferences().job;
export const getHPGoal = (): number => loadPreferences().hpGoal;
export const getLevelGoal = (): number => loadPreferences().levelGoal;
export const getAPRCostMeso = (): number => loadPreferences().aprCostMeso;
export const getAPRCostNX = (): number => loadPreferences().aprCostNX;
export const getTheme = (): "light" | "dark" => loadPreferences().theme;

/**
 * Individual preference setters
 */
export const setJob = (job: Job): void => updatePreference("job", job);
export const setHPGoal = (hpGoal: number): void =>
  updatePreference("hpGoal", hpGoal);
export const setLevelGoal = (levelGoal: number): void =>
  updatePreference("levelGoal", levelGoal);
export const setAPRCosts = (meso: number, nx: number): void => {
  updatePreference("aprCostMeso", meso);
  updatePreference("aprCostNX", nx);
};
export const setTheme = (theme: "light" | "dark"): void =>
  updatePreference("theme", theme);

/**
 * Check if preferences exist in storage
 */
export const hasStoredPreferences = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
