import { ControlModel } from './ControlModel';
import { SubjectInfor } from './SubjectInfor';

/**
 * Requests
 * @h2 ##
 * @order 3
 * @description Describle a request to other services. (HTTP requests, grpc requests...)
 * @exampleType custom
 * @example

- Service1 send a request(http, grpc...) to Service2(Other Services)
  ```text
    "Service1" => "Service2: Description"
  ```

- After Service2(Other Services) done, it response to Service1
  ```text
    "Service1" <= "Service2: Description"
  ```

### Example:

Input:

```typescript
class PostController {
  createPost(post: Post) {
    /// "Client" => "$": Create a new post

    /// "$" => "PostService": Create a new post
    this.postService.create(post)
    /// "$" <= "PostService": Return Post
    
    /// "Client" <= "$": Response 200
  }
}

```

Output:

```mermaid
sequenceDiagram

Client ->> App: Create a new post
App ->> PostService: Create a new post
PostService -->> App: Return Post
App -->> Client: Response 200
```
 */

/**
 * Actions
 * @h2 ##
 * @order 3
 * @description Describle synchronized actions. (Insert into DB, Push a cache to redis...)
 * @exampleType custom
 * @example
- Service1 call Component1(DB, itself...) to do something
  ```text
    "Service1" > "Component1": Description
  ```
- After Component1(DB, itself...) done, it returns something to Service1
  ```text
    "Service1" < "Component1": Description
  ```

Example:

Input: 

```typescript
class PostService {
  createPost(post: Post) {
    /// "MyService" > "MongoDB": Create a new post
    await this.mongoDB.insert(post)
    /// "MyService" < "MongoDB": Done

    /// "MyService" > "Redis": Push post to cached
    await this.redis.push(post)
    /// "MyService" < "Redis": Done
  }
}

```

Output:

```mermaid
sequenceDiagram

MyService ->> MongoDB: Create a new post
MongoDB -->> MyService: Done

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
- Service1 publish/emit data to Component1(MessageQueue, EventEmiter...) to do something
  ```text
    "Service1" -> "Component1": Description
  ```

### Example:

Input: 

```typescript

class GlobalEvent {
  postCreated(post: Post) {
    /// "$" -> "RabbitMQ": Emit "post.created"
    await this.rabbitMQ.publish('post.created', post)

    /// "$" -> "$": Emit "internal.post_created"
    await this.event.emit('internal.post_created', post)
  }
}
```

Output:

```mermaid
sequenceDiagram
App -) RabbitMQ: Emit "post.created"

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
- Service1 subscribe/on data from Component1(MessageQueue, EventEmiter...) to do something
  ```text
    "Service1" <- "Component1": Description
  ```

### Example

Input:

```typescript

class GlobalEvent {

  /// [] Subscribe from global
  onGlobalPostCreated(post: Post) {
    /// "$" <- "RabbitMQ": Subscribe queue "post.created"
  }

  /// [] Subscribe from internal
  onInternalPostCreated(post: Post) {
    /// "$" -> "$": Subscribe internal queue "internal.post_created"
  }
  
}
```

Output:


File `Subscribe from global.md`

```mermaid
sequenceDiagram

RabbitMQ --) App: Subscribe queue "post.created"

```

File `Subscribe from internal.md`

```mermaid
sequenceDiagram

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
