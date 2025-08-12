import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MyNode({ data }) {
  return (
    <div
      style={{
        border: '2px solid red',   // ✅ 顯示邊界
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: 'white',
        minWidth: '120px',
        textAlign: 'center',
      }}
    >
      <div>{data.name}</div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
