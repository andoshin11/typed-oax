import * as ts from 'typescript'
import { SchemaObject } from 'openapi3-ts'
import { mapTS, SchemaToAST } from '@squelette/core'

export const createModelType = (name: string, schema: SchemaObject) => {
  const TSSchema = mapTS(schema)
  const ast = SchemaToAST(TSSchema)

  const res = ts.createTypeAliasDeclaration(
    undefined,
    undefined,
    ts.createIdentifier(name),
    undefined,
    ast 
  )

  return res
}
