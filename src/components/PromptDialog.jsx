import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function PromptDialog({
  open, onClose, busy,
  value, onChange, onSend,
  messages = [], log = [],
  // NEW: 模式切換（從 hook 傳進來）
  mode = 'spec', setMode,
}) {
  const boxRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => taRef.current?.focus(), 0); }, [open]);
  useEffect(() => {
    if (!open) return;
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, log]);

  if (!open) return null;

  const renderMsg = (m, i) => {
    const role = m.role || m.type || 'assistant';
    const isUser = role === 'user';
    const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content ?? m.payload, null, 2);
    return (
      <div key={m.id ?? i} style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', margin: '6px 0' }}>
        <div style={{
          maxWidth: '80%', whiteSpace:'pre-wrap', wordBreak:'break-word',
          background: isUser ? '#111827' : '#fff', color: isUser ? '#fff' : '#000',
          border: '1px solid #e5e7eb', borderRadius: 10, padding: 8, fontSize: 12,
        }}>
          <div style={{ fontSize:10, opacity:.6, marginBottom:4 }}>
            {isUser ? 'you' : (role || 'assistant')}
            {m.created_at ? ` · ${new Date(m.created_at).toLocaleString()}` : ''}
          </div>
          {content}
        </div>
      </div>
    );
  };

  const body = messages.length ? messages.map(renderMsg) : log.map(renderMsg);

  const ModeBtn = ({ val, label }) => (
    <button
      type="button"
      onClick={() => setMode?.(val)}
      style={{
        padding: '4px 8px',
        borderRadius: 8,
        border: mode === val ? '2px solid #111827' : '1px solid #d1d5db',
        background: mode === val ? '#111827' : '#fff',
        color: mode === val ? '#fff' : '#111827',
        fontWeight: 600,
        cursor: 'pointer',
        marginLeft: 6
      }}
    >
      {label}
    </button>
  );

  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.25)', display:'flex', alignItems:'flex-end', justifyContent:'flex-end' }}>
      <div style={{ width:480, maxHeight:'82vh', margin:16, background:'#f9fafb', color:'#000',
                    border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 10px 24px rgba(0,0,0,.15)',
                    display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:10, fontWeight:700, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>SpecGenie Chat</span>
          <div style={{ display:'flex', alignItems:'center' }}>
            {/* NEW: 模式切換放在對話窗右上角 */}
            <ModeBtn val="spec" label="規格模式" />
            <ModeBtn val="advice" label="建議模式" />
            <button onClick={onClose} style={{ border:'none', background:'transparent', fontSize:18, cursor:'pointer', marginLeft:8 }}>✕</button>
          </div>
        </div>

        <div ref={boxRef} style={{ padding:10, flex:1, overflow:'auto' }}>
          {(!messages.length && !log.length) && (
            <div style={{ color:'#666', fontSize:12 }}>
              提示：{mode === 'spec' ? '描述要新增/修改的 API 或資料表…' : '提出設計問題或請教命名建議…'}
            </div>
          )}
          {body}
        </div>

        <div style={{ display:'flex', gap:8, padding:10, borderTop:'1px solid #eee', background:'#fff' }}>
          <textarea
            ref={taRef}
            value={value}
            onChange={(e)=>onChange?.(e.target.value)}
            placeholder={mode === 'spec' ? '輸入需求（Shift+Enter 換行，Enter 送出）' : '輸入要諮詢的問題（Shift+Enter 換行，Enter 送出）'}
            onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSend?.(); } if(e.key==='Escape') onClose?.(); }}
            disabled={busy}
            style={{ flex:1, minHeight:56, maxHeight:140, resize:'vertical', border:'1px solid #e5e7eb', borderRadius:8, padding:8 }}
          />
          <button onClick={onSend} disabled={busy}
            style={{ width:100, border:'none', borderRadius:8, background: busy ? '#6b7280' : '#111827', color:'#fff', cursor:'pointer' }}>
            {busy ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
