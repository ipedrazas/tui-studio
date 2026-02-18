import { useEffect, useState } from 'react';
import './App.css';
import { EditorLayout } from './components/editor/EditorLayout';
import { Toolbar } from './components/editor/Toolbar';
import { LeftSidebar } from './components/editor/LeftSidebar';
import { Canvas } from './components/editor/Canvas';
import { PropertyPanel } from './components/properties/PropertyPanel';
import { LayoutDebugPanel } from './components/debug/LayoutDebugPanel';
import { CommandPalette } from './components/editor/CommandPalette';
import { useComponentStore, useSelectionStore } from './stores';
import { COMPONENT_LIBRARY } from './constants/components';
import type { ComponentType } from './types';

function App() {
  const componentStore = useComponentStore();
  const selectionStore = useSelectionStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Enable dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' ||
                      target.tagName === 'TEXTAREA' ||
                      target.isContentEditable;

      // Command palette (Ctrl/Cmd+P)
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Save (Ctrl/Cmd+S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        window.dispatchEvent(new Event('command-save'));
        return;
      }

      // Export (Ctrl/Cmd+E)
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        window.dispatchEvent(new Event('command-export'));
        return;
      }

      // Settings (Ctrl/Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new Event('command-settings'));
        return;
      }

      // Delete selected component (Backspace or Delete)
      if ((e.key === 'Backspace' || e.key === 'Delete') && !isTyping && !commandPaletteOpen) {
        const selectedIds = Array.from(selectionStore.selectedIds);
        if (selectedIds.length > 0) {
          e.preventDefault();
          // Delete all selected components that aren't root and aren't locked
          selectedIds.forEach((selectedId) => {
            if (selectedId !== 'root') {
              const component = componentStore.getComponent(selectedId);
              if (component && !component.locked) {
                componentStore.removeComponent(selectedId);
              }
            }
          });
          selectionStore.clearSelection();
        }
      }

      // Component creation hotkeys (only when not typing and palette closed)
      if (!isTyping && !commandPaletteOpen && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const hotkeyMap: Record<string, ComponentType> = {
          'b': 'Button',
          'r': 'Box',
          'k': 'Checkbox',
          'a': 'Radio',
          's': 'Select',
          'i': 'TextInput',
          'o': 'Toggle',
          'p': 'ProgressBar',
          'n': 'Spinner',
          'y': 'Text',
          't': 'Tabs',
          'l': 'List',
          'e': 'Tree',
          'm': 'Menu',
          'j': 'Spacer',
        };

        const componentType = hotkeyMap[e.key.toLowerCase()];
        if (componentType) {
          e.preventDefault();
          handleAddComponent(componentType);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, componentStore, selectionStore]);

  // Listen for command palette open event from toolbar button
  useEffect(() => {
    const handleOpenCommandPalette = () => {
      setCommandPaletteOpen(true);
    };
    window.addEventListener('open-command-palette', handleOpenCommandPalette);
    return () => window.removeEventListener('open-command-palette', handleOpenCommandPalette);
  }, []);

  // Listen for command events
  useEffect(() => {
    const handleSave = () => {
      // TODO: Implement save functionality
    };

    const handleExport = () => {
      // TODO: Open export modal (same as Export button in toolbar)
      // Dispatch event to open export modal
      const exportButton = document.querySelector('[title="Export"]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.click();
      }
    };

    const handleSettings = () => {
      // TODO: Implement settings modal
    };

    window.addEventListener('command-save', handleSave);
    window.addEventListener('command-export', handleExport);
    window.addEventListener('command-settings', handleSettings);

    return () => {
      window.removeEventListener('command-save', handleSave);
      window.removeEventListener('command-export', handleExport);
      window.removeEventListener('command-settings', handleSettings);
    };
  }, []);

  // Handle adding component from command palette
  const handleAddComponent = (type: ComponentType) => {
    const root = componentStore.root;
    let parentId = root?.id;

    // Create root if it doesn't exist
    if (!parentId) {
      const newRoot: import('./types').ComponentNode = {
        id: 'root',
        type: 'Screen',
        name: 'Main Screen',
        props: { width: 80, height: 24, theme: 'dracula' },
        layout: {
          type: 'absolute',
        },
        style: {
          border: false,
        },
        events: {},
        children: [],
        locked: false,
        hidden: false,
        collapsed: false,
      };
      componentStore.setRoot(newRoot);
      parentId = 'root';
    }

    const def = COMPONENT_LIBRARY[type];
    if (def) {
      // Calculate position with offset so components don't stack
      const existingChildren = root?.children.length || 0;
      const offsetX = existingChildren * 2;
      const offsetY = existingChildren * 2;

      const newComponent: Omit<import('./types').ComponentNode, 'id'> = {
        type: def.type,
        name: def.name,
        props: { ...def.defaultProps },
        layout: {
          ...def.defaultLayout,
          x: offsetX,
          y: offsetY,
        },
        style: { ...def.defaultStyle },
        events: { ...def.defaultEvents },
        children: [],
        locked: false,
        hidden: false,
        collapsed: false,
      };

      const id = componentStore.addComponent(parentId, newComponent);
      if (id) {
        selectionStore.select(id);
      }
    }
  };

  return (
    <>
      <EditorLayout
        toolbar={<Toolbar />}
        leftSidebar={<LeftSidebar />}
        canvas={<Canvas />}
        rightSidebar={<PropertyPanel />}
        debugPanel={<LayoutDebugPanel />}
      />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onAddComponent={handleAddComponent}
      />
    </>
  );
}

export default App;
