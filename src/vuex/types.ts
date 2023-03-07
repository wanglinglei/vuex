export const STOREKEY = "store";

export interface StoreOptions {
  state: () => Record<string, any>;
  getters: Record<string, () => any>;
}