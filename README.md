# yas-sequence-diagram
A Yaml-scene extension which generate sequence diagrams from comment line in code

# Implementation

Example [Translator](./src/Translator.ts)

```ts
  export class YourExtension implements IElement { 
    // Proxy object which provides some utils functions (logger...)
    proxy?: ElementProxy<any>
    async?: boolean
    delay?: number

    // Init properties from yaml to object
    init?(props: any){}

    // Prepare data, replace data value before executing
    prepare?(){}

    // Execute main flow
    exec?(){}

    // After executed done need dispose object
    dispose?(){}

    // Clone new object in loop or template...
    clone?(){}
  }
```

# Write document
The project support auto generate document base on comment line in code.

1. Write extension information

    ```js
    /**
     * yaml-scene-extension~Translator
    * @description Translate hello text to vietnamese
    * @group extension
    * @order 
    * @example
    - yaml-scene-extension~Translator:
        text: hello
        var: result
    - Echo: ${result}
    */
    export class Translator implements IElement { ... }
    ```

2. Run `yarn run doc` or `npm run doc` 
3. A file `GUIDE.md` will be generate to root folder

# Test extension via jest
The project use `jest` to test project.

1. Write testing files to `test/`.  
2. Run `yarn test` or `npm test` to test

# Test extension via yaml-scene
The project allow inject extension into yaml-scene global.

1. Create a scenario file at `scenes/test/your_extension.yaml`
2. Register your extension to yaml-scene
    ```yaml
    extensions:
      - ../../dist/src/Your_Extension        # Register a new extension
    ```
3. Call your extension
    ```yaml
      - Your_Extension:
          prop1: hello
          prop2: vi
          var: yourVar
    ```
4. Run test
    ```sh
      yas scenes/test/your_extension.yaml
    ```