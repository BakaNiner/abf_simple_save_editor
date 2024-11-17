import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zhs from './locales/zhs.json';
import zht from './locales/zht.json';

const i18n = createI18n({
  locale: 'zhs', 
  fallbackLocale: 'en',
  messages: {
    en,
    zhs,
    zht,
  },
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
