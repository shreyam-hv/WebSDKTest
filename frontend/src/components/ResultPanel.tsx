import React from 'react';
import { Button } from './FormFields';
import { HyperKycResult } from '../types/index';
import { copyToClipboard, formatJSON } from '../utils/helpers';
import { getStatusIcon, getStatusColor } from '../utils/errorMapper';

interface ResultPanelProps {
  result: HyperKycResult | null;
  error: string | null;
  tokenError: string | null;
  status: string | null;
  transactionId: string;
  onClear: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  error,
  tokenError,
  status,
  transactionId,
  onClear,
}) => {
  const hasContent = result || error || tokenError || status;

  return (
    <div className="result-panel">
      <div className="result-header">
        <h2>SDK Result</h2>
        {hasContent && (
          <div className="result-actions">
            <Button
              label="Copy Response"
              onClick={() => {
                if (result) copyToClipboard(formatJSON(result));
              }}
              variant="secondary"
              size="small"
              disabled={!result}
            />
            <Button label="Clear" onClick={onClear} variant="secondary" size="small" />
          </div>
        )}
      </div>

      {tokenError && (
        <div className="result-error">
          <div className="error-title">Token Generation Failed</div>
          <p>{tokenError}</p>
        </div>
      )}

      {error && (
        <div className="result-error">
          <div className="error-title">Error</div>
          <p>{error}</p>
        </div>
      )}

      {status && (
        <div className="result-status">
          <div className="status-header">
            <span
              className="status-icon"
              style={{ color: getStatusColor(status) }}
            >
              {getStatusIcon(status)}
            </span>
            <span className="status-text">{status}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="result-content">
          <div className="result-item">
            <label>Transaction ID</label>
            <code>{result.transactionId || transactionId}</code>
          </div>

          {result.status && (
            <div className="result-item">
              <label>Status</label>
              <code>{result.status}</code>
            </div>
          )}

          {result.code && (
            <div className="result-item">
              <label>Error Code</label>
              <code>{result.code}</code>
            </div>
          )}

          {result.message && (
            <div className="result-item">
              <label>Message</label>
              <code>{result.message}</code>
            </div>
          )}

          <div className="result-item">
            <label>Full Response</label>
            <pre className="result-json">{formatJSON(result)}</pre>
          </div>

          <div className="result-item">
            <label>Timestamp</label>
            <code>{new Date().toLocaleString()}</code>
          </div>
        </div>
      )}

      {!hasContent && (
        <div className="empty-state">
          <p>No SDK result yet. Generate a token and launch the SDK to see results here.</p>
        </div>
      )}
    </div>
  );
};
