import * as vscode from 'vscode'

import { scaffoldComponent } from './scaffold'

export function activate(context: vscode.ExtensionContext) {
	console.log('Activated scaffold-cbr-component extension')

	const disposable = vscode.commands.registerCommand('scaffold-cbr-component.scaffoldComponent', scaffoldComponent)
	context.subscriptions.push(disposable)
}

export function deactivate() {
	console.log('Deactivated scaffold-cbr-component extension')
}
