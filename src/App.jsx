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
import Sidebar from './components/Sidebar';
import { usePromptChat } from './hooks/usePromptChat';

const nodeTypes = { table: TableNode, api: ApiNode };
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000';

// 放在檔案上方
const apiFill = (m = '') => {
  switch (String(m).toUpperCase()) {
    case 'GET': return '#86efac';     // 綠（淺）
    case 'POST': return '#93c5fd';    // 藍
    case 'PUT':
    case 'PATCH': return '#fdba74';   // 橘
    case 'DELETE': return '#fca5a5';  // 紅
    default: return '#e5e7eb';        // 灰
  }
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const rfRef = useRef(null);

  const loadIR = async () => {
    const ir = await fetch(`${API_BASE}/ir`).then(r => r.json());
    const { nodes, edges } = irToFlow(ir);
    setNodes(nodes);
    setEdges(edges);
    setTimeout(() => rfRef.current?.fitView({ padding: 0.2 }), 0);
  };

  useEffect(() => { loadIR().catch(console.error); }, []);

  // ✅ 把對話窗邏輯全交給 Hook
  const chat = usePromptChat({
    base: API_BASE,
    onApplied: loadIR,
  });

  return (
    <div className="sg-app">
      <Sidebar onSelect={(key)=>console.log('sidebar select:', key)} />
      <main className="sg-main">
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
        <MiniMap
          zoomable
          pannable
          nodeColor={(n) => (n.type === 'api' ? apiFill(n.data?.method) : '#bfdbfe')}
          nodeStrokeWidth={2}
          style={{ width: 180, height: 120, left: 16, bottom: 16, right: 'auto', top: 'auto' }}
        />
      </ReactFlow>

      {/* ✅ 展示型元件，從 Hook 拿 props */}
      <PromptDialog {...chat.dialogProps} />

      {/* 固定在視窗右下角，不受 canvas 水平位置影響 */}
      <button
        onClick={chat.openDialog}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: 120,
          height: 36,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: '#111827',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        💬 Prompt
      </button>
    </div>
      </main>
    </div>
  );
}
