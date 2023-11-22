import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


import axios from "axios";

const app = createApp(App)
const port = 3000;
const dataServiceBaseUrl = `http://127.0.0.1:${port}`;


app.use(router)


// Vuetify

const vuetify = createVuetify({
    components,
    directives,
})
app.use(vuetify)
app.mount('#app')
