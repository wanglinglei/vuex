export const STOREKEY = "store";

export interface StoreOptions {
  state: () => Record<string, any>;
  getters: Record<string, () => any>;
  mutations: Record<string, () => any>;
  actions: Record<string, () => any>;
}
