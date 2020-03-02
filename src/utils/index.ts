import { IOperation, ITag } from '@squelette/core'

export const tagToOperationList = (data: ITag) => {
  return Object.values(data).reduce((acc, ac) => [...acc, ...ac], [] as IOperation[])
}

export const groupByPath = (operations: IOperation[]) => {
  const hash = operations.reduce((acc, ac) => {
    acc[ac.path] = [...(acc[ac.path] || []), ac]
    return acc
  }, {} as { [path: string]: IOperation[] })

  return hash
}
