import { Router, Request, Response } from 'express';
import { GenerateTokenRequest, GenerateTokenResponse } from '../types/auth';
import { generateHyperVergeToken } from '../services/hypervergeAuth';

const router = Router();

router.post('/generate-token', async (req: Request, res: Response) => {
  try {
    const { appId, appKey, workflowId, transactionId, expiry } = req.body as GenerateTokenRequest;

    // Validate required fields
    if (!appId || !appKey || !workflowId || !transactionId) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Missing required fields: appId, appKey, workflowId, transactionId',
          code: 'MISSING_FIELDS',
        },
      } as GenerateTokenResponse);
      return;
    }

    // Generate token
    const { token, expiryTime } = await generateHyperVergeToken({
      appId,
      appKey,
      workflowId,
      transactionId,
      expiry: expiry || 3600,
    });

    res.json({
      success: true,
      token,
    } as GenerateTokenResponse);
  } catch (error: unknown) {
    const err = error as any;
    console.error('Token generation error:', err.message);

    res.status(err.code === 'INVALID_CREDENTIALS' ? 401 : 500).json({
      success: false,
      error: {
        message: err.message || 'Unable to generate auth token',
        code: err.code,
      },
    } as GenerateTokenResponse);
  }
});

export default router;
