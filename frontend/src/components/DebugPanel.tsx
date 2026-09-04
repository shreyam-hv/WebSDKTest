import React from 'react';
import { Button } from './FormFields';
import { copyToClipboard, formatJSON, maskStringValue } from '../utils/helpers';

interface DebugPanelProps {
  tokenRequest?: {
    appId: string;
    appKey: string;
    workflowId: string;
    transactionId: string;
    expiry: number;
  };
  sdkConfig?: {
    workflowId: string;
    transactionId: string;
    inputs?: Record<string, string>;
    showLandingPage: boolean;
  };
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ tokenRequest, sdkConfig }) => {
  const [expandedToken, setExpandedToken] = React.useState(false);
  const [expandedConfig, setExpandedConfig] = React.useState(false);

  return (
    <div className="debug-panel">
      <h3>Debug Information</h3>

      {tokenRequest && (
        <div className="debug-section">
          <div
            className="debug-header"
            onClick={() => setExpandedToken(!expandedToken)}
          >
            <span className="toggle-icon">{expandedToken ? '▼' : '▶'}</span>
            Token Request
          </div>
          {expandedToken && (
            <pre className="debug-content">
              {formatJSON({
                appId: tokenRequest.appId,
                appKey: maskStringValue(tokenRequest.appKey),
                workflowId: tokenRequest.workflowId,
                transactionId: tokenRequest.transactionId,
                expiry: tokenRequest.expiry,
              })}
            </pre>
          )}
        </div>
      )}

      {sdkConfig && (
        <div className="debug-section">
          <div
            className="debug-header"
            onClick={() => setExpandedConfig(!expandedConfig)}
          >
            <span className="toggle-icon">{expandedConfig ? '▼' : '▶'}</span>
            SDK Configuration
          </div>
          {expandedConfig && (
            <pre className="debug-content">
              {formatJSON(sdkConfig)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
