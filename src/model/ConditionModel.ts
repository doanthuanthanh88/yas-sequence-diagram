import { SupportChildsModel } from './SupportChildsModel';

/**
 * Conditional
 * @h2 ##
 * @description Describe If then else then...
 * @exampleType custom
 * @example
```typescript
/// "Client" => "App": Send a request
/// IF Request is not authenticated
///   "Client" <= "App": Response 401
/// ELSE IF Request is not valid
///   "Client" <= "App": Response 400
/// ELSE
///   "App" > "App": Do something...
///   "Client" <= "App": Response 200
```

```mermaid
sequenceDiagram

Client ->> App: Send a request
ALT Request is not authenticated
  App -->> Client: Response 401
ELSE Request is not valid
  App -->> Client: Response 400
ELSE
  App ->> App: Do something...
  App -->> Client: Response 200
END
```
 */
export class ConditionModel extends SupportChildsModel {
  action: string;
  description: string;

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^(else if|if|else)\\s*(.*)$`, 'i'));
    if (!m)
      return null;
    const model = new ConditionModel();
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
      case 'IF':
        mes.push(`${this.tabString}ALT ${this.description}`);
        break;
      case 'ELSE IF':
      case 'ELSE':
        mes.push(`${this.tabString}ELSE ${this.description}`);
        break;
    }
    mes.push(...this.finalChilds.map(step => step.toMMD(context, this.space + step.space - oldSpace)));
    return mes.join('\n');
  }

}
