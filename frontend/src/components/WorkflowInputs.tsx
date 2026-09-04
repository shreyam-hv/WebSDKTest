import React from 'react';
import { InputField, Button } from './FormFields';
import { WorkflowInput } from '../types/index';

interface WorkflowInputsProps {
  inputs: WorkflowInput[];
  onAdd: () => void;
  onUpdate: (index: number, key: string, value: string) => void;
  onDelete: (index: number) => void;
}

export const WorkflowInputsSection: React.FC<WorkflowInputsProps> = ({
  inputs,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="section">
      <h3>Workflow Inputs</h3>
      <div className="workflow-inputs-list">
        {inputs.length === 0 ? (
          <p className="empty-state">No workflow inputs configured</p>
        ) : (
          inputs.map((input, index) => (
            <div key={index} className="workflow-input-row">
              <input
                type="text"
                placeholder="Key"
                value={input.key}
                onChange={(e) => onUpdate(index, e.target.value, input.value)}
                className="input-key"
              />
              <input
                type="text"
                placeholder="Value"
                value={input.value}
                onChange={(e) => onUpdate(index, input.key, e.target.value)}
                className="input-value"
              />
              <button
                onClick={() => onDelete(index)}
                className="btn-delete-input"
                title="Delete input"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      <Button label="+ Add Input" onClick={onAdd} variant="secondary" size="small" />
    </div>
  );
};
