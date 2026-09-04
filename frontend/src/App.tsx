import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputField, CheckboxField, Button } from './components/FormFields';
import { WorkflowInputsSection } from './components/WorkflowInputs';
import { AdvancedConfig } from './components/AdvancedConfig';
import { ResultPanel } from './components/ResultPanel';
import { DebugPanel } from './components/DebugPanel';
import { SDKTestConfig, SDKTestState, WorkflowInput, HyperKycResult } from './types/index';
import { generateAuthToken } from './services/tokenService';
import {
  loadSDK,
  createHyperKycConfig,
  launchSDK,
  prefetchWorkflow,
  isSdkLoaded,
} from './services/sdkLoader';
import { generateUUID } from './utils/helpers';
import { mapErrorToMessage } from './utils/errorMapper';
import SDK_VERSION from './config/sdk-version';
import './App.css';

export const App: React.FC = () => {
  // Configuration state
  const [config, setConfig] = useState<SDKTestConfig>({
    appId: '',
    appKey: '',
    workflowId: '',
    transactionId: '',
    sdkVersion: SDK_VERSION,
    expiry: 3600,
    inputs: {},
    showLandingPage: false,
    supportDarkMode: false,
    useLocation: false,
  });

  // SDK state
  const [state, setState] = useState<SDKTestState>({
    authToken: null,
    tokenLoading: false,
    sdkLoading: false,
    sdkLoaded: false,
    sdkStatus: null,
    sdkResult: null,
    error: null,
    tokenError: null,
  });

  // UI state
  const [workflowInputs, setWorkflowInputs] = useState<WorkflowInput[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Password visibility toggle
  const [showAppKey, setShowAppKey] = useState(false);

  // ============ Configuration Handlers ============

  const handleConfigChange = useCallback(
    (key: keyof SDKTestConfig, value: any) => {
      setConfig((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleGenerateTransactionId = useCallback(() => {
    handleConfigChange('transactionId', generateUUID());
  }, [handleConfigChange]);

  // ============ Workflow Inputs Handlers ============

  const handleAddInput = useCallback(() => {
    setWorkflowInputs((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const handleUpdateInput = useCallback(
    (index: number, key: string, value: string) => {
      setWorkflowInputs((prev) => {
        const updated = [...prev];
        updated[index] = { key, value };
        return updated;
      });
    },
    []
  );

  const handleDeleteInput = useCallback((index: number) => {
    setWorkflowInputs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Convert workflow inputs array to object
  const getInputsObject = (): Record<string, string> => {
    const inputs: Record<string, string> = {};
    workflowInputs.forEach(({ key, value }) => {
      if (key.trim()) {
        inputs[key] = value;
      }
    });
    return inputs;
  };

  // ============ Token Generation ============

  const handleGenerateToken = useCallback(async () => {
    if (!config.appId || !config.appKey || !config.workflowId || !config.transactionId) {
      setState((prev) => ({
        ...prev,
        tokenError: 'Please fill in all required fields: App ID, App Key, Workflow ID, and Transaction ID',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      tokenLoading: true,
      tokenError: null,
      sdkStatus: null,
      sdkResult: null,
      error: null,
    }));

    try {
      const token = await generateAuthToken(
        config.appId,
        config.appKey,
        config.workflowId,
        config.transactionId,
        config.expiry
      );

      setState((prev) => ({
        ...prev,
        authToken: token,
        tokenLoading: false,
        tokenError: null,
      }));
    } catch (error) {
      const errorMessage = mapErrorToMessage(error);
      setState((prev) => ({
        ...prev,
        tokenLoading: false,
        tokenError: errorMessage,
      }));
    }
  }, [config]);

  // ============ SDK Launch ============

  const handleLaunchSDK = useCallback(async () => {
    if (!state.authToken) {
      setState((prev) => ({
        ...prev,
        error: 'Please generate an auth token before launching the SDK.',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      sdkLoading: true,
      error: null,
    }));

    try {
      // Load SDK if not already loaded
      if (!isSdkLoaded()) {
        await loadSDK(config.sdkVersion);
      }

      setState((prev) => ({
        ...prev,
        sdkLoaded: true,
      }));

      // Prepare inputs
      const inputs = getInputsObject();

      // Create config
      const hyperKycConfig = createHyperKycConfig(
        state.authToken,
        config.showLandingPage,
        Object.keys(inputs).length > 0 ? inputs : undefined,
        config.defaultLangCode,
        config.supportDarkMode,
        config.useLocation
      );

      // Define callback handler
      const handler = (result: HyperKycResult) => {
        setState((prev) => ({
          ...prev,
          sdkStatus: result.status,
          sdkResult: result,
          sdkLoading: false,
        }));
      };

      // Launch SDK
      await launchSDK(hyperKycConfig, handler);
    } catch (error) {
      const errorMessage = mapErrorToMessage(error);
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        sdkLoading: false,
      }));
    }
  }, [state.authToken, config, getInputsObject]);

  // ============ Prefetch ============

  const handlePrefetchWorkflow = useCallback(async () => {
    if (!config.appId || !config.workflowId) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter App ID and Workflow ID to prefetch',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      error: null,
    }));

    try {
      if (!isSdkLoaded()) {
        await loadSDK(config.sdkVersion);
      }

      await prefetchWorkflow(config.appId, config.workflowId);
      setState((prev) => ({
        ...prev,
        sdkStatus: 'Prefetch started',
      }));

      // Clear prefetch status after 3 seconds
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          sdkStatus: null,
        }));
      }, 3000);
    } catch (error) {
      const errorMessage = mapErrorToMessage(error);
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, [config]);

  // ============ Result Clearing ============

  const handleClearResult = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sdkStatus: null,
      sdkResult: null,
      error: null,
    }));
  }, []);

  // ============ Render ============

  return (
    <div className="app">
      <Header
        title="HyperVerge Web SDK Tester"
        description="Test HyperVerge Web SDK workflows by generating an authentication token and launching the configured workflow."
      />

      <div className="main-container">
        <div className="configuration-panel">
          {/* App ID */}
          <div className="section">
            <InputField
              label="App ID"
              value={config.appId}
              onChange={(value) => handleConfigChange('appId', value)}
              required
              placeholder="Enter your HyperVerge App ID"
            />
          </div>

          {/* App Key */}
          <div className="section">
            <label>
              App Key <span className="required">*</span>
            </label>
            <div className="password-input-group">
              <input
                type={showAppKey ? 'text' : 'password'}
                value={config.appKey}
                onChange={(e) => handleConfigChange('appKey', e.target.value)}
                placeholder="Enter your HyperVerge App Key"
              />
              <button
                className="toggle-password"
                onClick={() => setShowAppKey(!showAppKey)}
                title={showAppKey ? 'Hide' : 'Show'}
              >
                {showAppKey ? '✓' : '○'}
              </button>
            </div>
          </div>

          {/* Workflow ID */}
          <div className="section">
            <InputField
              label="Workflow ID"
              value={config.workflowId}
              onChange={(value) => handleConfigChange('workflowId', value)}
              required
              placeholder="Enter your Workflow ID"
            />
          </div>

          {/* Transaction ID */}
          <div className="section">
            <label>
              Transaction ID <span className="required">*</span>
            </label>
            <div className="transaction-id-group">
              <input
                type="text"
                value={config.transactionId}
                onChange={(e) => handleConfigChange('transactionId', e.target.value)}
                placeholder="Enter or generate a Transaction ID"
                readOnly
              />
              <Button
                label="Generate"
                onClick={handleGenerateTransactionId}
                variant="secondary"
                size="small"
              />
            </div>
          </div>

          {/* SDK Version */}
          <div className="section">
            <InputField
              label="SDK Version"
              value={config.sdkVersion}
              onChange={(value) => handleConfigChange('sdkVersion', value)}
              placeholder="e.g., 1.52.0"
            />
          </div>

          {/* Workflow Inputs */}
          <WorkflowInputsSection
            inputs={workflowInputs}
            onAdd={handleAddInput}
            onUpdate={handleUpdateInput}
            onDelete={handleDeleteInput}
          />

          {/* Advanced Configuration */}
          <AdvancedConfig
            isOpen={advancedOpen}
            onToggle={() => setAdvancedOpen(!advancedOpen)}
            showLandingPage={config.showLandingPage}
            setShowLandingPage={(value) => handleConfigChange('showLandingPage', value)}
            defaultLangCode={config.defaultLangCode || ''}
            setDefaultLangCode={(value) => handleConfigChange('defaultLangCode', value || undefined)}
            supportDarkMode={config.supportDarkMode}
            setSupportDarkMode={(value) => handleConfigChange('supportDarkMode', value)}
            useLocation={config.useLocation}
            setUseLocation={(value) => handleConfigChange('useLocation', value)}
          />

          {/* Action Buttons */}
          <div className="section actions">
            <Button
              label={state.tokenLoading ? 'Generating...' : 'Generate Token'}
              onClick={handleGenerateToken}
              disabled={state.tokenLoading}
              variant="primary"
            />
            <Button
              label={state.sdkLoading ? 'Launching...' : 'Launch SDK'}
              onClick={handleLaunchSDK}
              disabled={!state.authToken || state.sdkLoading}
              variant="primary"
            />
            <Button
              label="Prefetch Workflow"
              onClick={handlePrefetchWorkflow}
              variant="secondary"
            />
            <Button
              label={showDebugPanel ? 'Hide Debug' : 'Show Debug'}
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              variant="secondary"
            />
          </div>

          {/* Debug Panel */}
          {showDebugPanel && (
            <DebugPanel
              tokenRequest={{
                appId: config.appId,
                appKey: config.appKey,
                workflowId: config.workflowId,
                transactionId: config.transactionId,
                expiry: config.expiry,
              }}
              sdkConfig={{
                workflowId: config.workflowId,
                transactionId: config.transactionId,
                inputs: getInputsObject(),
                showLandingPage: config.showLandingPage,
              }}
            />
          )}
        </div>

        {/* Result Panel */}
        <ResultPanel
          result={state.sdkResult as HyperKycResult | null}
          error={state.error}
          tokenError={state.tokenError ?? null}
          status={state.sdkStatus}
          transactionId={config.transactionId}
          onClear={handleClearResult}
        />
      </div>
    </div>
  );
};

export default App;
