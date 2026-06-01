import { isBefore } from 'date-fns';

const getLaunchDate = () => {
  // Default to a date far in the future if env var is missing to prevent accidental launch
  const dateStr = import.meta.env.VITE_REQUESTS_LAUNCH_AT || '2026-03-01T12:00:00+01:00';
  return new Date(dateStr);
};

export const isRequestsLive = () => {
  const launchDate = getLaunchDate();
  const now = new Date();
  return isBefore(launchDate, now);
};