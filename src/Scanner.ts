import { statSync } from 'fs';
import { readdir } from 'fs/promises';
import { extname, join } from 'path';
import { EventEmitter } from 'stream';
import { Parser } from './Parser';
import { Exporter } from './Exporter';

export class Scanner {
  private static DefaultConfig = {
    '.js': {
      excludes: ['node_modules', 'dist'],
      commentTag: '///'
    },
    '.ts': {
      excludes: ['node_modules', 'dist'],
      commentTag: '///'
    },
    '.go': {
      excludes: [],
      commentTag: '///'
    },
    '.java': {
      excludes: ['bin', 'build'],
      commentTag: '///'
    },
    '.py': {
      excludes: ['__pycache__'],
      commentTag: '#/'
    },
    '.yaml': {
      excludes: [],
      commentTag: '#/'
    }
  }

  event: EventEmitter

  constructor(public exporter: Exporter, public ParserClass: new (...args) => Parser) {
    this.event = new EventEmitter()
  }

  async scanDir(dir: string, excludes?: string[], includePattern?: RegExp, commentTag?: string) {
    const names = await readdir(dir);
    const parsers = await Promise.all<Parser[]>(names.map(async (name) => {
      const path = join(dir, name);
      const st = statSync(path);

      if (st.isDirectory()) {
        if (!excludes?.find(ex => path.startsWith(ex))) {
          const commentModels = await this.scanDir(path, excludes, includePattern);
          return commentModels
        }
      }

      if (st.isFile() && includePattern?.test(name)) {
        this.event.emit('scanfile', path)
        if (!commentTag) {
          const df = Scanner.DefaultConfig[extname(path).toLowerCase()]
          if (!df) {
            throw new Error(`Need defined comment tag for ext "${extname(path)}"`)
          }
          commentTag = df.commentTag
          if (!excludes && df) {
            excludes = df.excludes
          }
        }
        const commentModel = await new this.ParserClass(path, commentTag)
        return [commentModel]
      }

      return [] as Parser[]
    })) as Parser[][]
    return parsers.flat()
  }
}
