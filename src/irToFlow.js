// src/irToFlow.js
function setOf(arr = []) { return new Set(arr); }
function intersects(a = [], bSet = new Set()) { return a.some(x => bSet.has(x)); }

export function irToFlow(ir) {
  const nodes = [];
  const edges = [];

  // 建立 entity → 欄位集合（大小寫照原樣）
  const entityCols = new Map(); // name -> Set(columns)
  (ir.entities || []).forEach((e, i) => {
    const id = `table:${e.name}`;
    entityCols.set(e.name, setOf((e.columns || []).map(c => c.name)));

    nodes.push({
      id,
      type: 'table',
      position: { x: (i % 4) * 280, y: Math.floor(i / 4) * 220 },
      data: { name: e.name, rows: e.columns || [] },
    });
  });

  // API 節點
  (ir.apis || []).forEach((a, i) => {
    const id = `api:${a.method}:${a.path}`;
    nodes.push({
      id,
      type: 'api',
      position: { x: (i % 4) * 280, y: 480 + Math.floor(i / 4) * 180 },
      data: {
        method: a.method,
        path: a.path,
        request: a.request_fields || [],
        response: a.response_fields || [],
      },
    });
  });

  // API 與 Table 的關係（read / write）
  const apis = ir.apis || [];
  const entities = ir.entities || [];
  apis.forEach((a) => {
    const apiId = `api:${a.method}:${a.path}`;
    const req = a.request_fields || [];
    const res = a.response_fields || [];
    const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes((a.method || '').toUpperCase());

    entities.forEach((e) => {
      const tableId = `table:${e.name}`;
      const cols = entityCols.get(e.name) || new Set();

      // 讀：請求或 GET 回應欄位命中該表的欄位
      const readHit = intersects(req, cols) || (!isWriteMethod && intersects(res, cols));
      if (readHit) {
        edges.push({
          id: `read:${e.name}->${apiId}`,
          source: tableId,
          target: apiId,
          label: 'read',
          type: 'default',
          style: { strokeDasharray: '4 4' },
        });
      }

      // 寫：非 GET 且回應欄位/請求欄位命中該表（如註冊回 user_id / login 回 session_id）
      const writeHit = isWriteMethod && (intersects(res, cols) || intersects(req, cols));
      if (writeHit) {
        edges.push({
          id: `write:${apiId}->${e.name}`,
          source: apiId,
          target: tableId,
          label: 'write',
          type: 'smoothstep',
        });
      }
    });
  });

  // 由欄位名推斷 FK（e.g. Session.user_id → User）
  const entityNameSet = new Set(entities.map(e => e.name.toLowerCase()));
  entities.forEach((e) => {
    (e.columns || []).forEach((c) => {
      if (!c.name.toLowerCase().endsWith('_id')) return;
      const base = c.name.slice(0, -3).toLowerCase(); // 去掉 _id
      // 嘗試 match 單複數名稱
      const candidates = [base, base + 's', base.endsWith('s') ? base.slice(0, -1) : null].filter(Boolean);
      const target = candidates.find(n => entityNameSet.has(n));
      if (target) {
        const targetEntity = entities.find(x => x.name.toLowerCase() === target);
        if (!targetEntity) return;
        edges.push({
          id: `fk:${e.name}->${targetEntity.name}:${c.name}`,
          source: `table:${e.name}`,
          target: `table:${targetEntity.name}`,
          label: `fk ${e.name}.${c.name} → ${targetEntity.name}.id`,
          type: 'smoothstep',
          style: { strokeDasharray: '2 2' },
        });
      }
    });
  });

  return { nodes, edges };
}
