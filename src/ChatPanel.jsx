// src/components/ChatPanel.jsx
import React, { useRef, useState } from 'react';

export default function ChatPanel({ open, onClose, onSubmit, messages = [], busy = false }) {
  const [text, setText] = useState('');
  const boxRef = useRef(null);

  if (!open) return null;

  const send = async () => {
    const v = text.trim();
    if (!v || busy) return;
    setText('');
    await onSubmit(v);
    // 滾到底
    setTimeout(() => {
      if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }, 0);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-panel">
        <div className="chat-header">
          <div>SpecGenie Chat</div>
          <button className="chat-close" onClick={onClose}>✕</button>
        </div>

        <div className="chat-body" ref={boxRef}>
          {messages.length === 0 && (
            <div className="chat-empty">輸入需求，例如：「把 users.full_name 改名為 name，email 設為可為 null」</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {typeof m.content === 'string'
                ? <pre className="chat-pre">{m.content}</pre>
                : <pre className="chat-pre">{JSON.stringify(m.content, null, 2)}</pre>}
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="輸入需求（Shift+Enter 換行，Enter 送出）"
            disabled={busy}
          />
          <button className="chat-send" onClick={send} disabled={busy}>
            {busy ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
