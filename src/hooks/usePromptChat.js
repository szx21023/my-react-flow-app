import { useCallback, useEffect, useState } from 'react';

export function usePromptChat({ base = 'http://127.0.0.1:8000', onApplied } = {}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [log, setLog] = useState([]);
  const [messages, setMessages] = useState([]);

  const normalizeMessage = (p) => ({
    id: p.id,
    role: 'user',
    content: typeof p.prompt === 'string' ? { text: p.prompt } : p.content ?? { text: '' },
    created_at: p.created_at,
  });

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${base}/prompt?limit=50`);
      const arr = await res.json();
      const msgs = Array.isArray(arr)
        ? arr.map(normalizeMessage).reverse()
        : [];
      setMessages(msgs);
    } catch (e) {
      console.warn('❌ Failed to fetch prompt history:', e);
    }
  }, [base]);

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
      {
        id: tempId,
        role: 'user',
        content: { text: content },
        created_at: createdAt,
      },
    ]);

    try {
      const res = await fetch(`${base}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
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

      await onApplied?.();
    } catch (e) {
      console.error('❌ Prompt failed:', e);
      setLog((prev) => [...prev, { type: 'error', payload: `❌ 失敗：${e.message || e}` }]);
    } finally {
      setBusy(false);
    }
  }, [text, base, fetchHistory, onApplied]);

  return {
    open,
    busy,
    text,
    log,
    messages,
    openDialog: () => setOpen(true),
    dialogProps: {
      open,
      onClose: () => setOpen(false),
      busy,
      value: text,
      onChange: setText,
      messages,
      log,
      onSend: send,
    },
  };
}
