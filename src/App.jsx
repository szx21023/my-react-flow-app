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
    fetch('http://127.0.0.1:8000/ir')
      .then((res) => res.json())
      .then((data) => {
        // 假設後端傳來的是符合 xyflow 格式的 nodes 陣列
        setNodes(data);
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
