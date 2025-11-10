import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// 單一訊息區塊
function MessageBubble({ message, isUser }) {
  const { role = 'assistant', created_at, content, payload } = message;
  const text =
    typeof content === 'string'
      ? content
      : JSON.stringify(content ?? payload, null, 2);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        margin: '6px 0',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: '#111827',
          color: '#fff',
          borderRadius: 10,
          padding: 8,
          fontSize: 12,
        }}
      >
        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>
          {isUser ? 'you' : role}
          {created_at ? ` · ${new Date(created_at).toLocaleString()}` : ''}
        </div>
        {text}
      </div>
    </div>
  );
}

// 模式切換按鈕
function ModeButton({ value, label, mode, setMode }) {
  const active = mode === value;
  return (
    <button
      type="button"
      onClick={() => setMode?.(value)}
      style={{
        padding: '4px 8px',
        borderRadius: 8,
        border: active ? '2px solid #111827' : '1px solid #d1d5db',
        background: active ? '#111827' : '#fff',
        color: active ? '#fff' : '#111827',
        fontWeight: 600,
        cursor: 'pointer',
        marginLeft: 6,
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

export default function PromptDialog({
  open,
  onClose,
  busy,
  value,
  onChange,
  onSend,
  messages = [],
  log = [],
  mode = 'spec',
  setMode,
}) {
  const boxRef = useRef(null);
  const taRef = useRef(null);
  const endRef = useRef(null);

  // 開啟時自動聚焦輸入框
  useEffect(() => {
    if (open) setTimeout(() => taRef.current?.focus(), 0);
  }, [open]);

  // 新訊息出現時自動滾動到底
  useEffect(() => {
    if (!open || !endRef.current) return;
    endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [open, messages, log]);

  if (!open) return null;

  const data = messages.length ? messages : log;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: 480,
          maxHeight: '82vh',
          margin: 16,
          background: '#f9fafb',
          color: '#000',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          boxShadow: '0 10px 24px rgba(0,0,0,.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 10,
            fontWeight: 700,
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>SpecGenie Chat</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ModeButton value="spec" label="規格模式" mode={mode} setMode={setMode} />
            <ModeButton value="advice" label="建議模式" mode={mode} setMode={setMode} />
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 18,
                cursor: 'pointer',
                marginLeft: 8,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* 訊息區 */}
        <div
          ref={boxRef}
          style={{ padding: 10, flex: 1, overflow: 'auto' }}
        >
          {!data.length && (
            <div style={{ color: '#666', fontSize: 12 }}>
              提示：
              {mode === 'spec'
                ? '描述要新增/修改的 API 或資料表…'
                : '提出設計問題或請教命名建議…'}
            </div>
          )}
          {data.map((m, i) => (
            <MessageBubble
              key={m.id ?? i}
              message={m}
              isUser={(m.role || m.type) === 'user'}
            />
          ))}
          <div ref={endRef} />
        </div>

        {/* 輸入區 */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: 10,
            borderTop: '1px solid #eee',
            background: '#fff',
          }}
        >
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={
              mode === 'spec'
                ? '輸入需求（Shift+Enter 換行，Enter 送出）'
                : '輸入要諮詢的問題（Shift+Enter 換行，Enter 送出）'
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend?.();
              }
              if (e.key === 'Escape') onClose?.();
            }}
            disabled={busy}
            style={{
              flex: 1,
              minHeight: 56,
              maxHeight: 140,
              resize: 'vertical',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 8,
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={onSend}
            disabled={busy}
            style={{
              width: 100,
              border: 'none',
              borderRadius: 8,
              background: busy ? '#6b7280' : '#111827',
              color: '#fff',
              cursor: busy ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {busy ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
