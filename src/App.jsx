import { useEffect } from 'react';
import { ReactFlow } from '@xyflow/react';
import {
  useNodesState,
  Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MyNode from './MyNode';

const nodeTypes = {
  myNode: MyNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  // ✅ API 載入節點資料
  useEffect(() => {
    fetch('http://127.0.0.1:8000/tables')
      .then((res) => res.json())
      .then((data) => {
        const formattedNodes = data.map((node, index) => ({
        id: node.id?.toString() || `node-${index}`,
        type: 'myNode',
        position: node.position || { x: index * 100, y: 100 },
        data: {
          name: node.name,
          description: node.description,
          rows: node.columns || [], // 對應 MyNode.jsx 中的 rows
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
