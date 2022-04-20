import { ControlModel } from './ControlModel';
import { SubjectInfor } from './SubjectInfor';

/*****
 * @name Note
 * @h2 ##
 * @description Add notes in diagram
 * @exampleType custom
 * @example
- Note a left of Service1
```text
NOTE LEFT OF "Service1": Description
```
- Note a right of Service2
```text
NOTE RIGHT OF "Service2": Description
```
- Note over Service1 and Service 2
```text
NOTE OVER "Service1", "Service2": Description
```

### Example

Input:

```typescript
class ServiceController {

  sendRequest() {
    /// NOTE LEFT OF "Service1": Note a left
    /// NOTE RIGHT OF "Service2": Note a right
    /// NOTE OVER "Service1", "Service2": Note over all
  }
}
```

Output:

```mermaid
sequenceDiagram
Service1 ->> Service2: Send a request

NOTE LEFT OF Service1: Note a left
NOTE RIGHT OF Service2: Note a right
NOTE OVER Service1, Service2: Note over all
```
*/
export class NoteModel extends ControlModel {
  action: string
  description: string
  subjects: string[]

  constructor() {
    super()
    this.subjects = []
  }

  isRelease(_space: number): boolean {
    return true
  }

  getSubjects(_context: string): SubjectInfor[] {
    return []
  }

  getShapes(_context: string): string[] {
    return []
  }

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^(note\\s+(right of|left of|over))\\s+([^\\:]+)\\s*:\\s*(.*)$`, 'i'));
    if (!m)
      return null;
    const model = new NoteModel();
    model.action = m[1].toUpperCase()
    model.subjects = m[3].split(',').map(e => e.replace(/(^")|("$)/g, "").trim())
    model.description = m[4]?.trim() || '';
    return model;
  }

  toMMD(context: string, space?: number) {
    if (space !== undefined)
      this.space = space;
    return `${this.tabString}${this.action} ${this.subjects.map(e => e === '$' ? context : e).join(',')}: ${this.description}`
  }

}
