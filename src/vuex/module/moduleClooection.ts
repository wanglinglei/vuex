import { StoreOptions, IModule } from "../types";
import { forEachValue } from "../utils";
import { Module } from "./module";
export class ModuleCollection {
  public root: IModule;
  constructor(module: StoreOptions) {
    this.root = null;
    this.registerModule(module, []);
  }
  registerModule(rawModule: StoreOptions, path: string[]) {
    const module = new Module(rawModule);
    if (path.length === 0) {
      // 是根模块
      this.root = module;
    } else {
      const parent = path.slice(0, -1).reduce((module, current) => {
        return module && module.getChild(current);
      }, this.root);
      parent && parent.addChild(path[path.length - 1], module);
    }

    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildrenModule, key) => {
        this.registerModule(rawChildrenModule, path.concat(key));
      });
    }
  }

  getNameSpace(path: string[]) {
    let module = this.root;
    // @note [a,b] => 'a/c'
    return path.reduce((nameSpaceString, key) => {
      // 获取子模块
      module = module?.getChild(key);
      return nameSpaceString + (module.nameSpace ? key + "/" : "");
    }, "");
  }
}
