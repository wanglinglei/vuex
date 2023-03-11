Vuex 核心原理

```javascript
class Store {
  public _state: any;
  public getters: any;
  public _mutations: any;
  public _actions: any;
  constructor(options) {
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

    // mutations
    store._mutations = Object.create(null);
    const _mutations = options.mutations || {};
    forEachValue(_mutations, function (mutation, key) {
      store._mutations[key] = (payload: any) => {
        mutation.call(store, store.state, payload);
      };
    });
    // actions
    store._actions = Object.create(null);
    const _actions = options.actions || {};
    forEachValue(_actions, function (action, key) {
      store._actions[key] = (payload: any) => {
        action.call(store, store, payload);
      };
    });
  }

  commit = (type: string, payload: any) => {
    this._mutations[type](payload);
  };
  dispatch = (type: string, payload: any) => {
    this._actions[type](payload);
  };
  get state() {
    return this._state.data;
  }
}
```