import React, { useState } from 'react';

export default function SpecPage() {
  const [content, setContent] = useState('');

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 24px)',
      background: '#fff',
      borderRadius: 12,
      overflowY: 'auto',
    }}>
      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在這裡撰寫系統規格..."
          style={{
            width: '100%',
            minHeight: 'calc(100vh - 180px)',
            background: 'transparent',
            color: '#37352f',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 16,
            lineHeight: 1.8,
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
