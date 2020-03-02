import * as ts from 'typescript'
import { IOperation } from '@squelette/core'

// receive multiple operations for the sam path
export const createOperationsAST = (operations: IOperation[]) => {
  const path = operations[0].path

  const pathLiteral = path.replace(/\{([^{}]*)\}/gi, ':$1')
  const pathParameters = (path.match(/\{([^{}]*)\}/gi) || []).map(r => r.slice(1, r.length-1))

  const pathType: ts.TypeElement[] = pathParameters.map(p => {
    return ts.createPropertySignature(
      undefined,
      ts.createIdentifier(p),
      undefined,
      ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      undefined
    )
  })

  const reqBodyTypeParameter = ts.createUnionTypeNode(
    operations.map((_, i) => {
      return ts.createTypeLiteralNode([
        ts.createPropertySignature(
          undefined,
          ts.createIdentifier("msg"),
          undefined,
          ts.createLiteralTypeNode(ts.createNumericLiteral(String(i))),
          undefined
        )
      ])
    })
  )

  const typeParameters: ts.TypeParameterDeclaration[] = [
    ts.createTypeParameterDeclaration(
      ts.createIdentifier("P"),
      ts.createTypeReferenceNode(
        ts.createIdentifier("Params"),
        undefined
      ),
      !!pathParameters.length ?
        ts.createTypeLiteralNode(pathType) :
        ts.createTypeReferenceNode(
          ts.createIdentifier("ParamsDictionary"),
          undefined
        )
    ),
    ts.createTypeParameterDeclaration(
      ts.createIdentifier("ResBody"),
      undefined,
      ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
    ),
    ts.createTypeParameterDeclaration(
      ts.createIdentifier("ReqBody"),
      undefined,
      reqBodyTypeParameter
    )
  ]

  return createOperationDeclaration(pathLiteral, typeParameters)
}

export const createOperationDeclaration = (path: string, typeParameters: ts.TypeParameterDeclaration[]) => {
  const parameters: ts.ParameterDeclaration[] = [
    ts.createParameter(
      undefined,
      undefined,
      undefined,
      ts.createIdentifier("path"),
      undefined,
      ts.createLiteralTypeNode(ts.createStringLiteral(path)),
      undefined
    ),
    ts.createParameter(
      undefined,
      undefined,
      ts.createToken(ts.SyntaxKind.DotDotDotToken),
      ts.createIdentifier("handlers"),
      undefined,
      ts.createTypeReferenceNode(
        ts.createIdentifier("Array"),
        [ts.createTypeReferenceNode(
          ts.createIdentifier("RequestHandler"),
          [
            ts.createTypeReferenceNode(
              ts.createIdentifier("P"),
              undefined
            ),
            ts.createTypeReferenceNode(
              ts.createIdentifier("ResBody"),
              undefined
            ),
            ts.createTypeReferenceNode(
              ts.createIdentifier("ReqBody"),
              undefined
            )
          ]
        )]
      ),
      undefined
    )
  ]

  return ts.createCallSignature(
    typeParameters,
    parameters,
    ts.createTypeReferenceNode(
      ts.createIdentifier("T"),
      undefined
    )
  )
}
