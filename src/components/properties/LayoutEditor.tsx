// Layout property editor

import { useComponentStore } from '../../stores';
import type { ComponentNode } from '../../types';

interface LayoutEditorProps {
  component: ComponentNode;
}

export function LayoutEditor({ component }: LayoutEditorProps) {
  const handleUpdateLayout = useComponentStore(state => state.handleUpdateLayout);

  const handleUpdateLayout = (updates: Partial<ComponentNode['layout']>) => {
    handleUpdateLayout(component.id, updates);
  };

  return (
    <div className="space-y-4">
      {/* Layout Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Layout Type</label>
        <select
          value={component.layout.type}
          onChange={(e) => handleUpdateLayout({ type: e.target.value as any })}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
        >
          <option value="none">None</option>
          <option value="flexbox">Flexbox</option>
          <option value="grid">Grid</option>
          <option value="absolute">Absolute</option>
        </select>
      </div>

      {/* Flexbox Options */}
      {component.layout.type === 'flexbox' && (
        <>
          <div>
            <label className="text-sm font-medium mb-2 block">Direction</label>
            <select
              value={component.layout.direction}
              onChange={(e) => handleUpdateLayout({ direction: e.target.value as any })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
            >
              <option value="row">Row (→)</option>
              <option value="column">Column (↓)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Justify</label>
            <select
              value={component.layout.justify}
              onChange={(e) => handleUpdateLayout({ justify: e.target.value as any })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Align</label>
            <select
              value={component.layout.align}
              onChange={(e) => handleUpdateLayout({ align: e.target.value as any })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Gap</label>
            <input
              type="number"
              value={component.layout.gap || 0}
              onChange={(e) => handleUpdateLayout({ gap: parseInt(e.target.value) || 0 })}
              min={0}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="wrap"
              checked={component.layout.wrap || false}
              onChange={(e) => handleUpdateLayout({ wrap: e.target.checked })}
            />
            <label htmlFor="wrap" className="text-sm">Wrap</label>
          </div>
        </>
      )}

      {/* Grid Options */}
      {component.layout.type === 'grid' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Columns</label>
              <input
                type="number"
                value={component.layout.columns || 2}
                onChange={(e) => handleUpdateLayout({ columns: parseInt(e.target.value) || 2 })}
                min={1}
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Rows</label>
              <input
                type="number"
                value={component.layout.rows || 2}
                onChange={(e) => handleUpdateLayout({ rows: parseInt(e.target.value) || 2 })}
                min={1}
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Column Gap</label>
              <input
                type="number"
                value={component.layout.columnGap || 0}
                onChange={(e) => handleUpdateLayout({ columnGap: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Row Gap</label>
              <input
                type="number"
                value={component.layout.rowGap || 0}
                onChange={(e) => handleUpdateLayout({ rowGap: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
              />
            </div>
          </div>
        </>
      )}

      {/* Absolute Options */}
      {component.layout.type === 'absolute' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium mb-2 block">X Position</label>
            <input
              type="number"
              value={component.layout.x || 0}
              onChange={(e) => handleUpdateLayout({ x: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Y Position</label>
            <input
              type="number"
              value={component.layout.y || 0}
              onChange={(e) => handleUpdateLayout({ y: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
            />
          </div>
        </div>
      )}

      {/* Padding */}
      <div>
        <label className="text-sm font-medium mb-2 block">Padding</label>
        <input
          type="number"
          value={typeof component.layout.padding === 'number' ? component.layout.padding : 0}
          onChange={(e) => handleUpdateLayout({ padding: parseInt(e.target.value) || 0 })}
          min={0}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
        />
      </div>

      {/* Margin */}
      <div>
        <label className="text-sm font-medium mb-2 block">Margin</label>
        <input
          type="number"
          value={typeof component.layout.margin === 'number' ? component.layout.margin : 0}
          onChange={(e) => handleUpdateLayout({ margin: parseInt(e.target.value) || 0 })}
          min={0}
          className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm"
        />
      </div>
    </div>
  );
}
