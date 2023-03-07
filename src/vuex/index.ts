import { inject } from "vue";
import { STOREKEY } from "./types";
import { Store } from "./store";

export function createStore(options) {
  return new Store(options);
}

export function useStore(injectKey: string = STOREKEY) {
  return inject(injectKey);
}
