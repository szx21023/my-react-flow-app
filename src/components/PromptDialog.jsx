import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function PromptDialog({
  open,
  onClose,
  busy,
  value,
  onChange,
  log = [],
  onSend,       // Generate + Apply
  onGenerate,   // optional: only Generate
  onApply,      // optional: only Apply (uses lastPatch)
}) {
  const taRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => taRef.current?.focus(), 0); }, [open]);

  if (!open) return null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.25)', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'flex-end'
    }}>
      <div style={{
        width: 420, maxHeight: '80vh', margin: 16,
        background: '#fff', color: '#000', border: '1px solid #e5e7eb',
        borderRadius: 12, boxShadow: '0 10px 24px rgba(0,0,0,.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: 10, fontWeight: 700, borderBottom: '1px solid #eee',
                      display:'flex', justifyContent:'space-between' }}>
          <span>SpecGenie Prompt</span>
          <button onClick={onClose} style={{ border:'none', background:'transparent',
                  fontSize:18, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ padding: 10, flex: 1, overflow: 'auto', background: '#fafafa' }}>
          {log.length === 0 && (
            <div style={{ color:'#666', fontSize:12 }}>
              輸入需求，例如：「把 users.full_name 改名為 name，email 設為可為 null」
            </div>
          )}
          {log.map((item, i) => (
            <pre key={i} style={{
              whiteSpace:'pre-wrap', wordBreak:'break-word',
              background:'#fff', border:'1px solid #eee',
              borderRadius:8, padding:8, fontSize:12, marginBottom:8
            }}>
              {typeof item.payload === 'string'
                ? item.payload
                : JSON.stringify(item.payload, null, 2)}
            </pre>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, padding:10, borderTop:'1px solid #eee', background:'#fff' }}>
          <textarea
            ref={taRef}
            value={value}
            onChange={(e)=>onChange?.(e.target.value)}
            placeholder="輸入需求（Shift+Enter 換行，Enter 送出）"
            onKeyDown={(e)=>{
              if (e.key==='Enter' && !e.shiftKey && onSend) { e.preventDefault(); onSend(); }
              if (e.key==='Escape') onClose?.();
            }}
            disabled={busy}
            style={{ flex:1, minHeight:56, maxHeight:140, resize:'vertical',
                     border:'1px solid #e5e7eb', borderRadius:8, padding:8 }}
          />
          {/* 你可以只保留 Send；或三顆都留 */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {onGenerate && (
              <button onClick={onGenerate} disabled={busy}
                style={{ width:90, border:'none', borderRadius:8,
                         background:'#6b7280', color:'#fff', cursor:'pointer' }}>
                Gen
              </button>
            )}
            {onApply && (
              <button onClick={onApply} disabled={busy}
                style={{ width:90, border:'none', borderRadius:8,
                         background:'#10b981', color:'#fff', cursor:'pointer' }}>
                Apply
              </button>
            )}
            {onSend && (
              <button onClick={onSend} disabled={busy}
                style={{ width:90, border:'none', borderRadius:8,
                         background:'#111827', color:'#fff', cursor:'pointer' }}>
                {busy ? '…' : 'Send'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
