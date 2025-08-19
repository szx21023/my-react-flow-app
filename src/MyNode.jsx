import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function MyNode({ data }) {
  const rows = Array.isArray(data?.rows) ? data.rows
             : Array.isArray(data?.row)  ? data.row
             : [];
  return (
    <div
      style={{
        border: '2px solid red',   // ✅ 顯示邊界
        color: '#000',
        borderRadius: '8px',
        backgroundColor: 'darkgray',
        minWidth: '150px',
        textAlign: 'center',
        padding: '4px'
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>
        {data.name}
      </div>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px', backgroundColor: 'gray' }}>column</th>
            <th style={{ border: '1px solid black', padding: '4px', backgroundColor: 'gray' }}>type</th>
            <th style={{ border: '1px solid black', padding: '4px', backgroundColor: 'gray' }}>nullable</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {row.name}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {row.type}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {String(row.nullable)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
