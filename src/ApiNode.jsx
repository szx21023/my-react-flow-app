// src/nodes/ApiNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ApiNode({ data }) {
  return (
    <div style={{
      background: '#fff',
      color: '#000',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 8,
      minWidth: 200,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>
        {data.method} {data.path}
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        req: {data.request?.join(', ') || '—'}
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        res: {data.response?.join(', ') || '—'}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
