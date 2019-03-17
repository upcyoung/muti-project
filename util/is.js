const isUndefined = val => typeof val === 'undefined'

const isNull = val => val === null

const isFunction = val => typeof val === 'function'

const isString = val => typeof val === 'string'

const isExist = val => !(isUndefined(val) || isNull(val))

const isReplacement = obj => ('from' in obj) && ('with' in obj);

const isArray = obj => Array.isArray(obj);

module.exports = {
  isUndefined, isNull, isFunction, isString, isExist, isReplacement, isArray
}

