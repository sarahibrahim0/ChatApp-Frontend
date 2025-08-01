import { formatDistanceToNowStrict } from 'date-fns';

export function formatTimeAgo(date) {
  if (!date) return '';

  let timeAgo = formatDistanceToNowStrict(new Date(date), { addSuffix: true });

  timeAgo = timeAgo
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y");

  return timeAgo.startsWith("0") ? "just now" : timeAgo;
}
