import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

import App from './App';

// Suppress specific warnings from third-party libraries and DevTools to keep console clean
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Failed to download the latest version of React Native DevTools'
]);

const originalWarn = console.warn;
console.warn = (...args) => {
  const arg = args[0];
  if (typeof arg === 'string' && (
    arg.includes('props.pointerEvents is deprecated') ||
    arg.includes('Failed to download the latest version of React Native DevTools')
  )) {
    return;
  }
  originalWarn(...args);
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
