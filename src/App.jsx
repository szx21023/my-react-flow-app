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
import SpecPage from './pages/SpecPage';
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
  const [page, setPage] = useState('canvas');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loadError, setLoadError] = useState(null);
  const rfRef = useRef(null);

  const loadIR = async () => {
    setLoadError(null);
    const res = await fetch(`${API_BASE}/ir`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ir = await res.json();
    const { nodes, edges } = irToFlow(ir);
    setNodes(nodes);
    setEdges(edges);
    setTimeout(() => rfRef.current?.fitView({ padding: 0.2 }), 0);
  };

  useEffect(() => {
    if (page === 'canvas') {
      loadIR().catch((err) => {
        console.error('[loadIR]', err);
        setLoadError(`無法載入資料：${err.message}`);
      });
    }
  }, [page]);

  // ✅ 把對話窗邏輯全交給 Hook
  const chat = usePromptChat({
    base: API_BASE,
    onApplied: loadIR,
  });

  return (
    <div className="sg-app">
      <Sidebar activePage={page} onSelect={setPage} />
      <main className="sg-main">
        {page === 'specs' ? (
          <SpecPage />
        ) : (
          <div style={{ width: '100%', height: '100vh' }}>
            {loadError && (
              <div style={{
                position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
                background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b',
                borderRadius: 8, padding: '8px 16px', zIndex: 10,
              }}>
                {loadError}
              </div>
            )}
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
        )}
      </main>
    </div>
  );
}
