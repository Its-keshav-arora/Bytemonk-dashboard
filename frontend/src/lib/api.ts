/**
 * API utility function that automatically includes role header
 * Note: Authorization header should be passed in options.headers
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get role from localStorage (defaults to 'human' if not set)
  const role = localStorage.getItem('userRole') || 'human';

  // Merge headers - preserve existing headers and add role
  const existingHeaders = (options.headers as Record<string, string>) || {};
  const headers = {
    'Content-Type': 'application/json',
    ...existingHeaders,
    'X-User-Role': role,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

