import React, { useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode from './TableNode';
import ApiNode from './ApiNode';
import { irToFlow } from './irToFlow';

const nodeTypes = { table: TableNode, api: ApiNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/ir')
      .then(r => r.json())
      .then(ir => {
        const { nodes, edges } = irToFlow(ir);
        setNodes(nodes);
        setEdges(edges);
      })
      .catch(err => console.error('載入 IR 失敗', err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls showInteractive />
        <MiniMap
          zoomable pannable
          nodeColor={(n) => (n.type === 'api' ? '#a7f3d0' : '#bfdbfe')}
          nodeStrokeWidth={2}
          style={{ width: 180, height: 120 }}
        />
      </ReactFlow>
    </div>
  );
}
