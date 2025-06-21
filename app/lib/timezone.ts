// Timezone utility functions

/**
 * Get the user's timezone from the browser
 */
export function getUserTimezone(): string {
  if (typeof window !== "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return "UTC";
}

/**
 * Convert a UTC date string to user's local timezone
 */
export function utcToLocal(utcDateString: string, userTimezone?: string): Date {
  const utcDate = new Date(utcDateString);
  const timezone = userTimezone || getUserTimezone();

  // Create a new date in the user's timezone
  const localTime = new Date(
    utcDate.toLocaleString("en-US", { timeZone: timezone })
  );

  return localTime;
}

/**
 * Convert a local date to UTC for storage
 */
export function localToUtc(localDate: Date): Date {
  // Get the timezone offset in minutes
  const offset = localDate.getTimezoneOffset();

  // Create UTC date by adjusting for timezone offset
  const utcDate = new Date(localDate.getTime() - offset * 60000);

  return utcDate;
}

/**
 * Format a date in the user's local timezone
 */
export function formatLocalTime(
  date: Date | string,
  userTimezone?: string
): string {
  const timezone = userTimezone || getUserTimezone();
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Debug function to understand timezone conversion
 */
export function debugTimezone(dateString: string, userTimezone?: string): void {
  const timezone = userTimezone || getUserTimezone();
  const date = new Date(dateString);

  console.log("Original date string:", dateString);
  console.log("Parsed date:", date);
  console.log("User timezone:", timezone);
  console.log(
    "Local time string:",
    date.toLocaleTimeString("en-US", { timeZone: timezone })
  );
  console.log(
    "Local date string:",
    date.toLocaleDateString("en-US", { timeZone: timezone })
  );
  console.log("UTC time:", date.toISOString());
}

/**
 * Format a date for display with relative time
 */
export function formatRelativeTime(
  dateString: string,
  userTimezone?: string
): string {
  const timezone = userTimezone || getUserTimezone();
  const date = new Date(dateString);
  const now = new Date();

  // Get the time in the user's timezone directly
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });

  // Get the date in the user's timezone for day comparison
  const localDateString = date.toLocaleDateString("en-US", {
    timeZone: timezone,
  });
  const nowString = now.toLocaleDateString("en-US", { timeZone: timezone });

  // Compare dates
  if (localDateString === nowString) {
    return `Today, ${timeString}`;
  } else {
    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toLocaleDateString("en-US", {
      timeZone: timezone,
    });

    if (localDateString === tomorrowString) {
      return `Tomorrow, ${timeString}`;
    } else {
      // Check if it's within the next 7 days
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1 && diffDays <= 7) {
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: timezone,
        });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: timezone,
        });
      }
    }
  }
}

/**
 * Get time remaining until a scheduled time
 */
export function getTimeRemaining(
  dateString: string,
  userTimezone?: string
): string | null {
  const timezone = userTimezone || getUserTimezone();
  const date = new Date(dateString);
  const now = new Date();

  // Convert both dates to the user's timezone for comparison
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );
  const localNow = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );

  const diffTime = localDate.getTime() - localNow.getTime();

  if (diffTime <= 0) return null;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h remaining`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m remaining`;
  } else {
    return `${diffMinutes}m remaining`;
  }
}

/**
 * Create a date string in user's timezone for input fields
 */
export function createLocalDateTimeString(
  date: Date,
  userTimezone?: string
): string {
  const timezone = userTimezone || getUserTimezone();
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
