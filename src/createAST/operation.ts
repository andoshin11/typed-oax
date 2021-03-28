import * as ts from 'typescript'
import { IOperation, SchemaToAST, HTTPMethod } from '@squelette/core'

// receive multiple operations for the same path
export const createOperationsAST = (operations: IOperation[]) => {
  const path = operations[0].path

  // /shops/{shopId}/pets/{petId} -> /shops/:shopId/pets/:petId
  const pathLiteral = path.replace(/\{([^{}]*)\}/gi, ':$1')

  // /shops/{shopId}/pets/{petId} -> ['shopId', 'petId']
  const pathParameters = (path.match(/\{([^{}]*)\}/gi) || []).map(r => r.slice(1, r.length-1))

  /**
   * generates path maps
   * 
   * ex: /shops/{shopId}/pets/{petId}
   * 
   * {
   *   shopId: string;
   *   petId: string
   * }
   */
  const pathType: ts.TypeElement[] = pathParameters.map(p => {
    return ts.createPropertySignature(
      undefined,
      ts.createIdentifier(p),
      undefined,
      ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      undefined
    )
  })

  const opsByMethod = operations.reduce((acc, ac) => {
    acc[ac.method] = ac
    return acc
  }, {} as Record<HTTPMethod | 'all', IOperation>)

  /**
   * generates query type
   */
  const createQueryAst = (ops: IOperation | undefined) => !ops || !ops.queryParameter ? ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier("ParsedQs"),
    undefined
  ) : SchemaToAST(ops.queryParameter)

  const createQueryPropertySignature = (method: HTTPMethod | 'all') => ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(method),
    undefined,
    createQueryAst(opsByMethod[method])
  )
  const queryTeypParameter = ts.factory.createIndexedAccessTypeNode(
    ts.factory.createTypeLiteralNode([
      createQueryPropertySignature('all'),
      createQueryPropertySignature('get'),
      createQueryPropertySignature('post'),
      createQueryPropertySignature('put'),
      createQueryPropertySignature('delete'),
      createQueryPropertySignature('options'),
      createQueryPropertySignature('head'),
      createQueryPropertySignature('patch')
    ]),
    ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Method'),
      undefined
    )
  )

  /**
   * generates request body type
   */
  const createReqBodyAst = (ops: IOperation | undefined) => !ops || !ops.requestBody ? ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword) : SchemaToAST(ops.requestBody)
  const createReqPropertySignature = (method: HTTPMethod | 'all') => ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(method),
    undefined,
    createReqBodyAst(opsByMethod[method])
  )
  const reqBodyTypeParameter = ts.factory.createIndexedAccessTypeNode(
    ts.factory.createTypeLiteralNode([
      createReqPropertySignature('all'),
      createReqPropertySignature('get'),
      createReqPropertySignature('post'),
      createReqPropertySignature('put'),
      createReqPropertySignature('delete'),
      createReqPropertySignature('options'),
      createReqPropertySignature('head'),
      createReqPropertySignature('patch')
    ]),
    ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Method'),
      undefined
    )
  )

  /**
   * generates response body type
   */
  const createResBodyAst = (ops: IOperation | undefined) => !ops || !ops.response ? ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword) : SchemaToAST(ops.response)
  const createResPropertySignature = (method: HTTPMethod | 'all') => ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(method),
    undefined,
    createResBodyAst(opsByMethod[method])
  )
  const resBodyTypeParameter = ts.factory.createIndexedAccessTypeNode(
    ts.factory.createTypeLiteralNode([
      createResPropertySignature('all'),
      createResPropertySignature('get'),
      createResPropertySignature('post'),
      createResPropertySignature('put'),
      createResPropertySignature('delete'),
      createResPropertySignature('options'),
      createResPropertySignature('head'),
      createResPropertySignature('patch')
    ]),
    ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Method'),
      undefined
    )
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
      resBodyTypeParameter
    ),
    ts.createTypeParameterDeclaration(
      ts.createIdentifier("ReqBody"),
      undefined,
      reqBodyTypeParameter
    ),
    ts.createTypeParameterDeclaration(
      ts.createIdentifier("ReqQuery"),
      undefined,
      queryTeypParameter
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
            ),
            ts.createTypeReferenceNode(
              ts.createIdentifier("ReqQuery"),
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
