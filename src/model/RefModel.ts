import { cloneDeep } from 'lodash';
import { ControlModel } from './ControlModel';
import { Parser } from '../Parser';

/**
 * Reference function
 * @h2 ##
 * @order 2
 * @description Define a function which will be called in other funtions
 * @exampleType custom
 * @example
```typescript
/// [](App) Create a new user
///   GROUP Reference to requestUser
///     [requestUser]

/// [requestUser]
///   "Client" => "$": Request to create new user
```

File `Create a new user.md`
```mermaid
sequenceDiagram

Client ->> App: Request to create new user
```

 */
export class RefModel extends ControlModel {
  name: string;

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^\\[([^\\]\\s]+)\\]$`));
    if (!m)
      return null;
    const func = new RefModel();
    func.name = m[1].trim();
    return func;
  }

  isRelease(_space: number) {
    return true;
  }

  toMMD(context: string, space?: number) {
    if (space !== undefined)
      this.space = space;
    const func = Parser.AllFunctions.find(func => func.name === this.name);
    if (!func)
      throw new Error(`Not declared function "${this.name}" yet`);
    const newFunc = cloneDeep(func);
    // newFunc.space = this.space;
    return newFunc.toMMD(context, this.space);
  }

  getSubjects(context: string) {
    const func = Parser.AllFunctions.find(func => func.name === this.name);
    if (!func)
      throw new Error(`Not declared function "${this.name}" yet`);
    return func.getSubjects(context);
  }

  getShapes(context: string): string[] {
    const func = Parser.AllFunctions.find(func => func.name === this.name);
    if (!func)
      throw new Error(`Not declared function "${this.name}" yet`);
    return func.getShapes(context);
  }
}
