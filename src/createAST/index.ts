import { parse } from '@squelette/core'
import { OpenAPIObject } from 'openapi3-ts'
import { createOperationsAST } from './operation'
import { createRootAST } from './root'
import { createModelType } from './models'
import * as utils from '../utils'

export const createAST = (data: OpenAPIObject) => {
  // Generate Type alias for schemas
  const components = data.components
  const schemas = components && components.schemas
  const models = Object.entries(schemas || {}).map(([key, val]) => createModelType(key, val))

  const parsed = parse(data)
  const opsByPath = utils.groupByPath(parsed)
  const operations = Object.values(opsByPath).map(createOperationsAST)
  return createRootAST(operations, models)
}
