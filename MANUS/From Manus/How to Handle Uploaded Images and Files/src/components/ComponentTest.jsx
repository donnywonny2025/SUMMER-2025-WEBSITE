import React from 'react';
import { SafeWrapper } from './SafeWrapper';
import { AnimatedCounter } from '../../components/motion-primitives/animated-counter';
import { DigitalClock } from '../../components/motion-primitives/digital-clock';

export function ComponentTest() {
  const [isVisible, setIsVisible] = React.useState(true);

  // Only visible in development
  if (process.env.NODE_ENV !== 'development') return null;

  // Toggle visibility with keyboard shortcut
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: '#00ff88',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: 'pointer',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}
        onClick={() => setIsVisible(true)}
        title="Click to show test lab (Ctrl+T)"
      >
        🧪
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.95)',
      padding: '12px',
      borderRadius: '6px',
      zIndex: 9999,
      maxWidth: '280px',
      fontSize: '12px',
      color: 'white',
      fontFamily: 'monospace',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <div style={{ margin: '0 0 8px 0', color: '#00ff88', fontSize: '11px', fontWeight: 'bold' }}>
        🧪 Test Lab
      </div>

      {/* AnimatedCounter Test */}
      <div style={{ border: '1px solid #333', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
        <SafeWrapper
          componentName="AnimatedCounter"
          fallback={<div style={{ color: '#ff6b6b' }}>Counter failed</div>}
        >
          <div style={{ marginBottom: '5px' }}>
            <strong>AnimatedCounter Test:</strong>
          </div>
          <AnimatedCounter
            from={0}
            to={42}
            duration={3}
            className="text-green-400 font-bold text-lg"
          />
        </SafeWrapper>
      </div>

      {/* DigitalClock Test */}
      <div style={{ marginBottom: '8px' }}>
        <SafeWrapper
          componentName="DigitalClock"
          fallback={<div style={{ color: '#ff6b6b', fontSize: '10px' }}>Clock failed</div>}
        >
          <DigitalClock showSeconds={true} />
        </SafeWrapper>
      </div>

      <div style={{
        fontSize: '10px',
        color: '#666',
        marginTop: '6px',
        textAlign: 'center'
      }}>
        F12 for console • Safe testing active
      </div>
    </div>
  );
}