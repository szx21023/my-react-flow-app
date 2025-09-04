import { useCallback, useEffect, useState, useMemo } from 'react';

export function usePromptChat({ base = 'http://127.0.0.1:8000', onApplied, defaultMode = 'spec' } = {}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [log, setLog] = useState([]);
  const [messages, setMessages] = useState([]);

  // NEW: 規格/建議 模式
  const [mode, setMode] = useState(defaultMode); // 'spec' | 'advice'

  const normalizeMessage = (p) => ({
    id: p.id,
    role: p.role,
    content: typeof p.prompt === 'string' ? { text: p.prompt } : p.content ?? { text: '' },
    created_at: p.created_at,
  });

  const fetchHistory = useCallback(async () => {
    try {
      // 若後端支援依 mode 過濾，可改用：
      // const res = await fetch(`${base}/prompt?limit=50&mode=${mode}`);
      const res = await fetch(`${base}/prompt?limit=50`);
      const arr = await res.json();
      const msgs = Array.isArray(arr) ? arr.map(normalizeMessage).reverse() : [];
      setMessages(msgs);
    } catch (e) {
      console.warn('❌ Failed to fetch prompt history:', e);
    }
  }, [base /*, mode*/]); // 如果上面有帶 mode 查詢，這裡也加入 mode 依賴

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  const send = useCallback(async () => {
    const content = text.trim();
    if (!content) return;

    setBusy(true);
    setText('');

    const tempId = `temp-${Date.now()}`;
    const createdAt = new Date().toISOString();

    // Optimistic user message
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: 'user', content: { text: content }, created_at: createdAt },
    ]);

    try {
      const res = await fetch(`${base}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // NEW: 一併帶上 mode
        body: JSON.stringify({ prompt: content, mode }),
      });

      const result = await res.json().catch(() => ({}));

      // 如果後端有回覆 assistant，可直接加入
      if (result?.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: { text: result.response },
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        // 若沒即時 response，重新 fetch 確保一致性
        await fetchHistory();
      }

      // 規格模式通常會影響 IR，送出後重載畫布
      if (mode === 'spec') {
        await onApplied?.();
      }
    } catch (e) {
      console.error('❌ Prompt failed:', e);
      setLog((prev) => [...prev, { type: 'error', payload: `❌ 失敗：${e.message || e}` }]);
    } finally {
      setBusy(false);
    }
  }, [text, base, fetchHistory, onApplied, mode]);

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  // 提供給 PromptDialog 的 props（含 mode 與 setter）
  const dialogProps = useMemo(() => ({
    open,
    onClose: closeDialog,
    busy,
    value: text,
    onChange: setText,
    messages,
    log,
    onSend: send,
    mode,          // NEW
    setMode,       // NEW
  }), [open, closeDialog, busy, text, messages, log, send, mode]);

  return {
    open,
    busy,
    text,
    log,
    messages,
    mode,          // 若外層也想讀取目前模式
    setMode,       // 若外層想預設/切換
    openDialog,
    dialogProps,
  };
}
