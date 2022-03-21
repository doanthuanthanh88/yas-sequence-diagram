import { RefModel } from './RefModel';
import { SupportChildsModel } from './SupportChildsModel';

/**
 * @guide
 * @name Parallel
 * @h2 ##
 * @description Describle parallel jobs
 * @exampleType custom
 * @example
```text
PAR Job1
  ...
AND Job2
  ...
```

### Example

Input:

```typescript
class Login {
  login() {
    Promise.all([
      /// PAR Login user
      ///   "App" => "AuthService": Send a login request
      this.authService.login(),

      /// AND Emit an event to globals 
      ///   "App" -> "RabbitMQ": Emit "user.login"
      this.rabbitMQ.publish()
    ])
  }
}
```

Output: 

```mermaid
sequenceDiagram

PAR Login user
  App ->> AuthService: Send a login request
  AuthService -->> App: Response OK
AND Fire an event to globals 
  App -) RabbitMQ: Emit "user.login"
END
```

Input

```typescript
class Login {
  login() {
    /// PAR
    Promise.all([
      /// [login] Login user
      this.authService.login(),
      /// [publishUserLogin] Emit an event to globals 
      this.publishUserLogin()
    ])
  }

  /// [login]
  private login() {
    /// "App" => "AuthService": Send a login request
    this.authService.login(),
  }

  /// [publishUserLogin]
  private publishUserLogin() {
    /// "App" -> "RabbitMQ": Emit "user.login"
    this.rabbitMQ.publish()
  }
}
```

Output: 

```mermaid
sequenceDiagram

PAR Login user
  App ->> AuthService: Send a login request
  AuthService -->> App: Response OK
AND Fire an event to globals 
  App -) RabbitMQ: Emit "user.login"
END
```
 * @end
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

  override applyChilds() {
    const childs = this.childs
      .filter(child => child instanceof RefModel)
      .map((child: RefModel, i) => {
        const p = new ParallelModel()
        p.action = i === 0 ? 'PAR' : 'AND'
        p.addChild(child)
        p.space = this.space
        p.context = this.context
        p.description = child.description
        return p
      })
    if (childs.length === this.childs.length) {
      this.parent.getChilds().splice(this.parent.getChilds().indexOf(this), 1, ...childs)
    }
  }

}
