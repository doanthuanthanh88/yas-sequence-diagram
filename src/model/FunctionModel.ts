import { escape } from 'querystring';
import { ControlModel } from './ControlModel';

/**
 * Startup function
 * @h2 ##
 * @order 1
 * @description Each of startup function will be generate to a single sequence diagram file
 * @exampleType custom
 * @example
```typescript
/// [](App) Create a new user
///   "Client" => "$": Request to create new user
```

File `Create a new user.md`
```mermaid
sequenceDiagram

Client ->> App: Request to create new user
```

```typescript
/// [](Worker) Consume from RabbitMQ
///   "$" <= "RabbitMQ": Consume queue user.created
///   "$" > "$": Do something here
```

File `Consume from RabbitMQ.md`
```mermaid
sequenceDiagram

RabbitMQ --) Worker: Consume queue user.created
Worker ->> Worker: Do something here
```
 */
export class FunctionModel extends ControlModel {
  name?: string;
  description: string;

  get filename() {
    return escape(this.description)
  }

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^\\[([^\\]\\s]*)\\]\\s*(\\(([^\\)]+)\\))?(\\s(.+))?`));
    if (!m)
      return null;
    const model = new FunctionModel();
    model.description = m[5]?.trim();
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
    const mes = [`${this.tabString}%% [${this.name || ''}] ${this.description || ''}`];
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
