/**
 * @description:
 * @param {Record} obj
 * @param {*} any
 * @param {function} fn
 * @return {*}
 */
export function forEachValue(
  obj: Record<string, any>,
  fn: (arg0: any, arg1: string) => void
) {
  Object.keys(obj).forEach((key) => fn(obj[key], key));
}
