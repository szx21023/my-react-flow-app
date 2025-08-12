import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MyNode({ data }) {
  console.log(data);
  const rows = Array.isArray(data?.rows) ? data.rows
             : Array.isArray(data?.row)  ? data.row
             : [];
  return (
    <div
      style={{
        border: '2px solid red',   // ✅ 顯示邊界
        borderRadius: '8px',
        backgroundColor: 'white',
        minWidth: '150px',
        textAlign: 'center',
        padding: '4px'
      }}
    >
      <Handle type="target" position={Position.Top} />

      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>欄位</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>值</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {row.field}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
