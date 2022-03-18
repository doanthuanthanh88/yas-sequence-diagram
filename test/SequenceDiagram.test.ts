import { join } from "path"
import { Simulator } from "yaml-scene/src/Simulator"

test('Test Sequence Diagram', async () => {
  await Simulator.Run(`
extensions:
  yas-sequence-diagram: ${require.resolve('../src')}
steps:
  - yas-sequence-diagram:
      commentTag: ///
      includes: 
        - ${join(__dirname, 'resources')}
      excludes: []
      includePattern: ".+\.ts$"
      outDir: ${join(__dirname, 'resources/result')}
`)
})
