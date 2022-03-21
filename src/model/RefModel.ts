import cloneDeep from 'lodash.clonedeep';
import { ControlModel } from './ControlModel';
import { Parser } from '../Parser';

/**
 * @guide
 * @name Reference function
 * @h2 ##
 * @order 2
 * @description Define a function which will be called in other funtions
 * @exampleType custom
 * @example
- Ref to steps in this function
  ```text
    [Function_Name]
  ```
- Create a group contains steps in this function
  ```text
    [Function_Name] Description
  ```

### Example

Input:

```typescript
class UserController {

  /// [](App) Create a new user
  async createUser() {

    /// [requestClass] 
    await this.requestClass()

    /// [requestUser] This function handle user creating
    await this.requestUser()
  }

  /// [requestClass] 
  private requestClass() {
    /// "Client" => "$": Request to create a new class
  }

  /// [requestUser]
  private requestUser() {
    /// "Client" => "$": Request to create a new user
  }
}

```

Output:

```mermaid
sequenceDiagram

Client ->> App: Request to create a new class

OPT This function handle user creating
  Client ->> App: Request to create new user
END
```
 * @end
 */
export class RefModel extends ControlModel {
  name: string;
  description?: string

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^\\[([^\\]\\s]+)\\](.*)$`));
    if (!m)
      return null;
    const func = new RefModel();
    func.name = m[1].trim();
    func.description = m[2]?.trim()
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
    newFunc.description = this.description || newFunc.description
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
