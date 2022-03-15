import { SupportChildsModel } from './SupportChildsModel';

/**
 * Group
 * @h2 ##
 * @description Group of sequence steps
 * @exampleType custom
 * @example
```text
GROUP Description
  ...
```

```typescript
class AuthService {
  
  request() {
    /// GROUP Validate request
    function validate() {
      /// "Client" => "AuthService": Validate request
      this.authService.validate()
      /// "Client" <= "AuthService": Response 200
    }
    validate()
  }
}

```

```mermaid
sequenceDiagram

OPT Validate request
  App ->> AuthService: Validate request  
  AuthService -->> App: Response 200
END
```
 */
export class GroupModel extends SupportChildsModel {
  description: string;

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^(group)\\s*(.*)$`, 'i'));
    if (!m)
      return null;
    const model = new GroupModel();
    model.description = m[2]?.trim() || '';
    return model;
  }

  toMMD(context: string, space?: number) {
    const oldSpace = this.space
    if (space !== undefined)
      this.space = space;
    const mes = [];
    mes.push(`${this.tabString}OPT ${this.description}`);
    mes.push(...this.finalChilds.map(step => step.toMMD(context, this.space + step.space - oldSpace)));
    return mes.join('\n');
  }

}
