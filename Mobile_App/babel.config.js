const fs = require('fs');
const path = require('path');

// Tự động đọc file .env ở thư mục gốc (root) và tiêm IP vào biến môi trường của Expo
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  const rootEnv = fs.readFileSync(rootEnvPath, 'utf8');
  const match = rootEnv.match(/^LOCAL_IP=(.*)$/m);
  if (match && match[1]) {
    process.env.EXPO_PUBLIC_API_BASE_URL = `http://${match[1].trim()}:8080/api/v1`;
  }
}

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel", "react-native-reanimated/plugin"],
  };
};