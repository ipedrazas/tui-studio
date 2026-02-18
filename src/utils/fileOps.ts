// Save and open .tui files
// Must be called directly from a user gesture (click/keydown) — not via
// window.dispatchEvent — so that showSaveFilePicker / showOpenFilePicker
// can obtain the required browser user-activation token.

import { useComponentStore } from '../stores/componentStore';
import { useThemeStore } from '../stores/themeStore';
import { useSelectionStore } from '../stores/selectionStore';

export async function saveTuiFile(): Promise<void> {
  const root = useComponentStore.getState().root;
  if (!root) return;

  const theme = useThemeStore.getState().currentTheme;
  const data = {
    version: '1',
    meta: { name: root.name, theme, savedAt: new Date().toISOString() },
    tree: root,
  };
  const json = JSON.stringify(data, null, 2);
  const suggestedName = `${root.name.toLowerCase().replace(/\s+/g, '-')}.tui`;

  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName,
        types: [{ description: 'TUI Studio File', accept: { 'application/json': ['.tui'] } }],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(json);
      await writable.close();
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
    }
  }

  // Fallback: browser download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function openTuiFile(): Promise<void> {
  const load = (text: string) => {
    try {
      const data = JSON.parse(text);
      if (data.version === '1' && data.tree) {
        useComponentStore.getState().setRoot(data.tree);
        if (data.meta?.theme) useThemeStore.getState().setTheme(data.meta.theme);
        useSelectionStore.getState().clearSelection();
      } else {
        alert('Invalid .tui file');
      }
    } catch {
      alert('Invalid .tui file');
    }
  };

  if ('showOpenFilePicker' in window) {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [{ description: 'TUI Studio File', accept: { 'application/json': ['.tui'] } }],
        multiple: false,
      });
      load(await (await fileHandle.getFile()).text());
    } catch (err) {
      if ((err as Error).name !== 'AbortError') alert('Failed to open file');
    }
  } else {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.tui,application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) load(await file.text());
    };
    input.click();
  }
}
