export const STOREKEY = "store";

export type State = Record<string, any>;
export type StateRaw = () => Record<string, any>;
export type Getters = Record<string, () => any>;
export type Mutations = Record<string, () => any>;
export type Actions = Record<string, () => any>;

export interface StoreOptions {
  nameSpace: undefined | boolean;
  state: StateRaw;
  getters: Getters;
  mutations: Mutations;
  actions: Actions;
  modules?: Record<string, () => any>;
}

export type ModuleChildren = Record<string, IModule>;

export interface IModule {
  nameSpace: undefined | boolean;
  _raw: StoreOptions;
  state: any;
  _children: ModuleChildren;
  addChild: (key: string, module: IModule) => void;
  getChild: (key: string) => IModule;
  foreachChild: (fn: (module: IModule, key: string) => void) => void;
}

type Commit = (payload: any) => void;

export type I_Mutation = Commit[];

type Dispatch = (payload: any) => void;

export type I_Action = Dispatch[];
