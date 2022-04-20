import merge from "lodash.merge";
import { ElementProxy } from "yaml-scene/src/elements/ElementProxy";
import { IElement } from "yaml-scene/src/elements/IElement";
import { Exporter } from "./Exporter";
import { Parser } from "./Parser";
import { Scanner } from "./Scanner";

/*****
 * @name yas-sequence-diagram
 * @description Auto extract comment line in code to sequence diagrams
 * @group doc
 * @example
- yas-sequence-diagram:
    commentTag: ///             # Prefix each of line which will be handled to document (optional)
                                # Default: 
                                # .js, .ts, .go, .java is ///
                                # .py, .yaml is #/
                                # others must be set before run

    includes: ["src"]           # All of files in these path will be scanned (required)

    excludes: []                # All of files in these path will be ignored (optional)
                                # Default:
                                # .js, .ts is ['node_modules', 'dist']
                                # .java is ['bin', 'build']
                                # .py is ['__pycache__']

    includePattern: ".+\\.ts$"  # Files matched this pattern will be handled (required)

    outDir: /sequence_diagram   # Output directory which includes sequence diagrams
 */
export class SequenceDiagram implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  includes?: string[]
  excludes?: string[]
  includePattern?: RegExp
  outDir: string
  commentTag: string

  init(props: any) {
    merge(this, props)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'includes', 'excludes', 'includePattern', 'outDir', 'commentTag')
    if (!this.includes) this.includes = []
    if (!this.excludes) this.excludes = []
    if (this.includePattern) this.includePattern = new RegExp(this.includePattern.toString())
    this.includes = this.includes.map(p => this.proxy.resolvePath(p))
    this.excludes = this.excludes.map(p => this.proxy.resolvePath(p))
    this.outDir = this.proxy.resolvePath(this.outDir)
    if (!this.outDir) throw new Error(`"outDir" is required in ${this.constructor.name}`)
  }

  async exec() {
    this.proxy.logger.info('Scanning document...')
    const scanner = new Scanner(new Exporter(this.outDir), Parser)
    scanner.event.on('scanfile', path => {
      this.proxy.logger.debug('-', path)
    })
    await Promise.all(
      this.includes.map(async (inputPath: string) => {
        const SequenceParsers = await scanner.scanDir(inputPath, this.excludes, this.includePattern, this.commentTag)
        await Promise.all(
          SequenceParsers.map(parser => parser.parse())
        )
      })
    )
    await scanner.exporter.export(Parser.AllFunctions.filter(func => !func.name))
    this.proxy.logger.info(`Document is generated at ${this.outDir}`)
  }

}
