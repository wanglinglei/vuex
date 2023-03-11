import { StoreOptions, IModule, ModuleChildren } from "../types";
import { forEachValue } from "../utils";

export class Module {
  public _raw;
  public state;
  public _children: ModuleChildren;
  public nameSpace: boolean;
  constructor(rawModule: StoreOptions) {
    console.log("rawModule", rawModule);

    this._raw = rawModule;
    this.state = rawModule.state();
    this._children = {};
    this.nameSpace = rawModule.nameSpace ?? false;
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
  forEachGetter(fn: () => void) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, fn);
    }
  }
  forEachMutations(fn: () => void) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, fn);
    }
  }
  forEachActions(fn: () => void) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, fn);
    }
  }
}
