export const STOREKEY = "store";

export type State = Record<string, any>;
export type StateRaw = () => Record<string, any>;
export type Getters = Record<string, () => any>;
export type Mutations = Record<string, () => any>;
export type Actions = Record<string, () => any>;

export interface StoreOptions {
  state: StateRaw;
  getters: Getters;
  mutations: Mutations;
  actions: Actions;
  modules?: Record<string, () => any>;
}

export type ModuleChildren = Record<string, IModule>;

export interface IModule {
  _raw: StoreOptions;
  state: any;
  _children: ModuleChildren;
  addChild: (key: string, module: IModule) => void;
  getChild: (key: string) => IModule;
  foreachChild: (fn: (module: IModule, key: string) => void) => void;
}
