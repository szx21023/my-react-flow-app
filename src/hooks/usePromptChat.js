import { useCallback, useEffect, useState } from 'react';

/**
 * base: 'http://127.0.0.1:8000'（注意：你的後端沒有 /api 前綴）
 */
export function usePromptChat({ base = 'http://127.0.0.1:8000', onApplied } = {}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [log, setLog] = useState([]);
  const [messages, setMessages] = useState([]); // <-- 新增：歷史 prompts

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${base}/prompt?limit=50`);
      const arr = await res.json();
      // 後端回來是 [{id, prompt, created_at, ...}] 之類，轉成對話窗可用格式
      const msgs = Array.isArray(arr)
        ? arr
            .map(p => ({
              id: p.id,
              role: 'user',
              content: { text: p.prompt ?? p.content ?? '' },
              created_at: p.created_at,
            }))
            .reverse() // 舊的在上、新的在下
        : [];
      setMessages(msgs);
    } catch (e) {
      // 失敗不擋畫面
    }
  }, [base]);

  useEffect(() => { if (open) fetchHistory(); }, [open, fetchHistory]);

  const send = useCallback(async () => {
    const content = text.trim();
    if (!content) return;
    setBusy(true);
    // 樂觀加入使用者輸入
    const tempId = `temp-${Date.now()}`;
    setMessages(m => [...m, { id: tempId, role: 'user', content: { text: content }, created_at: new Date().toISOString() }]);
    setText('');
    try {
      const res = await fetch(`${base}/prompt`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      });
      await res.json().catch(() => ({}));
      // 重新拉歷史，確保剛剛那筆有正式 ID
      await fetchHistory();
      await onApplied?.(); // 你的畫布會重新抓 /ir
    } catch (e) {
      setLog(s => [...s, { type: 'error', payload: `❌ 失敗：${e.message || e}` }]);
    } finally {
      setBusy(false);
    }
  }, [text, base, fetchHistory, onApplied]);

  return {
    open, busy, text, log, messages,
    openDialog: () => setOpen(true),
    dialogProps: {
      open, onClose: () => setOpen(false),
      busy, value: text, onChange: setText,
      messages, log,            // <-- 傳給對話窗渲染
      onSend: send,
    },
  };
}
