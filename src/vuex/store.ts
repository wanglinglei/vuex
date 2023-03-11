import {
  STOREKEY,
  StoreOptions,
  IModule,
  I_Mutation,
  I_Action,
  State,
} from "./types";
import { reactive } from "vue";

import { forEachValue, isPromise } from "./utils";
import { ModuleCollection } from "./module/moduleClooection";

// 根据路径 获取store上最新的的状态
function getCurrentState(state: State, path: string[]) {
  return path.reduce((state, key) => state[key], state);
}

// 深度优先遍历 添加子模块
//@ts-ignore
function installModule(store: Store, rootState, path: string[], module) {
  const isRoot = !path.length;

  // @note 处理nameSpace
  const nameSpace = store._modules.getNameSpace(path);

  if (!isRoot) {
    const parentState = path
      .slice(0, -1)
      .reduce((state: State, key: string) => {
        return state[key];
      }, store);
    parentState[path[path.length - 1]] = module.state;
  }
  // 添加module
  module.foreachChild((child: IModule, key: string) => {
    installModule(store, rootState, path.concat(key), child);
  });

  // 添加getters
  module.forEachGetter((getter: any, key: string) => {
    store._wrapGetters[key] = () => {
      //  return getter(module.state)  // 直接使用当前模块不具有响应式
      return getter(getCurrentState(store.state, path));
    };
  });
  // 添加mutations
  module.forEachMutations((mutation, key: string) => {
    const entry = store._mutations[key] || (store._mutations[key] = []);
    // store.commit ('fn',payload)
    entry.push((payload: any) => {
      mutation.call(store, getCurrentState(store.state, path), payload);
    });
  });

  // 添加actions
  module.forEachActions((action, key: string) => {
    const entry = store._actions[key] || (store._actions[key] = []);
    entry.push((payload: any) => {
      // @note 保证输出结果是是一个Promise
      const res = action.call(store, store, payload);
      if (isPromise(res)) {
        return res;
      } else {
        return Promise.resolve(res);
      }
    });
  });
}
// 重置store state
function resetStoreState(store: Store, state: State) {
  store._state = reactive({ data: state });
  const wrapGetters = store._wrapGetters;
  store.getters = {};
  forEachValue(wrapGetters, (getter, key) => {
    Object.defineProperty(store.getters, key, {
      get: () => getter(),
      enumerable: true,
    });
  });
}

class Store {
  public _state: any;
  public getters: any;
  public _mutations: Record<string, I_Mutation>;
  public _actions: Record<string, I_Action>;
  public _modules;
  public _wrapGetters: any;
  constructor(options: StoreOptions) {
    // {state,mutations,actions,modules}
    // 注册模块
    this._modules = new ModuleCollection(options);
    // 创建actions mutations getters 的发布订阅
    this._wrapGetters = Object.create(null);
    this._mutations = Object.create(null);
    this._actions = Object.create(null);
    // 添加state
    const state = this._modules.root?.state;
    installModule(this, state, [], this._modules.root);
    console.log("state", state);

    resetStoreState(this, state);
  }
  get state(): Record<string, any> {
    return this._state.data;
  }

  commit = (type: string, payload: any) => {
    const entry = this._mutations[type] || [];
    entry.forEach((handler) => handler(payload));
  };

  dispatch = (type: string, payload: any) => {
    const entry = this._actions[type] || [];
    return Promise.all(entry.map((handler) => handler(payload)));
  };

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
