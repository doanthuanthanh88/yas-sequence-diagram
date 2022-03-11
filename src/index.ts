// import { join } from "path"
// import { Simulator } from "yaml-scene/src/Simulator"

export { SequenceDiagram } from "./SequenceDiagram"

// (async () => {
//   await Simulator.Run(`
//   logLevel: debug
//   extensions:
//     - ${require.resolve('./SequenceDiagram')}
//   steps:
//     - SequenceDiagram:
//         includes: 
//           - ${join(__dirname, '../test/resources')}
//         excludes: []
//         includePattern: ".+\.ts$"
//         outDir: ${join(__dirname, '../test/resources/result')}
//   `, undefined)
// })()