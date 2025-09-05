import React, { useState } from 'react';

const defaultItems = [
  { key: 'specs', label: '📄 Specs' },
  { key: 'apis', label: '🔌 APIs' },
  { key: 'tables', label: '🗄️ Tables' },
  { key: 'prompts', label: '💬 Prompts' },
  { key: 'rag', label: '🧠 RAG' },
];

export default function Sidebar({ items = defaultItems, onSelect }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={collapsed ? 'sg-sidebar collapsed' : 'sg-sidebar'}>
      <div className="sg-sidebar__top">
        <div className="sg-brand">
          <span className="sg-brand__dot" /> SpecGenie
        </div>
        <button
          className="sg-iconbtn"
          title={collapsed ? 'Expand' : 'Collapse'}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sg-nav">
        {items.map((it) => (
          <button
            key={it.key}
            className="sg-nav__item"
            onClick={() => onSelect?.(it.key)}
            title={it.label}
          >
            <span className="sg-nav__icon">{it.label.split(' ')[0]}</span>
            <span className="sg-nav__text">{it.label.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </nav>

      <div className="sg-sidebar__foot">
        <div className="sg-tip">v0.1</div>
      </div>
    </aside>
  );
}
