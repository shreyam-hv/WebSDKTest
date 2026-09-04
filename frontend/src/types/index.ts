export interface SDKTestConfig {
  appId: string;
  appKey: string;
  workflowId: string;
  transactionId: string;
  sdkVersion: string;
  expiry: number;
  inputs: Record<string, string>;
  showLandingPage: boolean;
  supportDarkMode: boolean;
  useLocation: boolean;
  defaultLangCode?: string;
}

export interface SDKTestState {
  authToken: string | null;
  tokenLoading: boolean;
  sdkLoading: boolean;
  sdkLoaded: boolean;
  sdkStatus: string | null;
  sdkResult: unknown;
  error: string | null;
  tokenError?: string | null;
}

export interface WorkflowInput {
  key: string;
  value: string;
}

export interface HyperKycResult {
  status: 'user_cancelled' | 'error' | 'auto_approved' | 'auto_declined' | 'needs_review';
  code?: string;
  message?: string;
  details?: unknown;
  transactionId?: string;
  workflowId?: string;
}

export interface TokenGenerationResponse {
  success: boolean;
  token?: string;
  error?: {
    message: string;
    code?: string;
  };
}
