import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import * as prettier from 'prettier'
import { parse } from '@squelette/core'
import { printList } from './utils/print'
import { createAST } from './createAST'

async function main() {
  const file = fs.readFileSync(path.resolve(__dirname, '../petstore.yml'), 'utf-8')
  const yaml = YAML.safeLoad(file)
  const parsed = parse(yaml)
  console.log(parsed)

  const rootAST = createAST(parsed)

  const pretty = prettier.format(printList(rootAST), { parser: 'typescript' })
  // console.log(pretty)

  fs.writeFileSync(path.resolve(__dirname, '../src/petstore.d.ts'), pretty)
}

main()
