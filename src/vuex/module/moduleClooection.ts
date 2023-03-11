import { StoreOptions, IModule } from "../types";
import { forEachValue } from "../utils";
import { Module } from "./module";
export class ModuleCollection {
  public root: IModule | null;
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
}
