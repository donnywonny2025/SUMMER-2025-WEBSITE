import React from 'react';

interface LuckyRabbitEmbedProps {
  className?: string;
}

const LuckyRabbitEmbed: React.FC<LuckyRabbitEmbedProps> = ({ className = '' }) => {
  return (
    <div className={`lucky-rabbit-embed ${className}`} style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <h1>Lucky Rabbit Website</h1>
      <p>The Lucky Rabbit website is currently experiencing display issues in the embedded view.</p>
      <a 
        href="http://localhost:8002/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          margin: '20px 0',
          padding: '10px 20px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Open Lucky Rabbit Website
      </a>
    </div>
  );
};

export default LuckyRabbitEmbed;