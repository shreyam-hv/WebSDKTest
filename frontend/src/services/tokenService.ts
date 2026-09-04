import axios from 'axios';
import { TokenGenerationResponse } from '../types/index';

// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function generateAuthToken(
  appId: string,
  appKey: string,
  workflowId: string,
  transactionId: string,
  expiry: number = 3600
): Promise<string> {
  const response = await axios.post<TokenGenerationResponse>(
    `${API_BASE_URL}/generate-token`,
    {
      appId,
      appKey,
      workflowId,
      transactionId,
      expiry,
    }
  );

  if (!response.data.success || !response.data.token) {
    const errorMessage = response.data.error?.message || 'Unable to generate auth token';
    throw new Error(errorMessage);
  }

  return response.data.token;
}
