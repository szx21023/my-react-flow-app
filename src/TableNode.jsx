import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function TableNode({ data = {} }) {
  const rows = Array.isArray(data.rows)
    ? data.rows
    : Array.isArray(data.row)
    ? data.row
    : [];

  return (
    <div style={styles.container}>
      <Handle type="target" position={Position.Top} />

      <div style={styles.header}>
        <div style={styles.title}>{data.name || 'Untitled Table'}</div>
        {data.description && (
          <div style={styles.description}>
            <strong>Description:</strong> {data.description}
          </div>
        )}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Column</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Nullable</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={styles.td}>{row.name || '-'}</td>
              <td style={styles.td}>{row.type || '-'}</td>
              <td style={styles.td}>
                {row.nullable !== undefined ? String(row.nullable) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ⬇️ 共用樣式抽出來
const styles = {
  container: {
    border: '2px solid red',
    color: '#000',
    borderRadius: '8px',
    backgroundColor: 'darkgray',
    minWidth: '180px',
    textAlign: 'center',
    padding: '6px',
    fontSize: '14px',
  },
  header: {
    marginBottom: '6px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  description: {
    fontSize: '13px',
    marginTop: '2px',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  th: {
    border: '1px solid black',
    padding: '4px',
    backgroundColor: 'gray',
    textTransform: 'capitalize',
  },
  td: {
    border: '1px solid black',
    padding: '4px',
    wordBreak: 'break-word',
  },
};
