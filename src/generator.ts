import * as fs from 'fs'
import * as path from 'path'
import * as prettier from 'prettier'
import { OpenAPIObject } from 'openapi3-ts'
import { printList } from './utils/print'
import { createAST } from './createAST'

export interface GeneratorOptions {
  dist: string
}

export class Generator {
  constructor(private spec: OpenAPIObject, private options: GeneratorOptions) {}

  get dist(): string {
    return path.resolve(process.cwd(), this.options.dist)
  }

  generate() {
    if (this.spec.openapi !== '3.0.0') {
      throw new Error(
        `Only 3.0.0 is supported. Your version: ${this.spec.openapi}`
      )
    }

    // Setup dist
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist)
    }

    const ast = createAST(this.spec)
    const pretty = prettier.format(printList(ast), { parser: 'typescript' })

    // Output
    fs.writeFileSync(path.resolve(this.dist, 'express.d.ts'), pretty)
  }
}
