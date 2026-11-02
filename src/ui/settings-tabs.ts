/**
 * R0468 (TECH-26): Settings in tabs, everyday first. `buildSettingsTabs` puts a tablist and
 * one pane per tab into the dialog body; the menu appends each row to the pane it belongs
 * to. Arrow keys move between tabs, Home and End jump to the ends (the tab pattern).
 */
import { SETTINGS_TABS, type SettingsTabId } from '../config/strings-r11d4';
import { el } from './dom';

export interface SettingsTabs {
  panes: Record<SettingsTabId, HTMLElement>;
  select: (id: SettingsTabId) => void;
}

export function buildSettingsTabs(root: HTMLElement): SettingsTabs {
  const list = el('div', 'settings-tabs');
  list.setAttribute('role', 'tablist');
  const panes = {} as Record<SettingsTabId, HTMLElement>;
  const tabs: Array<{ id: SettingsTabId; tab: HTMLButtonElement }> = [];
  const select = (id: SettingsTabId, focus = false): void => {
    for (const t of tabs) {
      const on = t.id === id;
      t.tab.setAttribute('aria-selected', String(on));
      t.tab.tabIndex = on ? 0 : -1;
      panes[t.id].hidden = !on;
      if (on && focus) t.tab.focus();
    }
  };
  for (const { id, label } of SETTINGS_TABS) {
    const tab = el('button', 'settings-tab', label);
    tab.type = 'button';
    tab.id = `settings-tab-${id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `settings-pane-${id}`);
    tab.addEventListener('click', () => select(id));
    const pane = el('div', 'settings-pane');
    pane.id = `settings-pane-${id}`;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', tab.id);
    tabs.push({ id, tab });
    panes[id] = pane;
    list.appendChild(tab);
  }
  list.addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t.tab === document.activeElement);
    if (i < 0) return;
    let next: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    select(tabs[next]!.id, true);
  });
  root.appendChild(list);
  for (const { id } of tabs) root.appendChild(panes[id]);
  select('sound');
  return { panes, select };
}
