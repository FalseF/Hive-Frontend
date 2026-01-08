/**
 * Converts a Date or ISO string to YYYY-MM-DD format
 * 
 *  Use this when binding date values to <input type="date">
 * Example:
 * `
 * <input type="date" value={toDateInputString(user.birthDate)} />
 * 
 */
export const toDateInputString = (value: string | Date | undefined | null): string => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return ""; // invalid date

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/**
 * Converts a Date or ISO string to DD/MM/YYYY format
 * 
 *  Use this for displaying a date in a user-friendly format
 * Example:
 * 
 * <span>{toDisplayDateString(user.birthDate)}</span> // "26/03/1998"
 * 
 */
export const toDisplayDateString = (value: string | Date | undefined | null): string => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Converts a local Date or string (YYYY-MM-DD) to a full ISO string
 * 
 *  Use this when sending a date to the backend (ASP.NET, SQL, etc.)
 * Example:
 * 
 * api.post("/users", { birthDate: toISOString(form.birthDate) });
 * 
 */
export const toISOString = (value: string | Date | undefined | null): string | null => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return null;

    return date.toISOString();
};

/**
 * Formats a Date or ISO string to a human-readable form
 * 
 *  Ideal for logs, reports, and activity timestamps
 * Example:
 * 
 * formatReadable("2025-11-05T10:15:00") // "05 Nov 2025, 10:15 AM"
 * 
 */
export const formatReadable = (value: string | Date | undefined | null): string => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
