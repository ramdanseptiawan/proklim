// Reusable form control components to keep App.jsx DRY

import React from 'react';

// Text input field
export function Field({ label, name, value, onChange, type = 'text', placeholder = '', fullWidth = false }) {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>{label}</label>
      <input type={type} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

// Number input field
export function NumberField({ label, name, value, onChange, placeholder = '', fullWidth = false, suffix = '' }) {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>{suffix ? `${label} (${suffix})` : label}</label>
      <input type="number" name={name} value={value ?? ''} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

// Select dropdown field
export function SelectField({ label, name, value, onChange, options, fullWidth = false, placeholder = '-- Pilih --' }) {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>{label}</label>
      <select name={name} value={value || ''} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// Textarea field
export function TextareaField({ label, name, value, onChange, placeholder = '', fullWidth = true, rows = 2 }) {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>{label}</label>
      <textarea name={name} value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows} />
    </div>
  );
}

// Section sub-heading
export function SubHeading({ children }) {
  return <h3 className="form-subheading">{children}</h3>;
}

// Reusable labeled row (for table-like inputs: label + value + optional suffix)
export function LabeledRow({ label, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

// A sub-group of two fields on one row (e.g., dropdown + percentage)
export function FieldPair({ children }) {
  return <div className="field-pair">{children}</div>;
}