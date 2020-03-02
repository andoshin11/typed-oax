import * as ts from 'typescript'

const printer = ts.createPrinter()

export function printList(nodeList: ts.Node[]) {
  return printer.printList(
    ts.ListFormat.MultiLine,
    ts.createNodeArray(nodeList),
    ts.createSourceFile('', '', ts.ScriptTarget.ES2015)
  )
}
