import axios from 'axios';
import { GenerateTokenRequest, HyperVergeTokenResponse } from '../types/auth';

const HYPERVERGE_AUTH_URL = process.env.HYPERVERGE_AUTH_URL || 'https://ind-state.idv.hyperverge.co/v2/auth/token';

export async function generateHyperVergeToken(
  request: GenerateTokenRequest
): Promise<{ token: string; expiryTime: number }> {
  const expiry = request.expiry || 3600; // Default 1 hour

  const payload = {
    appId: request.appId,
    appKey: request.appKey,
    expiry: expiry,
    transactionId: request.transactionId,
    workflowId: request.workflowId,
  };

  try {
    console.log('\n========== HyperVerge Auth Request ==========');
    console.log('URL:', HYPERVERGE_AUTH_URL);
    console.log('Method: POST');
    console.log('Headers:', {
      'Content-Type': 'application/json',
    });
    console.log('Request Payload:', JSON.stringify(payload, null, 2));
    console.log('===========================================\n');
    
    const response = await axios.post(
      HYPERVERGE_AUTH_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
        validateStatus: () => true, // Don't throw on any status code
      }
    );

    console.log('\n========== HyperVerge Auth Response ==========');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', response.headers);
    console.log('Response Body:', JSON.stringify(response.data, null, 2));
    console.log('===========================================\n');

    if (response.status !== 200 && response.status !== 201) {
      const errorData = response.data as any;
      throw {
        message: errorData?.message || `API returned status ${response.status}`,
        code: 'API_ERROR',
        status: response.status,
        details: errorData,
      };
    }

    const data = response.data as any;
    
    // HyperVerge API returns token in data.result.authToken
    let token: string | null = null;
    
    if (typeof data === 'string') {
      // Response might be the token string directly
      token = data;
    } else if (data && typeof data === 'object') {
      // Check nested result.authToken first (standard HyperVerge format)
      if (data.result && data.result.authToken) {
        token = data.result.authToken;
      } else {
        // Try common field names for the token
        token = data.token || 
                data.authToken || 
                data.auth_token ||
                data.accessToken ||
                data.access_token ||
                data.jwtToken ||
                data.jwt_token;
      }
    }
    
    if (!token) {
      console.error('Could not find token in response. Available keys:', Object.keys(data || {}));
      console.error('Full response:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response from HyperVerge auth service - token not found in response');
    }
    
    console.log('\n✅ Successfully extracted auth token');
    console.log('Token Preview:', token.substring(0, 50) + '...');
    console.log('=====================================\n');

    return {
      token: token,
      expiryTime: data.expiryTime || Math.floor(Date.now() / 1000) + expiry,
    };
  } catch (error) {
    console.log('\n========== HyperVerge Auth Error ==========');
    
    const axiosError = error as any;
    
    // If it's our custom error object
    if (axiosError.code === 'API_ERROR') {
      console.error('HyperVerge API Error Status:', axiosError.status);
      console.error('Error Message:', axiosError.message);
      console.error('Error Details:', JSON.stringify(axiosError.details, null, 2));
      console.log('===========================================\n');
      throw {
        message: axiosError.message,
        code: 'INVALID_REQUEST',
        details: axiosError.details,
      };
    }
    
    // Log network/axios errors
    console.error('Axios Error Details:');
    console.error('- Message:', axiosError.message);
    console.error('- Code:', axiosError.code);
    console.error('- URL:', HYPERVERGE_AUTH_URL);
    console.error('- Response Status:', axiosError.response?.status);
    console.error('- Response StatusText:', axiosError.response?.statusText);
    console.error('- Response Data:', JSON.stringify(axiosError.response?.data, null, 2));
    console.error('- Request:', axiosError.config?.data);
    console.log('===========================================\n');

    // Throw user-friendly error
    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      if (status === 401 || status === 403) {
        throw {
          message: 'Invalid App ID or App Key',
          code: 'INVALID_CREDENTIALS',
          details: data,
        };
      } else if (status === 400) {
        throw {
          message: 'Invalid request parameters',
          code: 'INVALID_REQUEST',
          details: data,
        };
      } else {
        throw {
          message: 'Failed to generate auth token',
          code: 'TOKEN_GENERATION_FAILED',
          details: data,
        };
      }
    }

    throw {
      message: `Network error while generating auth token: ${axiosError.message}`,
      code: 'NETWORK_ERROR',
      details: {
        errorCode: axiosError.code,
        errno: axiosError.errno,
        syscall: axiosError.syscall,
      },
    };
  }
}
