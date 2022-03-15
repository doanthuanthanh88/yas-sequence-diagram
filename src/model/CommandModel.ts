import { ControlModel } from './ControlModel';
import { SubjectInfor } from './SubjectInfor';

/**
 * Requests
 * @h2 ##
 * @order 3
 * @description Describle a request to other services.  
 * Example: HTTP requests, grpc requests...
 * @exampleType custom
 * @example
```typescript
/// NOTE OVER "Client", "App": Client send a request to App to create a new post

/// "Client" => "App": Create a new post
/// "Client" <= "App": Response 200
```

```mermaid
sequenceDiagram

NOTE OVER Client, App: Client send a request to App to create a new post
Client ->> App: Create a new post
App -->> Client: Response 200
```
 */

/**
 * Actions
 * @h2 ##
 * @order 3
 * @description Describle synchronized actions.  
 * Example: Insert into DB, Push a cache to redis...
 * @exampleType custom
 * @example
```typescript
/// NOTE OVER "MyService", "MongoDB": App create a new post into MongoDB

/// "MyService" > "MongoDB": Create a new post
/// "MyService" < "MongoDB": Done

/// NOTE OVER "MyService", "Redis": App push a new post into Redis cached

/// "MyService" > "Redis": Push post to cached
/// "MyService" < "Redis": Done
```

```mermaid
sequenceDiagram

NOTE OVER MyService, MongoDB: App create a new post into MongoDB
MyService ->> MongoDB: Create a new post
MongoDB -->> MyService: Done

NOTE OVER MyService, Redis: App push a new post into Redis cached
MyService ->> Redis: Push post to cached
Redis -->> MyService: Done
```
 */

/**
 * Publisher
 * @h2 ##
 * @order 3
 * @description Publish an async event via RabbitMQ, Kafka, Queue...
 * @exampleType custom
 * @example
```typescript
/// NOTE OVER "App", "RabbitMQ": App publish to RabbitMQ after creating done

/// "App" -> "RabbitMQ": Emit "post.created"

/// NOTE OVER "App", "App": App emit an event to global events

/// "App" -> "App": Emit "internal.post_created"
```

```mermaid
sequenceDiagram
NOTE OVER App, RabbitMQ: App publish to RabbitMQ after creating done
App -) RabbitMQ: Emit "post.created"

NOTE OVER App, App: App emit an event to global events
App -) App: Emit "internal.post_created"
```
 */

/**
 * Subscriber
 * @h2 ##
 * @order 3
 * @description Subscribe a queue in RabbitMQ, kafka, global event... to receive data
 * @exampleType custom
 * @example
```typescript
/// NOTE OVER "App", "RabbitMQ": App subscribe from RabbitMQ after creating done

/// "App" <- "RabbitMQ": Subscribe queue "post.created"

/// NOTE OVER "App", "App": App subscribe from global events

/// "App" -> "App": Subscribe internal queue "internal.post_created"
```

```mermaid
sequenceDiagram

NOTE OVER App, RabbitMQ: App subscribe from RabbitMQ after creating done
RabbitMQ --) App: Subscribe queue "post.created"

NOTE OVER App, App: App subscribe from global events
App --) App: Subscribe internal queue "internal.post_created"
```
 */
export class CommandModel extends ControlModel {
  private static readonly ACTIONS = ['>', '<', '->', '<-', '=>', '<='];
  subject: string;
  target: string;
  action: string;
  description: string;

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^"([^"]+)"\\s*(<-|->|<=|=>|>|<)\\s*"([^"]+)"\\s*\\:\\s*(.+)\\s*$`));
    if (!m)
      return null;
    const info = new CommandModel();
    info.subject = m[1].trim();
    info.target = m[3].trim();
    info.action = m[2];
    info.description = m[4]?.trim() || '';
    return info;
  }

  isRelease(_space: number) {
    return true;
  }

  private get mermaidAction() {
    switch (this.action) {
      case '>':
      case '=>':
        return '->>';
      case '<':
      case '<=':
        return '-->>';
      case '->':
        return '-)';
      case '<-':
        return '--)';
    }
  }

  toMMD(context: string, space?: number) {
    if (space !== undefined)
      this.space = space;
    const idx = CommandModel.ACTIONS.indexOf(this.action);
    if (idx !== -1) {
      const subject = this.subject.replace('$', context)
      const target = this.target.replace('$', context)
      if (idx % 2 === 1) {
        return `${this.tabString}${target} ${this.mermaidAction} ${subject}: ${this.description}`;
      }
      return `${this.tabString}${subject} ${this.mermaidAction} ${target}: ${this.description}`;
    }
  }

  getSubjects(context: string) {
    const subject = new SubjectInfor();
    subject.subject = this.subject === '$' ? context : this.subject;
    subject.target = this.target === '$' ? context : this.target;
    subject.action = this.action;
    return [subject];
  }

  getShapes(context: string) {
    const arr = new Set<string>()
    let subject = this.subject
    let target = this.target
    if (this.subject === '$') {
      subject = context
      arr.add(`1|Application|${subject}\0${subject}((${subject}))`)
    }
    if (this.target === '$') {
      target = context
      arr.add(`1|Application|${target}\0${target}((${target}))`)
    }
    if (this.action === '=>') {
      arr.add(`2|Other Services|${target}\0${target}[[${target}]]`)
    }
    arr.add(`9||${subject}\0${subject}`)
    arr.add(`9||${target}\0${target}`)
    // if (this.action === '<=') {
    //   arr.add(`${subject}([${subject}])`)
    // }
    return Array.from(arr)
  }

}
