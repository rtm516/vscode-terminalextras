// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "terminalextras" is now active!');

	const openCommand = vscode.commands.registerCommand('terminalextras.open', (fileUri) => {
		// Get the path of the active file
		let filePath: string = '';
        if (!fileUri || typeof fileUri.fsPath !== 'string') {
            let activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && !activeEditor.document.isUntitled) {
                filePath = activeEditor.document.fileName;
            }
        } else {
            filePath = fileUri.fsPath;
        }

		// Create a new terminal
        let terminal = vscode.window.createTerminal();
        terminal.show(false);

		// If a file is open, change to the directory of the active file
        if (filePath !== '') {
			// Replace C:\ with /c/ for bash on Windows
			if (os.platform() === 'win32') {
				let windowsShell = vscode.workspace.getConfiguration('terminal').get<string>('integrated.shell.windows');
				if (windowsShell && windowsShell.toLowerCase().indexOf('bash') > -1 && windowsShell.toLowerCase().indexOf('windows') > -1) {
					filePath = filePath.replace(/([A-Za-z]):\\/, (match: string, p1: string) => {
						return `/mnt/${p1.toLowerCase()}/`;
					}).replace(/\\/g, '/');
				}
			}

			// Change to the directory of the active file
            terminal.sendText(`cd "${path.dirname(filePath)}"`);
        }
	});

	const toggleCommand = vscode.commands.registerCommand('terminalextras.toggle', () => {
        vscode.commands.executeCommand("workbench.action.terminal.toggleTerminal");
	});

	// Create a status bar item to open a new terminal
	let toggleTerminalStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	toggleTerminalStatusBarItem.command = "terminalextras.toggle";
	toggleTerminalStatusBarItem.text = " $(terminal) ";
	toggleTerminalStatusBarItem.tooltip = "Toggle Integrated Terminal";
	toggleTerminalStatusBarItem.show();

	context.subscriptions.push(openCommand);
	context.subscriptions.push(toggleCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
