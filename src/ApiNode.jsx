import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ApiNode({ data }) {
  const request_fields = Array.isArray(data?.request_fields) ? data.request_fields
                       : Array.isArray(data?.request_field)  ? data.request_field
                       : [];
  const response_fields = Array.isArray(data?.response_fields) ? data.response_fields
                        : Array.isArray(data?.response_field)  ? data.response_field
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
        <b>path:</b> {data.path}
      </div>
      <div>
        {data.method}
      </div>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px', backgroundColor: 'gray' }}>request_fields</th>
          </tr>
        </thead>
        <tbody>
          {request_fields?.map((request_field, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {request_field}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px', backgroundColor: 'gray' }}>response_fields</th>
          </tr>
        </thead>
        <tbody>
          {response_fields?.map((response_field, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {response_field}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
