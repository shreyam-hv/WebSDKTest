import SDK_VERSION from '../config/sdk-version';

interface HyperKycConfig {
  setInputs: (inputs: Record<string, string>) => void;
  setDefaultLangCode: (code: string) => void;
  supportDarkMode: (enabled: boolean) => void;
  setUseLocation: (enabled: boolean) => void;
}

interface HyperKycResult {
  status: string;
  code?: string;
  message?: string;
  details?: unknown;
  transactionId?: string;
  workflowId?: string;
}

interface HyperKYCModule {
  launch: (config: any, handler: (result: HyperKycResult) => void) => Promise<void>;
  prefetch: (appId: string, workflowId: string) => Promise<void>;
}

declare global {
  interface Window {
    HyperKycConfig?: new (token: string, showLandingPage: boolean) => HyperKycConfig;
    HyperKYCModule?: HyperKYCModule;
  }
}

let sdkScriptLoaded = false;
let sdkLoading = false;
let sdkLoadPromise: Promise<void> | null = null;

export async function loadSDK(version: string = SDK_VERSION): Promise<void> {
  // If already loaded, return
  if (sdkScriptLoaded && window.HyperKYCModule && window.HyperKycConfig) {
    return;
  }

  // If already loading, return the existing promise
  if (sdkLoading && sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoading = true;

  sdkLoadPromise = new Promise((resolve, reject) => {
    // Check if the script is already in the DOM (different version)
    const existingScript = document.querySelector(
      `script[src*="hyperverge-web-sdk"]`
    );
    
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://hv-web-sdk-cdn.hyperverge.co/hyperverge-web-sdk@${version}/src/sdk.min.js`;
    script.async = true;
    script.onload = () => {
      sdkScriptLoaded = true;
      sdkLoading = false;
      resolve();
    };
    script.onerror = () => {
      sdkLoading = false;
      reject(new Error(`Failed to load HyperVerge Web SDK version ${version}`));
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

export function createHyperKycConfig(
  authToken: string,
  showLandingPage: boolean,
  inputs?: Record<string, string>,
  defaultLangCode?: string,
  supportDarkMode?: boolean,
  useLocation?: boolean
): HyperKycConfig {
  if (!window.HyperKycConfig) {
    throw new Error('HyperKycConfig is not available. Ensure SDK is loaded.');
  }

  const hyperKycConfig = new window.HyperKycConfig(authToken, showLandingPage);

  // Apply optional configurations
  if (defaultLangCode) {
    hyperKycConfig.setDefaultLangCode(defaultLangCode);
  }

  if (supportDarkMode) {
    hyperKycConfig.supportDarkMode(true);
  }

  if (useLocation) {
    hyperKycConfig.setUseLocation(true);
  }

  // Set inputs if provided
  if (inputs && Object.keys(inputs).length > 0) {
    hyperKycConfig.setInputs(inputs);
  }

  return hyperKycConfig;
}

export async function launchSDK(
  config: HyperKycConfig,
  handler: (result: HyperKycResult) => void
): Promise<void> {
  if (!window.HyperKYCModule) {
    throw new Error('HyperKYCModule is not available. Ensure SDK is loaded.');
  }

  await window.HyperKYCModule.launch(config, handler);
}

export async function prefetchWorkflow(
  appId: string,
  workflowId: string
): Promise<void> {
  if (!window.HyperKYCModule) {
    throw new Error('HyperKYCModule is not available. Ensure SDK is loaded.');
  }

  await window.HyperKYCModule.prefetch(appId, workflowId);
}

export function isSdkLoaded(): boolean {
  return sdkScriptLoaded && !!window.HyperKYCModule && !!window.HyperKycConfig;
}
