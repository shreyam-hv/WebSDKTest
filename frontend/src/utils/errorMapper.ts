export const ERROR_MESSAGES: Record<string, string> = {
  // Common SDK errors
  WORKFLOW_NOT_FOUND: 'Workflow not found for the given App ID',
  MISSING_AUTH_TOKEN: 'Missing or invalid authentication token',
  MISSING_WORKFLOW_ID: 'Workflow ID is required',
  MISSING_TRANSACTION_ID: 'Transaction ID is required',
  INVALID_REQUEST: 'Invalid request. Please check your input parameters',

  // Workflow input errors
  MISSING_WORKFLOW_INPUT: 'One or more required workflow inputs are missing',
  INVALID_INPUT_TYPE: 'One or more workflow inputs have an invalid type',
  UNEXPECTED_INPUT: 'Unexpected workflow input parameter provided',

  // User interaction errors
  USER_CANCELLED: 'User cancelled the workflow',

  // Network/Technical errors
  NETWORK_ERROR: 'Network error encountered. Please check your internet connection',
  CORS_ERROR: 'CORS error: The application domain may not be whitelisted with HyperVerge',
  CAMERA_PERMISSION_DENIED: 'Camera permission was denied. Please enable camera access',
  CAMERA_INITIALIZATION_FAILED: 'Failed to initialize camera. Please try again',
  MEDIARECORDER_UNAVAILABLE: 'MediaRecorder API is not supported in your browser',
  RECORDING_GENERATION_ERROR: 'Failed to generate recording. Please try again',

  // Authentication errors
  UNAUTHORIZED: 'Unauthorized: Invalid credentials or signature validation failed',
  SESSION_CONFLICT: 'A session conflict occurred. Transaction ID might already be in use',

  // API errors
  INTERNAL_SERVER_ERROR: 'Internal server error. Please try again later',
  SERVICE_UNAVAILABLE: 'HyperVerge service is temporarily unavailable',
  INVALID_CREDENTIALS: 'Invalid App ID or App Key',

  // Generic errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  SDK_LOAD_ERROR: 'Failed to load HyperVerge Web SDK',
  TOKEN_GENERATION_FAILED: 'Failed to generate authentication token',
};

export function mapErrorToMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if error message matches known errors
    const message = error.message;
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (message.includes(key) || message.includes(value)) {
        return value;
      }
    }
    return message;
  }

  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  if (typeof error === 'object' && error !== null) {
    const obj = error as any;
    if (obj.code && ERROR_MESSAGES[obj.code]) {
      return ERROR_MESSAGES[obj.code];
    }
    if (obj.message) {
      return obj.message;
    }
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'user_cancelled':
      return '⊗';
    case 'error':
      return '✕';
    case 'auto_approved':
      return '✓';
    case 'auto_declined':
      return '✗';
    case 'needs_review':
      return '⟳';
    default:
      return '?';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'user_cancelled':
      return '#999';
    case 'error':
      return '#d32f2f';
    case 'auto_approved':
      return '#388e3c';
    case 'auto_declined':
      return '#f57c00';
    case 'needs_review':
      return '#1976d2';
    default:
      return '#666';
  }
}
