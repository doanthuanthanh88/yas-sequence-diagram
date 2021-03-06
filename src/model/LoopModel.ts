import { SupportChildsModel } from './SupportChildsModel';

/*****
 * @name Loop
 * @h2 ##
 * @description Scan all of items in list
 * @exampleType custom
 * @example
```text
LOOP Items
  ...
```

### Example

Input:

```typescript
class Product {
  scan(products: Product[]) {

    /// LOOP List products
    for (const product of products) {
      /// "App" => "ProductService": Get a product details
      const productInfo = await this.productService.get(product.id)
      /// "App" <= "ProductService": Response a product information
    }
  }
}
```

Output:

```mermaid
sequenceDiagram

LOOP List products
  App ->> ProductService: Get a product details
  ProductService -->> App: Response a product information
END
```
*/
export class LoopModel extends SupportChildsModel {
  description: string;

  static Match(txt: string) {
    const m = txt.match(new RegExp(`^(loop)\\s*(.*)$`, 'i'));
    if (!m)
      return null;
    const model = new LoopModel();
    model.description = m[2]?.trim() || '';
    return model;
  }

  toMMD(context: string, space?: number) {
    const oldSpace = this.space
    if (space !== undefined)
      this.space = space;
    const mes = [];
    mes.push(`${this.tabString}LOOP ${this.description}`);
    mes.push(...this.finalChilds.map(step => step.toMMD(context, this.space + step.space - oldSpace)));
    return mes.join('\n');
  }

}
