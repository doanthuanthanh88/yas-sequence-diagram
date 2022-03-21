import uniqWith from "lodash.uniqwith"
import { join } from "path"
import { File } from "yaml-scene/src/elements/File/adapter/File"
import { FunctionModel } from "./model/FunctionModel"

/**
 * @guide
 * @name Guide
 * @h2 #
 * @order 0
 * @description How to used comment to generate to sequence diagram  
- Example at [here](./test/resources/)
- Output sequence diagram at [here](./test/resources/result/README.md)
 * @end
 */
export class Exporter {
  constructor(private outDir: string) {
  }

  async export(functions: FunctionModel[]) {
    await Promise.all([
      this.exportIndex(functions),
      this.exportSequence(functions)
    ])
  }

  private async exportIndex(functions: FunctionModel[]) {
    new File(join(this.outDir, 'README.md'))
      .write(`# Application document details
## System overview
Describe all of components in application

${await this.getOverviewMMD(functions)}

## Main flows
Visualize flows in application to sequence diagrams

${functions
          .filter(func => !func.name)
          .sort((a, b) => a.description > b.description ? 1 : -1)
          .map((func, i) => `${+i + 1}. [${func.description}](./${func.filename}.md)`)
          .join('\n')}
`)
  }

  private async getOverviewMMD(functions: FunctionModel[]) {
    const subjectInfors = functions.map(func => func.getSubjects(func.context || 'App')).flat()
    let isEnded = true
    const { shapes } = Array.from(new Set(functions.map(func => func.getShapes(func.context || 'App')).flat()))
      .sort()
      .reduce((sum, shape) => {
        const [prefix, value] = shape.split('\0')
        const [type, appName] = prefix.substring(2).split('|')
        if (!sum.appNames.has(appName)) {
          if (sum.type !== type) {
            sum.type = type
            if (!isEnded) {
              sum.shapes.push('end')
              isEnded = true
            }
            if (type) {
              sum.shapes.push(`subgraph ${type}`)
              isEnded = false
            }
          }
          sum.shapes.push(value)
          sum.appNames.add(appName)
        }
        return sum
      }, { shapes: new Array<string>(), appNames: new Set<string>(), type: '' })
    if (!isEnded) {
      shapes.push('end')
    }
    const subjects = uniqWith(subjectInfors, (a, b) => a.toString() === b.toString())
      .filter(a => a.subject !== a.target)
    // .sort((a, b) => a.subject > b.subject ? 1 : -1)
    return `
\`\`\`mermaid
flowchart LR
%% Declare shapes
${shapes.map(shape => shape).join('\n')}

%% Main flows
${subjects.map(sub => sub.toMMD()).join('\n')}
\`\`\`
`
  }

  private async exportSequence(functions: FunctionModel[]) {
    await Promise.all(functions
      .filter(func => !func.name)
      // .sort((a, b) => a.description > b.description ? 1 : -1)
      .map(func => {
        new File(join(this.outDir, func.description + '.md'))
          .write(`# ${func.description}
\`\`\`mermaid
sequenceDiagram

${func.toMMD(func.context || 'App', 0)}
\`\`\`
`)
      }))
  }
}