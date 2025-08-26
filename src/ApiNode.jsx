import React, { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';

const palette = (m = '') => {
  switch (m.toUpperCase()) {
    case 'GET':     return { bg: '#dcfce7', border: '#16a34a', text: '#14532d', pill: '#22c55e' }; // 綠
    case 'POST':    return { bg: '#dbeafe', border: '#1d4ed8', text: '#1e3a8a', pill: '#3b82f6' }; // 藍
    case 'PUT':
    case 'PATCH':   return { bg: '#ffedd5', border: '#ea580c', text: '#7c2d12', pill: '#fb923c' }; // 橘
    case 'DELETE':  return { bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d', pill: '#ef4444' }; // 紅
    default:        return { bg: '#f3f4f6', border: '#9ca3af', text: '#111827', pill: '#6b7280' }; // 灰
  }
};

export default function ApiNode({ data }) {
  const method = String(data?.method || '').toUpperCase();
  const { bg, border, text, pill } = useMemo(() => palette(method), [method]);

  const req = data?.request ?? data?.request_fields ?? [];
  const res = data?.response ?? data?.response_fields ?? [];

  return (
    <div style={{
      background: bg, color: text, border: `2px solid ${border}`,
      borderRadius: 10, padding: 10, minWidth: 220,
      boxShadow: '0 2px 6px rgba(0,0,0,.06)'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
        <span style={{
          fontSize:12, fontWeight:700, color:'#fff', background:pill,
          borderRadius:6, padding:'2px 8px', letterSpacing:.5
        }}>
          {method || 'API'}
        </span>
        <div title={data?.path} style={{ fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {data?.path}
        </div>
      </div>

      <div style={{ fontSize:12, opacity:.9 }}>
        req: {Array.isArray(req) && req.length ? req.join(', ') : '—'}
      </div>
      <div style={{ fontSize:12, opacity:.9 }}>
        res: {Array.isArray(res) && res.length ? res.join(', ') : '—'}
      </div>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
