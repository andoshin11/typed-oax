import * as ts from 'typescript'

export const createRootAST = (operations: ts.TypeElement[], models: ts.Statement[]) => {
  return [
    // ts.createImportDeclaration(
    //   undefined,
    //   undefined,
    //   ts.createImportClause(
    //     undefined,
    //     ts.createNamedImports([ts.createImportSpecifier(
    //       undefined,
    //       ts.createIdentifier("RequestHandler")
    //     )]),
    //     false
    //   ),
    //   ts.createStringLiteral("express")
    // ),
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports([ts.createImportSpecifier(
          undefined,
          ts.createIdentifier("ParsedQs")
        )]),
        false
      ),
      ts.createStringLiteral("qs")
    ),
    ts.createModuleDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.DeclareKeyword)],
      ts.createStringLiteral("express-serve-static-core"),
      ts.createModuleBlock([
        ...models,

        ts.createInterfaceDeclaration(
        undefined,
        [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.createIdentifier("IRouterMatcher"),
        [
          ts.createTypeParameterDeclaration(
            ts.createIdentifier("T"),
            undefined,
            undefined
          ),
          ts.createTypeParameterDeclaration(
            ts.createIdentifier("Method"),
            ts.createUnionTypeNode([
              ts.createLiteralTypeNode(ts.createStringLiteral("all")),
              ts.createLiteralTypeNode(ts.createStringLiteral("get")),
              ts.createLiteralTypeNode(ts.createStringLiteral("post")),
              ts.createLiteralTypeNode(ts.createStringLiteral("put")),
              ts.createLiteralTypeNode(ts.createStringLiteral("delete")),
              ts.createLiteralTypeNode(ts.createStringLiteral("patch")),
              ts.createLiteralTypeNode(ts.createStringLiteral("options")),
              ts.createLiteralTypeNode(ts.createStringLiteral("head"))
            ]),
            ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
          )
        ],
        undefined,
        operations
      )]),
      ts.NodeFlags.ContextFlags
    )
  ]
}
