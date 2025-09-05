import React, { useMemo, memo } from 'react';
import { Handle, Position } from '@xyflow/react';

/** 固定色票：改成字典查表，少掉每次 render 的 switch/case 開銷 */
const PALETTE = {
  GET:     { bg: '#dcfce7', border: '#16a34a', text: '#14532d', pill: '#22c55e' }, // 綠
  POST:    { bg: '#dbeafe', border: '#1d4ed8', text: '#1e3a8a', pill: '#3b82f6' }, // 藍
  PUT:     { bg: '#ffedd5', border: '#ea580c', text: '#7c2d12', pill: '#fb923c' }, // 橘
  PATCH:   { bg: '#ffedd5', border: '#ea580c', text: '#7c2d12', pill: '#fb923c' }, // 橘
  DELETE:  { bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d', pill: '#ef4444' }, // 紅
  DEFAULT: { bg: '#f3f4f6', border: '#9ca3af', text: '#111827', pill: '#6b7280' }  // 灰
};

function ApiNode({ data }) {
  // ---- 資料正規化（避免每次 render 分支判斷） ----
  const methodRaw = (data?.method ?? '').toString();
  const method = methodRaw.toUpperCase();
  const path = typeof data?.path === 'string' ? data.path : '';

  const reqArr = Array.isArray(data?.request)
    ? data.request
    : Array.isArray(data?.request_fields)
      ? data.request_fields
      : [];

  const resArr = Array.isArray(data?.response)
    ? data.response
    : Array.isArray(data?.response_fields)
      ? data.response_fields
      : [];

  // ---- 色票與樣式物件 memo 化（減少行內物件重建）----
  const colors = useMemo(() => PALETTE[method] ?? PALETTE.DEFAULT, [method]);

  const containerStyle = useMemo(() => ({
    background: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: 10,
    padding: 10,
    minWidth: 220,
    boxShadow: '0 2px 6px rgba(0,0,0,.06)'
  }), [colors]);

  const badgeStyle = useMemo(() => ({
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    background: colors.pill,
    borderRadius: 6,
    padding: '2px 8px',
    letterSpacing: .5
  }), [colors]);

  const titleStyle = useMemo(() => ({
    fontWeight: 700,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }), []);

  const metaTextStyle = useMemo(() => ({
    fontSize: 12,
    opacity: .9
  }), []);

  // ---- 文本拼接 memo 化（大量節點時降低字串重組成本）----
  const reqText = useMemo(() => {
    if (!Array.isArray(reqArr) || reqArr.length === 0) return '—';
    return reqArr.map(String).join(', ');
  }, [reqArr]);

  const resText = useMemo(() => {
    if (!Array.isArray(resArr) || resArr.length === 0) return '—';
    return resArr.map(String).join(', ');
  }, [resArr]);

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={badgeStyle}>{method || 'API'}</span>
        <div title={path} style={titleStyle}>{path}</div>
      </div>

      <div style={metaTextStyle}>req: {reqText}</div>
      <div style={metaTextStyle}>res: {resText}</div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

/** 不改行為、避免不必要重渲染 */
export default memo(ApiNode);
