/**
 * API utility function that automatically includes role header
 * Note: Authorization header should be passed in options.headers
 * Uses Next.js API routes (relative paths)
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get role from localStorage (defaults to 'human' if not set)
  const role = typeof window !== 'undefined' ? (localStorage.getItem('userRole') || 'human') : 'human';

  // Merge headers - preserve existing headers and add role
  const existingHeaders = (options.headers as Record<string, string>) || {};
  const headers = {
    'Content-Type': 'application/json',
    ...existingHeaders,
    'X-User-Role': role,
  };

  // Use relative paths for Next.js API routes
  const apiUrl = url.startsWith('http') ? url : url;

  return fetch(apiUrl, {
    ...options,
    headers,
  });
}
