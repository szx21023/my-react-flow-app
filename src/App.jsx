import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNodesState } from '@xyflow/react';
import MyNode from './MyNode';

const nodeTypes = {
  myNode: MyNode,
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'myNode',
    position: { x: 0, y: 0 },
    data: { name: 'test' },
  },
  {
    id: 'node-2',
    type: 'myNode',
    position: { x: 0, y: 100 },
    data: { name: 'test2' },
  },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes} // ✅ 用這個 state
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
