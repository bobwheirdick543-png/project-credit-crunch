import * as React from 'react';

export const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => (
  <input ref={ref} className={`glass-input ${className}`.trim()} {...props} />
));
GlassInput.displayName = 'GlassInput';
