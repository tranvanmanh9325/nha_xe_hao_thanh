const { getDefaultConfig } = require('expo/metro-config');

// Mute the specific DevTools download warning that pollutes the console in Docker environments
const originalWarn = console.warn;
console.warn = (...args) => {
  const arg = args[0];
  if (typeof arg === 'string' && arg.includes('Failed to download the latest version of React Native DevTools')) {
    return;
  }
  originalWarn(...args);
};

const config = getDefaultConfig(__dirname);

module.exports = config;
