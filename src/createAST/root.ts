import * as ts from 'typescript'

export const createRootAST = (operations: ts.TypeElement[], models: ts.Statement[]) => {
  return [
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports([ts.createImportSpecifier(
          undefined,
          ts.createIdentifier("RequestHandler")
        )]),
        false
      ),
      ts.createStringLiteral("express")
    ),
    ts.createModuleDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.DeclareKeyword)],
      ts.createStringLiteral("express-serve-static-core"),
      ts.createModuleBlock([...models, ts.createInterfaceDeclaration(
        undefined,
        [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.createIdentifier("IRouterMatcher"),
        [ts.createTypeParameterDeclaration(
          ts.createIdentifier("T"),
          undefined,
          undefined
        )],
        undefined,
        operations
      )]),
      ts.NodeFlags.ContextFlags
    )
  ]
}
