/**
 * Utility for handling local drafts of song requests
 */

const DRAFT_KEY = 'beatstory_request_draft';

export const saveDraft = (data) => {
  if (!data) return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving draft:', e);
  }
};

export const getDraft = () => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading draft:', e);
    return null;
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error('Error clearing draft:', e);
  }
};