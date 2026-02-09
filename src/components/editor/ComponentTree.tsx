// Hierarchical component tree view

import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useComponentStore, useSelectionStore } from '../../stores';
import type { ComponentNode } from '../../types';
import { dragStore } from '../../hooks/useDragAndDrop';
import { COMPONENT_LIBRARY } from '../../constants/components';

export function ComponentTree() {
  const componentStore = useComponentStore();
  const selectionStore = useSelectionStore();

  if (!componentStore.root) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No components yet. Add some from the palette!
      </div>
    );
  }

  return (
    <div className="p-2">
      <TreeNode node={componentStore.root} level={0} />
    </div>
  );
}

function TreeNode({ node, level }: { node: ComponentNode; level: number }) {
  const componentStore = useComponentStore();
  const selectionStore = useSelectionStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isSelected = selectionStore.isSelected(node.id);
  const hasChildren = node.children.length > 0;

  const toggleCollapsed = () => {
    componentStore.updateComponent(node.id, {
      collapsed: !node.collapsed,
    });
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    componentStore.updateComponent(node.id, {
      hidden: !node.hidden,
    });
  };

  const toggleLocked = (e: React.MouseEvent) => {
    e.stopPropagation();
    componentStore.updateComponent(node.id, {
      locked: !node.locked,
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStore.startDrag({
      type: 'existing-component',
      componentId: node.id,
    });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragStore.endDrag();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const dragData = dragStore.dragData;
    if (!dragData) return;

    if (dragData.type === 'existing-component' && dragData.componentId) {
      // Don't drop on self or descendants
      if (dragData.componentId === node.id) return;

      // Move component to be child of this node
      componentStore.moveComponent(dragData.componentId, node.id);
    } else if (dragData.type === 'new-component' && dragData.componentType) {
      // Add new component as child
      const def = COMPONENT_LIBRARY[dragData.componentType];
      if (def) {
        const newComponent: Omit<ComponentNode, 'id'> = {
          type: def.type,
          name: def.name,
          props: { ...def.defaultProps },
          layout: { ...def.defaultLayout },
          style: { ...def.defaultStyle },
          events: { ...def.defaultEvents },
          children: [],
          locked: false,
          hidden: false,
          collapsed: false,
        };
        componentStore.addComponent(node.id, newComponent);
      }
    }

    dragStore.endDrag();
  };

  return (
    <div>
      {/* Node */}
      <div
        draggable={!node.locked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center gap-1 px-2 py-1 rounded cursor-grab group transition-colors ${
          isSelected ? 'bg-primary/20 border border-primary' : 'hover:bg-accent'
        } ${node.hidden ? 'opacity-50' : ''} ${
          isDragOver ? 'bg-primary/30 border-2 border-dashed border-primary' : ''
        } ${isDragging ? 'opacity-30' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => selectionStore.select(node.id)}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapsed();
            }}
            className="flex-shrink-0 hover:bg-secondary rounded p-0.5"
          >
            {node.collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Type & Name */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-semibold text-cyan-400 flex-shrink-0">
            {node.type}
          </span>
          <span className="text-sm truncate">{node.name}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleVisibility}
            className="p-1 hover:bg-secondary rounded"
            title={node.hidden ? 'Show' : 'Hide'}
          >
            {node.hidden ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={toggleLocked}
            className="p-1 hover:bg-secondary rounded"
            title={node.locked ? 'Unlock' : 'Lock'}
          >
            {node.locked ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && !node.collapsed && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
