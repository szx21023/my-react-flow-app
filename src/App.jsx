import React, { useEffect, useRef, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, Panel,
  useNodesState, useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode from './TableNode';
import ApiNode from './ApiNode';
import { irToFlow } from './irToFlow';
import PromptDialog from './components/PromptDialog';
import { usePromptChat } from './hooks/usePromptChat';

const nodeTypes = { table: TableNode, api: ApiNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const rfRef = useRef(null);

  const loadIR = async () => {
    const ir = await fetch('http://127.0.0.1:8000/ir').then(r => r.json());
    const { nodes, edges } = irToFlow(ir);
    setNodes(nodes);
    setEdges(edges);
    setTimeout(() => rfRef.current?.fitView({ padding: 0.2 }), 0);
  };

  useEffect(() => { loadIR().catch(console.error); }, []);

  // ✅ 把對話窗邏輯全交給 Hook
  const chat = usePromptChat({
    base: 'http://127.0.0.1:8000', // 如果有 Vite 代理可改成 '/api'
    onApplied: loadIR,
  });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        onInit={(inst) => (rfRef.current = inst)}
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls showInteractive />
        <MiniMap zoomable pannable />
        <Panel position="bottom-right">
          <button
            onClick={chat.openDialog}
            style={{ width: 120, height: 36, borderRadius: 8, border: '1px solid #e5e7eb',
                     background:'#111827', color:'#fff', cursor:'pointer' }}
          >
            💬 Prompt
          </button>
        </Panel>
      </ReactFlow>

      {/* ✅ 展示型元件，從 Hook 拿 props */}
      <PromptDialog {...chat.dialogProps} />
    </div>
  );
}
