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

import { State, IModule } from "./types";

// 深度优先遍历 添加子模块
//@ts-ignore
export function installModule(store, rootState: State, path, module: IModule) {
  const isRoot = !path.length;
  if (!isRoot) {
    const parentState = path
      .slice(0, -1)
      .reduce((state: State, key: string) => {
        return state[key];
      }, store);
    parentState[path[path.length - 1]] = module.state;
  }
  module.foreachChild((child: IModule, key: string) => {
    installModule(store, rootState, path.concat(key), child);
  });
}

/**
 * @description: 判断是否是promise
 * @param {any} val
 * @return {*}
 */
export function isPromise(val: any) {
  return val && val?.then && typeof val.then === "function";
}
