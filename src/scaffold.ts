import { existsSync  } from 'fs'
import { mkdir, writeFile, stat, appendFile } from 'fs/promises'
import { join } from 'path'
import * as vscode from 'vscode'

type Source = { path?: string }

export const scaffoldComponent = async (source: Source = {}) => {
  // Get folder path
  const { path: dirPath } = source

  if (dirPath) {
    // Get component name from dialog
    const componentName = await vscode.window.showInputBox({
      title: 'Scaffold a component',
      prompt: 'Component Name?',
      placeHolder: 'MyComponent',
      validateInput(value) { return /([A-Z][a-z0-9]+)+/.test(value) ? null : 'Must be pascal-case' },
    })
    if (!componentName) { return }

    // Check if dir exists already
    const componentDir = join(dirPath, componentName)
    if (existsSync(componentDir)) {
      console.warn(`Component ${componentName} already exists at ${dirPath}`)
      return
    }

    // Create component directory
    console.log(`Creating <${componentName}/> component in ${dirPath}/`)
    await mkdir(componentDir)

    // Create component files
    console.log(`Creating files for ${componentName} component`)
    const componentFileName = makeComponentFileName(componentName)
    const styleFileName = makeStylesFileName(componentName)
    await Promise.all([
      writeFile(join(componentDir, componentFileName), createComponentFile(componentName)),
      writeFile(join(componentDir, styleFileName), createStyleFile()),
    ])

    // Add to index?
    const indexFilePath = join(dirPath, 'index.js')
    if (existsSync(indexFilePath)) {
      const doAddToIndex = (await vscode.window.showInformationMessage('Add component to index.js file?', 'Yes Please', 'No Thanks')) === 'Yes Please'
      if (doAddToIndex) {
        await appendFile(
          indexFilePath,
          `export { default as ${componentName} } from './${componentName}/${makeComponentFileName(componentName, false)}'\n`
        )
      }
    }
  }
}

const createComponentFile = (componentName: string): string => {
  return [
    `import { Container } from './${makeStylesFileName(componentName, false)}'`,
    '',
    `const ${componentName} = () => <Container>`,
    '  ',
    `</Container>`,
    '',
    `export default ${componentName}`,
    '',
  ].join('\n')
}

const createStyleFile = (): string => {
  return [
    `import { styled } from 'goober'`,
    '',
    `export const Container = styled('div')\`\``,
    '',
  ].join('\n')
}

const makeComponentFileName = (componentName: string, ext: boolean = true): string => {
  const pattern: string = vscode.workspace.getConfiguration('scaffold-cbr-component').get('componentFilePattern') ?? '$Component.jsx'
  return applyPattern(componentName, pattern, ext)
}

const makeStylesFileName = (componentName: string, ext: boolean = true): string => {
  const pattern: string = vscode.workspace.getConfiguration('scaffold-cbr-component').get('stylesFilePattern') ?? '$Component.styles.js'
  return applyPattern(componentName, pattern, ext)
}

const applyPattern = (componentName: string, pattern: string, ext: boolean = true): string => {
  const componentNameCamel = `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}`
  const fileName = pattern
    .replaceAll('$component', componentNameCamel)
    .replaceAll('$Component', componentName)
  return ext
    ? fileName
    : fileName.split('.').slice(0, -1).join('.')
}
