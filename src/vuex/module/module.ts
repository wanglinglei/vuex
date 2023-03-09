import { StoreOptions, IModule, ModuleChildren } from "../types";
import { forEachValue } from "../utils";

export class Module {
  public _raw;
  public state;
  public _children: ModuleChildren;
  constructor(rawModule: StoreOptions) {
    console.log("rawModule", rawModule);

    this._raw = rawModule;
    this.state = rawModule.state();
    this._children = {};
  }
  addChild(key: string, module: IModule) {
    this._children[key] = module;
  }
  getChild(key: string) {
    return this._children[key];
  }
  foreachChild(fn: () => void) {
    forEachValue(this._children, fn);
  }
}
