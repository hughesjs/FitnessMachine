// TypeScript declaration for React Native's __DEV__ global
declare const __DEV__: boolean;

// Augment the globalThis type to include __DEV__
declare global {
  var __DEV__: boolean;

  interface Global {
    __DEV__: boolean;
  }
}

export {};
