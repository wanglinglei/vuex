import { STOREKEY, StoreOptions, IModule } from "./types";
import { reactive } from "vue";

import { forEachValue } from "./utils";
import { ModuleCollection } from "./module/moduleClooection";

// 深度优先遍历 添加子模块
//@ts-ignore
function installModule(store, rootState, path, module) {
  const isRoot = !path.length;
  if (!isRoot) {
    const parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key];
    }, store);
    parentState[path[path.length - 1]] = module.state;
  }
  module.foreachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}

class Store {
  public _state: any;
  public getters: any;
  public _mutations: any;
  public _actions: any;
  public _modules;
  constructor(options: StoreOptions) {
    // {state,mutations,actions,modules}
    // 注册模块
    this._modules = new ModuleCollection(options);
    console.log(this);

    // 添加属性
    const state = this._modules.root?.state;
    installModule(this, state, [], this._modules.root);
    console.log(this._state);
  }
  install(app, injectKey) {
    app.provide(injectKey || STOREKEY, this);
    // 兼容$store
    app.config.globalProperties.$store = this;
  }
}

export { Store };

// 实现模块化 创建树状结构
/**
 
root = {
  _raw:rootModule,
  state:rootModule.state,
  _children:{
    a-space:{
      _raw:AModule,
      state:AModule.state
      _children:{}
    },
    b-space:{
      _raw:BModule,
      state:BModule.state
      _children:{}
    }
  }
}

 */
