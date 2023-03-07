import { STOREKEY, StoreOptions } from "./types";
import { reactive } from "vue";

import { forEachValue } from "./utils";

class Store {
  public _state: any;
  public getters: any;
  constructor(options: StoreOptions) {
    const store = this;
    // this.state = options.state;
    // 为了兼容replaceState 方法 外部加一层data 以便于重置state
    store._state = reactive({ data: options.state() });

    const _getters = options.getters;
    this.getters = {};
    // 遍历getters 对象 挂载到store
    forEachValue(_getters, function (fn, key) {
      Object.defineProperty(store.getters, key, {
        get: () => {
          return fn(store.state);
        },
      });
    });
  }
  get state() {
    return this._state.data;
  }
  install(app, injectKey) {
    app.provide(injectKey || STOREKEY, this);
    // 兼容$store
    app.config.globalProperties.$store = this;
  }
}

export { Store };
