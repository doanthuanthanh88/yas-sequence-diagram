import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { FunctionModel } from './model/FunctionModel';

export class Parser {
  static readonly AllFunctions = new Array<FunctionModel>()
  private currentFunction: FunctionModel

  constructor(public file: string, public commentTag: string) {
  }

  parse() {
    return new Promise((resolve, reject) => {
      const rl = createInterface({ input: createReadStream(this.file) });
      rl.on('line', (txt) => {
        this.onEachLine(txt);
      });
      rl.on('error', reject);
      rl.on('close', () => {
        resolve(undefined);
      });
    });
  }

  onEachLine(txt: string) {
    const mLine = txt.match(new RegExp(`^(\\s*)${this.commentTag}\\s(\\s*)(.+)$`))
    if (mLine) {
      const txt = mLine[3].trim()
      const space = (mLine[1] + mLine[2]).length

      if (this.currentFunction?.isRelease(space)) this.currentFunction = null

      if (!this.currentFunction) {
        const functionModel = FunctionModel.Match(txt)
        if (functionModel) {
          functionModel.space = space
          this.currentFunction = functionModel
          Parser.AllFunctions.push(functionModel)
        }
      } else if (this.currentFunction) {
        this.currentFunction.match(txt, space)
      }

    }
  }

}
