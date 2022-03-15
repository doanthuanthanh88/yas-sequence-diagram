import { ControlModel } from './ControlModel';
import { SubjectInfor } from './SubjectInfor';

/**
 * Note
 * @h2 ##
 * @description Add notes in diagram
 * @exampleType custom
 * @example
```typescript
/// "User" => "Service": Send a request

/// NOTE LEFT OF "User": Note a left
/// NOTE RIGHT OF "User": Note a right
/// NOTE OVER "User", "Service": Note over all
```

```mermaid
sequenceDiagram
User ->> Service: Send a request

NOTE LEFT OF User: Note a left
NOTE RIGHT OF User: Note a right
NOTE OVER User, Service: Note over all
```
 */
export class NoteModel extends ControlModel {
  action: string
  description: string

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
    model.action = `${m[1].toUpperCase()} ${m[3]?.replace(/"/g, "")}`;
    model.description = m[4]?.trim() || '';
    return model;
  }

  toMMD(_context: string, space?: number) {
    if (space !== undefined)
      this.space = space;
    return `${this.tabString}${this.action}: ${this.description}`
  }

}
