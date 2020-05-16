import { IOperation } from '@squelette/core'

export const groupByPath = (operations: IOperation[]) => {
  const hash = operations.reduce((acc, ac) => {
    acc[ac.path] = [...(acc[ac.path] || []), ac]
    return acc
  }, {} as { [path: string]: IOperation[] })

  return hash
}
