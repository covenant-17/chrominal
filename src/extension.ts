import * as vscode from 'vscode';

const COLORS = [
  'terminal.ansiRed',
  'terminal.ansiGreen',
  'terminal.ansiYellow',
  'terminal.ansiBlue',
  'terminal.ansiMagenta',
  'terminal.ansiCyan',
  'terminal.ansiWhite',
  'terminal.ansiBlack',
  'terminal.ansiBrightRed',
  'terminal.ansiBrightGreen',
  'terminal.ansiBrightYellow',
  'terminal.ansiBrightBlue',
  'terminal.ansiBrightMagenta',
  'terminal.ansiBrightCyan',
  'terminal.ansiBrightWhite',
  'terminal.ansiBrightBlack',
];

const ICONS = [
  'terminal',
  'bug',
  'beaker',
  'zap',
  'heart',
  'star',
  'gear',
  'rocket',
  'pulse',
  'eye',
  'code',
  'tools',
  'flame',
  'wand',
  'compass',
  'cloud',
];

function pickRandom<T>(all: T[], used: Set<T>): T {
  const available = all.filter(item => !used.has(item));
  const pool = available.length > 0 ? available : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getUsedFromTerminals(): { colors: Set<string>; icons: Set<string> } {
  const colors = new Set<string>();
  const icons = new Set<string>();

  for (const terminal of vscode.window.terminals) {
    const opts = terminal.creationOptions as vscode.TerminalOptions;
    if (opts.color) {
      colors.add(opts.color.id);
    }
    if (opts.iconPath && opts.iconPath instanceof vscode.ThemeIcon) {
      icons.add(opts.iconPath.id);
    }
  }

  return { colors, icons };
}

function createColoredTerminal(location?: vscode.TerminalLocation): void {
  const { colors: usedColors, icons: usedIcons } = getUsedFromTerminals();

  const colorId = pickRandom(COLORS, usedColors);
  const iconId = pickRandom(ICONS, usedIcons);
  const name = `Terminal #${vscode.window.terminals.length + 1}`;

  const terminal = vscode.window.createTerminal({
    name,
    color: new vscode.ThemeColor(colorId),
    iconPath: new vscode.ThemeIcon(iconId),
    ...(location !== undefined ? { location } : {}),
  });

  terminal.show();
}

export function activate(context: vscode.ExtensionContext): void {
  // Opens terminal in the bottom panel (default)
  const openPanel = vscode.commands.registerCommand(
    'chrominal.openColoredTerminal',
    () => createColoredTerminal()
  );

  // Opens terminal as an editor tab in the main editor area
  const openEditor = vscode.commands.registerCommand(
    'chrominal.openColoredTerminalInEditor',
    () => createColoredTerminal(vscode.TerminalLocation.Editor)
  );

  context.subscriptions.push(openPanel, openEditor);
}

export function deactivate(): void {}
