// src/hooks/usePromptChat.js
import { useCallback, useState } from 'react';

export function usePromptChat({ base = 'http://127.0.0.1:8000', onApplied } = {}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [log, setLog] = useState([]);

  const send = useCallback(async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${base}/prompt`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: text }), // ⬅️ 後端 Body 需求
      });

      let out = null;
      try { out = await res.json(); } catch { /* 可能是 204 無內容 */ }

      setLog(s => [...s, { type: 'server', payload: out ?? '(no body)' }]);
      setText('');
      await onApplied?.();  // 重新載入 /ir
    } catch (e) {
      setLog(s => [...s, { type: 'error', payload: `❌ 失敗：${e.message || e}` }]);
    } finally {
      setBusy(false);
    }
  }, [text, base, onApplied]);

  return {
    open, busy, text, log,
    openDialog: () => setOpen(true),
    dialogProps: {
      open, onClose: () => setOpen(false),
      busy, value: text, onChange: setText,
      log, onSend: send,
    },
  };
}
