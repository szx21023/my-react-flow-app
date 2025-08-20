import { useEffect } from 'react';
import { ReactFlow } from '@xyflow/react';
import {
  useNodesState,
  Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ApiNode from './ApiNode';
import TableNode from './TableNode';

const nodeTypes = {
  apiNode: ApiNode,
  tableNode: TableNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  // ✅ API 載入節點資料
  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/tables')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const formattedNodes = data.map((node, index) => ({
  //       id: node.id?.toString() || `node-${index}`,
  //       type: 'tableNode',
  //       position: node.position || { x: index * 100, y: 100 },
  //       data: {
  //         name: node.name,
  //         description: node.description,
  //         rows: node.columns || [], // 對應 TableNode.jsx 中的 rows
  //       },
  //       }));

  //       setNodes(formattedNodes);
  //     })
  //     .catch((err) => {
  //       console.error('載入節點失敗:', err);
  //     });
  // }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/apis')
      .then((res) => res.json())
      .then((data) => {
        const formattedNodes = data.map((node, index) => ({
        id: node.id?.toString() || `node-${index}`,
        type: 'apiNode',
        position: node.position || { x: index * 100, y: 100 },
        data: {
          method: node.method,
          path: node.path,
          request_fields: node.request_fields || [], // 對應 TableNode.jsx 中的 rows
          response_fields: node.response_fields || [], // 假設有 response_fields
        },
        }));

        setNodes(formattedNodes);
      })
      .catch((err) => {
        console.error('載入節點失敗:', err);
      });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
