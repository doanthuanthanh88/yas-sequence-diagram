import { escape } from 'querystring';
import { ControlModel } from './ControlModel';
import { GroupModel } from './GroupModel';

/**
 * Startup function
 * @h2 ##
 * @order 1
 * @description Each of startup function will be generated to a single sequence diagram file
 * @exampleType custom
 * @example
- A new sequence diagram will describe this function. (Context default is App)
  ```text
    [] Description
  ```
- A startup function with a context.
  ```text
    []{Context} Description
  ```

What's `Context`:  
> There are 2 contexts in app.  
> The first is Worker, the second is ApiServer  
> A function is used in Worker and ApiServer.  
> So you can pass Worker, or API Server into context to make sequence diagram describe it  

### Example

Input:

```typescript
class UserController {
  /// [](App) Create a new user
  createUserRoute() {
    /// "Client" => "$": Request to create new user
  }
}
```

Output:  
File `Create a new user.md` will be generated

```mermaid
sequenceDiagram

Client ->> App: Request to create new user
```

Input:

```typescript
class Worker {
  /// [](Worker) Consume from RabbitMQ
  onUserCreated(user: User) {
    /// "$" <= "RabbitMQ": Consume queue user.created

    /// "$" > "$": Print user data
    console.log(user)
    ...
  }
}
```

Output:  
File `Consume from RabbitMQ.md` will be generated

```mermaid
sequenceDiagram

RabbitMQ --) Worker: Consume queue user.created
Worker ->> Worker: Print user data
```
 */
export class FunctionModel extends ControlModel {
  name?: string;
  description: string;

  get filename() {
    return escape(this.description)
  }

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^\\[([^\\]\\s]*)?\\]\\s*(\\(([^\\)]+)\\))?(.*)?`));
    if (!m)
      return null;
    if (txt === '[UserService.emitCreateUserEvent] Emit event') debugger
    const model = new FunctionModel();
    model.description = m[4]?.trim();
    model.name = m[1]?.trim();
    model.context = m[3]?.trim();
    return model;
  }

  isRelease(space: number) {
    return this.space >= space;
  }

  toMMD(context: string, space?: number) {
    const oldSpace = this.space
    if (space !== undefined)
      this.space = space;
    const mes = [`${this.tabString}%% [${this.name || ''}]`];
    if (this.description && this.childs.length) {
      const gm = new GroupModel()
      gm.description = this.description
      gm.context = this.context
      gm.addChild(...this.getChilds())
      gm.space = this.childs[0].space
      this.childs = [gm]
    }
    mes.push(...this.finalChilds.map(step => step.toMMD(context, this.space + step.space - 2 * oldSpace)));
    return mes.join('\n');
  }

  getSubjects(context: string) {
    return this.childs?.map(child => child.getSubjects(context)).flat();
  }

  getShapes(context: string) {
    return this.childs?.map(child => child.getShapes(context)).flat()
  }

}
