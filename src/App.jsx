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
    data: { 
      row: [
        { field: 'name', value: 'Alice' },
        { field: 'age', value: '25' },
        { field: 'job', value: 'Engineer' }
      ]
    },
  },
  {
    id: 'node-2',
    type: 'myNode',
    position: { x: 0, y: 0 },
    data: { 
      row: [
        { field: 'name', value: 'Herry' },
        { field: 'age', value: '30' },
        { field: 'job', value: 'PM' }
      ]
    },
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
