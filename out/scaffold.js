"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldComponent = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const vscode = require("vscode");
const scaffoldComponent = async (source = {}) => {
    // Get folder path
    const { path: dirPath } = source;
    if (dirPath) {
        // Get component name from dialog
        const componentName = await vscode.window.showInputBox({
            title: 'Scaffold a component',
            prompt: 'Component Name?',
            placeHolder: 'MyComponent',
            validateInput(value) { return /([A-Z][a-z0-9]+)+/.test(value) ? null : 'Must be pascal-case'; },
        });
        if (!componentName) {
            return;
        }
        // Check if dir exists already
        const componentDir = (0, path_1.join)(dirPath, componentName);
        if ((0, fs_1.existsSync)(componentDir)) {
            console.warn(`Component ${componentName} already exists at ${dirPath}`);
            return;
        }
        // Create component directory
        console.log(`Creating <${componentName}/> component in ${dirPath}/`);
        await (0, promises_1.mkdir)(componentDir);
        // Create component files
        console.log(`Creating files for ${componentName} component`);
        const componentFileName = `${componentName}.js`;
        const styleFileName = styleFile(componentName);
        await Promise.all([
            (0, promises_1.writeFile)((0, path_1.join)(componentDir, componentFileName), createComponentFile(componentName)),
            (0, promises_1.writeFile)((0, path_1.join)(componentDir, styleFileName), createStyleFile()),
        ]);
        // Add to index?
        const indexFilePath = (0, path_1.join)(dirPath, 'index.js');
        if ((0, fs_1.existsSync)(indexFilePath)) {
            const doAddToIndex = (await vscode.window.showInformationMessage('Add component to index.js file?', 'Yes Please', 'No Thanks')) === 'Yes Please';
            if (doAddToIndex) {
                await (0, promises_1.appendFile)(indexFilePath, `export { default as ${componentName} } from './${componentName}/${componentFileName}'`);
            }
        }
    }
};
exports.scaffoldComponent = scaffoldComponent;
const createComponentFile = (name) => {
    return [
        `import { Container } from './${styleFile(name)}'`,
        '',
        `const ${name} = () => <Container>`,
        '\t',
        `</Container>`,
        '',
        `export default ${name}`,
    ].join('\n');
};
const createStyleFile = () => {
    return [
        `import { styled } from 'goober'`,
        '',
        `export const Container = styled('div')\`\``,
    ].join('\n');
};
const styleFile = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}Style.js`;
//# sourceMappingURL=scaffold.js.map