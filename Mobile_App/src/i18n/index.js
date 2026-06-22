import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en.json';
import vi from './translations/vi.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';
import zh from './translations/zh.json';

const LANGUAGE_KEY = '@settings_language';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh }
};

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function(callback) {
    try {
      // get stored language from async storage
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage) {
        return callback(storedLanguage);
      } else {
        // if no stored language, get device language
        let phoneLanguage = Localization.getLocales()[0].languageCode;
        if (!Object.keys(resources).includes(phoneLanguage)) {
          phoneLanguage = 'vi'; // fallback default
        }
        return callback(phoneLanguage);
      }
    } catch (error) {
      console.log('Error reading language', error);
      return callback('vi');
    }
  },
  cacheUserLanguage: async function(language) {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  }
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;