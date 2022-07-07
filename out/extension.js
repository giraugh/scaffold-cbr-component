"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const scaffold_1 = require("./scaffold");
function activate(context) {
    console.log('Activated scaffold-cbr-component extension');
    const disposable = vscode.commands.registerCommand('scaffold-cbr-component.scaffoldComponent', scaffold_1.scaffoldComponent);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
    console.log('Deactivated scaffold-cbr-component extension');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map