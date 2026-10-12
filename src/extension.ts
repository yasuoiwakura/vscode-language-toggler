import * as vscode from 'vscode';

const LANG_A = 'yaml';
const LANG_B = 'cloudformation';

export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.command = 'toggleLanguageMode.toggle';
	statusBarItem.tooltip = 'Toggle Language Mode (YAML ⇄ CloudFormation)';

	const updateStatusBar = () => {
		const editor = vscode.window.activeTextEditor;
		statusBarItem.text =
			editor && editor.document.languageId === LANG_B ? '⇄ CFN' : '⇄ YAML';
	};

	const toggle = vscode.commands.registerCommand(
		'toggleLanguageMode.toggle',
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			const currentLang = editor.document.languageId;
			const nextLang = currentLang === LANG_A ? LANG_B : LANG_A;

			await vscode.languages.setTextDocumentLanguage(
				editor.document,
				nextLang
			);
			updateStatusBar();
		}
	);

	updateStatusBar();
	statusBarItem.show();

	context.subscriptions.push(
		statusBarItem,
		toggle,
		vscode.window.onDidChangeActiveTextEditor(updateStatusBar)
	);
}

export function deactivate() {}
