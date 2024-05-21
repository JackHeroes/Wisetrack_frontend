import { createApp } from 'vue';

import App from './App.vue';
import Message from './components/Message.vue'; 
import router from './router';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import './assets/styles/main.css';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        aliases,
        defaultSet: 'mdi',
        sets: {
            mdi,
        },
    },
});

const app = createApp(App);

app.component('Message', Message);

app.use(router);
app.use(vuetify);

app.mount('#app');