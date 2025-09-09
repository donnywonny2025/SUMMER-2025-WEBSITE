import React from 'react';

export function SafeWrapper({
  children,
  fallback = null,
  onError = null,
  componentName = 'Unknown'
}) {
  try {
    return children;
  } catch (error) {
    console.error(`SafeWrapper: ${componentName} failed:`, error);
    onError?.(error);
    return fallback;
  }
}