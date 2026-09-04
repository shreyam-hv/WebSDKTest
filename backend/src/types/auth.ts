export interface GenerateTokenRequest {
  appId: string;
  appKey: string;
  workflowId: string;
  transactionId: string;
  expiry?: number;
}

export interface GenerateTokenResponse {
  success: boolean;
  token?: string;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface HyperVergeTokenResponse {
  appId: string;
  workflowId: string;
  transactionId: string;
  token: string;
  expiryTime: number;
}
