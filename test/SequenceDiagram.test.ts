import { join } from "path"
import { Simulator } from "yaml-scene/src/Simulator"

describe('Unit test extension', () => {

  test('Test extension', async () => {
    await Simulator.Run(`
extensions:
  - ${require.resolve('../src/SequenceDiagram')}
steps:
  - SequenceDiagram:
      commentTag: ///
      includes: 
        - ${join(__dirname, 'resources')}
      excludes: []
      includePattern: ".+\.ts$"
      outDir: ${join(__dirname, 'resources/result')}
`, undefined)
  })
})
