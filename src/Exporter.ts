import { uniqWith } from "lodash"
import { join } from "path"
import { FileDataSource } from "yaml-scene/src/utils/data-source/file/FileDataSource"
import { FunctionModel } from "./model/FunctionModel"

/**
 * Guide
 * @h2 #
 * @order 0
 * @description How to used comment to generate to sequence diagram  
 * - Example at [here](./test/resources/)
 * - Output sequence diagram at [here](./test/resources/result/README.md)
 * @exampleType custom
 * @example
 */
export class Exporter {
  constructor(private outDir: string) {
  }

  async export(functions: FunctionModel[]) {
    await Promise.all([
      this.exportIndex(functions),
      this.exportSequence(functions),
      this.exportOverview(functions)
    ])
  }

  private async exportIndex(functions: FunctionModel[]) {
    new FileDataSource(join(this.outDir, 'README.md'))
      .write(`# System diagram
## Overview diagram
- [Overview](./Overview.md)

## Sequence diagrams
${functions.filter(func => !func.name).map((func, i) => `${+i + 1}. [${func.description}](./${func.filename}.md)`).join('\n')}
`)
  }

  private async exportOverview(functions: FunctionModel[]) {
    const subjectInfors = functions.map(func => func.getSubjects(func.context || 'App')).flat()
    const subjects = uniqWith(subjectInfors, (a, b) => a.toString() === b.toString())
      .filter(a => a.subject !== a.target)
      .sort((a, b) => {
        return a.subject > b.subject ? 1 : -1
      })
    new FileDataSource(join(this.outDir, 'Overview.md'))
      .write(`# Overview
\`\`\`mermaid
flowchart LR

${subjects.map(sub => sub.toMMD()).join('\n')}
`)
  }

  private async exportSequence(functions: FunctionModel[]) {
    await Promise.all(functions.filter(func => !func.name).map(func => {
      new FileDataSource(join(this.outDir, func.description + '.md'))
        .write(`# ${func.description}
\`\`\`mermaid
sequenceDiagram

${func.toMMD(func.context || 'App', 0)}
\`\`\`
`)
    }))
  }
}