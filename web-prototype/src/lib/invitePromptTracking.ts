/**
 * INVITE PROMPT TRACKING UTILITIES
 * 
 * Manages which invite prompts have been shown to users
 * Prevents spam by tracking dismissals and timing
 * 
 * For React Native:
 * - Replace localStorage with AsyncStorage from '@react-native-async-storage/async-storage'
 * - All methods are async-ready
 */

const STORAGE_KEY = 'regent_invite_prompts';

interface PromptsState {
  first_asset_seen: boolean;
  first_asset_dismissed_at?: string;
  first_view_seen: boolean;
  first_view_dismissed_at?: string;
  net_worth_up_last_shown?: string;
  net_worth_up_dismissed_count: number;
  streak_7_seen: boolean;
  streak_7_dismissed_at?: string;
}

const getDefaultState = (): PromptsState => ({
  first_asset_seen: false,
  first_view_seen: false,
  net_worth_up_dismissed_count: 0,
  streak_7_seen: false,
});

const getState = (): PromptsState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultState(), ...JSON.parse(stored) };
    }
  } catch (err) {
    console.error('Error reading invite prompts state:', err);
  }
  return getDefaultState();
};

const setState = (state: PromptsState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving invite prompts state:', err);
  }
};

/**
 * Check if a prompt should be shown
 */
export const shouldShowPrompt = (
  trigger: 'first_asset' | 'first_view' | 'net_worth_up' | '7_day_streak'
): boolean => {
  const state = getState();
  const now = Date.now();

  switch (trigger) {
    case 'first_asset':
      // Only show once, or 7 days after dismissal
      if (!state.first_asset_seen) return true;
      if (state.first_asset_dismissed_at) {
        const dismissedDate = new Date(state.first_asset_dismissed_at).getTime();
        const daysSince = (now - dismissedDate) / (1000 * 60 * 60 * 24);
        return daysSince >= 7;
      }
      return false;

    case 'first_view':
      // Only show once, or 7 days after dismissal
      if (!state.first_view_seen) return true;
      if (state.first_view_dismissed_at) {
        const dismissedDate = new Date(state.first_view_dismissed_at).getTime();
        const daysSince = (now - dismissedDate) / (1000 * 60 * 60 * 24);
        return daysSince >= 7;
      }
      return false;

    case 'net_worth_up':
      // Show max once per week, and not if dismissed more than 3 times
      if (state.net_worth_up_dismissed_count >= 3) return false;
      
      if (!state.net_worth_up_last_shown) return true;
      
      const lastShown = new Date(state.net_worth_up_last_shown).getTime();
      const daysSince = (now - lastShown) / (1000 * 60 * 60 * 24);
      return daysSince >= 7;

    case '7_day_streak':
      // Only show once, or 30 days after dismissal
      if (!state.streak_7_seen) return true;
      if (state.streak_7_dismissed_at) {
        const dismissedDate = new Date(state.streak_7_dismissed_at).getTime();
        const daysSince = (now - dismissedDate) / (1000 * 60 * 60 * 24);
        return daysSince >= 30;
      }
      return false;

    default:
      return false;
  }
};

/**
 * Mark a prompt as shown (user saw it)
 */
export const markPromptShown = (
  trigger: 'first_asset' | 'first_view' | 'net_worth_up' | '7_day_streak'
): void => {
  const state = getState();

  switch (trigger) {
    case 'first_asset':
      state.first_asset_seen = true;
      break;

    case 'first_view':
      state.first_view_seen = true;
      break;

    case 'net_worth_up':
      state.net_worth_up_last_shown = new Date().toISOString();
      break;

    case '7_day_streak':
      state.streak_7_seen = true;
      break;
  }

  setState(state);
};

/**
 * Mark a prompt as dismissed (user clicked "Later" or "Dismiss")
 */
export const markPromptDismissed = (
  trigger: 'first_asset' | 'first_view' | 'net_worth_up' | '7_day_streak'
): void => {
  const state = getState();
  const now = new Date().toISOString();

  switch (trigger) {
    case 'first_asset':
      state.first_asset_dismissed_at = now;
      break;

    case 'first_view':
      state.first_view_dismissed_at = now;
      break;

    case 'net_worth_up':
      state.net_worth_up_dismissed_count += 1;
      state.net_worth_up_last_shown = now;
      break;

    case '7_day_streak':
      state.streak_7_dismissed_at = now;
      break;
  }

  setState(state);
};

/**
 * Mark a prompt as actioned (user clicked "Share Invite")
 * This prevents showing the same prompt again
 */
export const markPromptActioned = (
  trigger: 'first_asset' | 'first_view' | 'net_worth_up' | '7_day_streak'
): void => {
  const state = getState();

  // Mark as seen (permanent)
  switch (trigger) {
    case 'first_asset':
      state.first_asset_seen = true;
      delete state.first_asset_dismissed_at;
      break;

    case 'first_view':
      state.first_view_seen = true;
      delete state.first_view_dismissed_at;
      break;

    case 'net_worth_up':
      // For net worth prompts, just update last shown
      state.net_worth_up_last_shown = new Date().toISOString();
      break;

    case '7_day_streak':
      state.streak_7_seen = true;
      delete state.streak_7_dismissed_at;
      break;
  }

  setState(state);
};

/**
 * Reset all prompt tracking (for testing)
 */
export const resetPromptTracking = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get current prompt state (for debugging)
 */
export const getPromptState = (): PromptsState => {
  return getState();
};
