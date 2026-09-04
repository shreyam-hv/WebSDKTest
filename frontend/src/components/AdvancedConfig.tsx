import React from 'react';
import { CheckboxField, InputField } from './FormFields';

interface AdvancedConfigProps {
  isOpen: boolean;
  onToggle: () => void;
  showLandingPage: boolean;
  setShowLandingPage: (value: boolean) => void;
  defaultLangCode: string;
  setDefaultLangCode: (value: string) => void;
  supportDarkMode: boolean;
  setSupportDarkMode: (value: boolean) => void;
  useLocation: boolean;
  setUseLocation: (value: boolean) => void;
}

export const AdvancedConfig: React.FC<AdvancedConfigProps> = ({
  isOpen,
  onToggle,
  showLandingPage,
  setShowLandingPage,
  defaultLangCode,
  setDefaultLangCode,
  supportDarkMode,
  setSupportDarkMode,
  useLocation,
  setUseLocation,
}) => {
  return (
    <div className="section collapsible">
      <h3 onClick={onToggle} className="collapsible-header">
        <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
        Advanced Configuration
      </h3>
      {isOpen && (
        <div className="collapsible-content">
          <CheckboxField
            label="Show landing page"
            checked={showLandingPage}
            onChange={setShowLandingPage}
          />
          <InputField
            label="Default Language Code"
            value={defaultLangCode}
            onChange={setDefaultLangCode}
            placeholder="e.g., en"
          />
          <CheckboxField
            label="Support dark mode"
            checked={supportDarkMode}
            onChange={setSupportDarkMode}
          />
          <CheckboxField
            label="Request location permission"
            checked={useLocation}
            onChange={setUseLocation}
          />
        </div>
      )}
    </div>
  );
};
