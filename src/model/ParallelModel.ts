import { SupportChildsModel } from './SupportChildsModel';

/**
 * Parallel
 * @h2 ##
 * @description Describle parallel jobs
 * @exampleType custom
 * @example
```typescript
/// PAR Login user
///   "App" => "AuthService": Send a login request
/// AND Emit an event to globals 
///   "App" -> "RabbitMQ": Emit "user.login"
```

```mermaid
sequenceDiagram

PAR Login user
  App ->> AuthService: Send a login request
  AuthService -->> App: Response OK
AND Fire an event to globals 
  App -) RabbitMQ: Emit "user.login"
END
```
 */
export class ParallelModel extends SupportChildsModel {
  action: string;
  description: string;

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^(parallel|par|and)\\s*(.*)$`, 'i'));
    if (!m)
      return null;
    const model = new ParallelModel();
    model.action = m[1].toUpperCase();
    model.description = m[2]?.trim() || '';
    return model;
  }

  toMMD(context: string, space?: number) {
    const oldSpace = this.space
    if (space !== undefined)
      this.space = space;
    const mes = [];
    switch (this.action) {
      case 'PARALLEL':
      case 'PAR':
        mes.push(`${this.tabString}PAR ${this.description}`);
        break;
      case 'AND':
        mes.push(`${this.tabString}AND ${this.description}`);
        break;
    }
    mes.push(...this.finalChilds.map(step => step.toMMD(context, this.space + step.space - oldSpace)));
    return mes.join('\n');
  }

}
