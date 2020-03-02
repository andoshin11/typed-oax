import { ITag } from '@squelette/core'
import { createOperationsAST } from './operation'
import { createRootAST } from './root'
import * as utils from '../utils'

export const createAST = (data: ITag) => {
  const operations = utils.groupByPath(utils.tagToOperationList(data))
  const operationsAST = Object.values(operations).map(createOperationsAST)
  return createRootAST(operationsAST)
}
