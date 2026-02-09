// Main canvas for displaying the TUI design

import { useEffect, useState } from 'react';
import { useCanvasStore, useComponentStore, useSelectionStore } from '../../stores';
import { layoutEngine } from '../../utils/layout';
import { dragStore } from '../../hooks/useDragAndDrop';
import { COMPONENT_LIBRARY } from '../../constants/components';

export function Canvas() {
  // Use Zustand selectors for proper reactivity
  const root = useComponentStore(state => state.root);
  const addComponent = useComponentStore(state => state.addComponent);
  const setRoot = useComponentStore(state => state.setRoot);

  const canvasWidth = useCanvasStore(state => state.width);
  const canvasHeight = useCanvasStore(state => state.height);
  const canvasZoom = useCanvasStore(state => state.zoom);
  const showGrid = useCanvasStore(state => state.showGrid);

  const select = useSelectionStore(state => state.select);
  const [isDragOver, setIsDragOver] = useState(false);

  const cellWidth = 8; // pixels per character
  const cellHeight = 16; // pixels per line

  const viewportWidth = canvasWidth * cellWidth * canvasZoom;
  const viewportHeight = canvasHeight * cellHeight * canvasZoom;

  // Calculate layout whenever components or canvas size changes
  useEffect(() => {
    layoutEngine.calculateLayout(root, canvasWidth, canvasHeight);
  }, [root, canvasWidth, canvasHeight]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const dragData = dragStore.dragData;
    if (!dragData) return;

    if (dragData.type === 'new-component' && dragData.componentType) {
      // Add new component to canvas
      let parentId = root?.id;

      if (!parentId) {
        // Create root if it doesn't exist
        const newRoot: import('../../types').ComponentNode = {
          id: 'root',
          type: 'Box',
          name: 'Root',
          props: { width: 80, height: 24 },
          layout: {
            type: 'flexbox',
            direction: 'column',
            gap: 1,
            padding: 2,
          },
          style: {
            border: true,
            borderStyle: 'single',
          },
          events: {},
          children: [],
          locked: false,
          hidden: false,
          collapsed: false,
        };
        setRoot(newRoot);
        parentId = 'root'; // Now we have a parent to add to
      }

      const def = COMPONENT_LIBRARY[dragData.componentType];
      if (def) {
        const newComponent: Omit<import('../../types').ComponentNode, 'id'> = {
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

        const id = addComponent(parentId, newComponent);
        if (id) {
          select(id);
        }
      }
    }

    dragStore.endDrag();
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-muted/20 overflow-auto p-8">
      <div className="relative" style={{ width: viewportWidth, height: viewportHeight }}>
        {/* Canvas Background */}
        <div
          className={`absolute inset-0 bg-background border-2 rounded transition-colors ${
            isDragOver ? 'border-primary border-dashed' : 'border-border'
          }`}
          style={{
            fontFamily: 'monospace',
            fontSize: `${12 * canvasZoom}px`,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Grid */}
          {showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none opacity-20"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="grid"
                  width={cellWidth * canvasZoom}
                  height={cellHeight * canvasZoom}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width={cellWidth * canvasZoom}
                    height={cellHeight * canvasZoom}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {/* Empty State */}
          {!root && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none">
              <div className="text-center">
                <p className="mb-2">{isDragOver ? 'Drop to add component' : 'Drag components here'}</p>
                <p className="text-xs">or click components in the palette</p>
              </div>
            </div>
          )}

          {/* Component Rendering */}
          {root && (
            <div className="absolute inset-0" style={{ fontFamily: 'monospace' }}>
              <ComponentRenderer
                node={root}
                cellWidth={cellWidth}
                cellHeight={cellHeight}
                zoom={canvasZoom}
              />
            </div>
          )}
        </div>

        {/* Canvas Info */}
        <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
          {canvasWidth}×{canvasHeight} cols/rows
        </div>
      </div>
    </div>
  );
}

// Component renderer with layout engine
interface ComponentRendererProps {
  node: import('../../types').ComponentNode;
  cellWidth: number;
  cellHeight: number;
  zoom: number;
}

function ComponentRenderer({ node, cellWidth, cellHeight, zoom }: ComponentRendererProps) {
  // Use Zustand selectors for proper reactivity
  const selectedIds = useSelectionStore(state => state.selectedIds);
  const select = useSelectionStore(state => state.select);
  const moveComponent = useComponentStore(state => state.moveComponent);

  const layout = layoutEngine.getLayout(node.id);
  const isSelected = selectedIds.has(node.id);
  const [isDragging, setIsDragging] = useState(false);

  if (!layout || node.hidden) return null;

  const getBorderChars = (style: string) => {
    switch (style) {
      case 'single':
        return { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' };
      case 'double':
        return { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' };
      case 'rounded':
        return { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' };
      case 'bold':
        return { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' };
      default:
        return { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' };
    }
  };

  // Helper to pad text to specified width
  const padText = (text: string, width: number, align: 'left' | 'center' | 'right' = 'center'): string => {
    if (text.length >= width) return text.slice(0, width);
    const padding = width - text.length;
    if (align === 'left') return text + ' '.repeat(padding);
    if (align === 'right') return ' '.repeat(padding) + text;
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  };

  // Get plain text content for a component (for bordered rendering)
  const getTextContent = (): string => {
    switch (node.type) {
      case 'Text':
        return node.props.content as string || 'Text';
      case 'Button': {
        const label = node.props.label as string || 'Button';
        const iconLeft = (node.props.iconLeftEnabled && node.props.iconLeft) ? node.props.iconLeft as string : '';
        const iconRight = (node.props.iconRightEnabled && node.props.iconRight) ? node.props.iconRight as string : '';
        const number = node.props.number as number | undefined;
        const separated = node.props.separated as boolean;

        if (separated && iconLeft) {
          const leftSection = number !== undefined ? `${iconLeft} ${number}` : iconLeft;
          return `${leftSection} │ ${label}${iconRight ? ` ${iconRight}` : ''}`;
        }

        const left = iconLeft ? `${iconLeft} ` : '';
        const right = iconRight ? ` ${iconRight}` : '';
        return ` ${left}${label}${right} `;
      }
      case 'TextInput':
        return `[${node.props.placeholder || '___________'}]`;
      case 'ProgressBar': {
        const value = (node.props.value as number) || 0;
        const max = (node.props.max as number) || 100;
        const percentage = Math.floor((value / max) * 20);
        return `[${'█'.repeat(percentage)}${'░'.repeat(20 - percentage)}] ${value}/${max}`;
      }
      case 'Checkbox':
        return `[${node.props.checked ? '✓' : ' '}] Checkbox`;
      case 'Spinner':
        return '⣾ Loading...';
      default:
        return node.type;
    }
  };

  const renderContent = () => {
    const text = getTextContent();

    switch (node.type) {
      case 'Button':
        return <span className="font-bold">{text}</span>;
      case 'List':
      case 'Select':
      case 'Menu': {
        const items = (node.props.items as string[]) || [];
        return (
          <div>
            {items.slice(0, 5).map((item, i) => (
              <div key={i}>• {item}</div>
            ))}
            {items.length > 5 && <div className="text-muted-foreground">... +{items.length - 5} more</div>}
          </div>
        );
      }
      default:
        return <span>{text}</span>;
    }
  };

  const hasBorder = node.style.border;
  const borderStyle = node.style.borderStyle || 'single';
  const chars = getBorderChars(borderStyle);

  // Debug logging
  if (node.type === 'Button') {
    console.log(`[Canvas] Rendering Button:`, {
      name: node.name,
      propsWidth: node.props.width,
      layoutWidth: layout.width,
      layoutHeight: layout.height,
      hasBorder,
      horizontalChars: layout.width - 2
    });
  }

  const x = layout.x * cellWidth * zoom;
  const y = layout.y * cellHeight * zoom;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStore.startDrag({
      type: 'existing-component',
      componentId: node.id,
    });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);

    // Select the component being dragged
    select(node.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragStore.endDrag();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const dragData = dragStore.dragData;
    if (!dragData || dragData.type !== 'existing-component' || !dragData.componentId) return;

    // Don't drop on self
    if (dragData.componentId === node.id) return;

    // Move the dragged component to be a child of this component
    moveComponent(dragData.componentId, node.id);
    dragStore.endDrag();
  };

  return (
    <>
      <div
        draggable={!node.locked && node.type !== 'Box'}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`absolute transition-colors ${
          isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
        } ${
          isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          color: node.style.color,
          backgroundColor: node.style.backgroundColor,
          fontWeight: node.style.bold ? 'bold' : 'normal',
          fontStyle: node.style.italic ? 'italic' : 'normal',
          textDecoration: node.style.underline ? 'underline' : 'none',
          opacity: isDragging ? 0.5 : (node.style.opacity ?? 1),
          fontSize: `${12 * zoom}px`,
          pointerEvents: node.locked ? 'none' : 'auto',
        }}
        onClick={(e) => {
          e.stopPropagation();
          select(node.id);
        }}
      >
        {hasBorder ? (
          <div>
            {/* Top border */}
            <div>
              {chars.tl}
              {chars.h.repeat(Math.max(0, layout.width - 2))}
              {chars.tr}
            </div>
            {/* Content - pad with spaces to match border width */}
            <div>
              <span className={node.type === 'Button' ? 'font-bold' : ''}>
                {chars.v}
                {padText(getTextContent(), layout.width - 2, 'center')}
                {chars.v}
              </span>
            </div>
            {/* Bottom border */}
            <div>
              {chars.bl}
              {chars.h.repeat(Math.max(0, layout.width - 2))}
              {chars.br}
            </div>
          </div>
        ) : (
          renderContent()
        )}

        {/* Layout debug info */}
        {isSelected && (
          <div
            className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded whitespace-nowrap"
            style={{ fontSize: '10px' }}
          >
            {layout.width}×{layout.height} @ ({layout.x}, {layout.y})
          </div>
        )}
      </div>

      {/* Render children */}
      {node.children.map((child) => (
        <ComponentRenderer
          key={child.id}
          node={child}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          zoom={zoom}
        />
      ))}
    </>
  );
}
