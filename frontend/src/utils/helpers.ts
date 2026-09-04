export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function maskStringValue(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) {
    return value;
  }
  return value.substring(0, visibleChars) + '*'.repeat(value.length - visibleChars);
}

export function copyToClipboard(text: string): boolean {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export function formatJSON(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function parseJSON(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
