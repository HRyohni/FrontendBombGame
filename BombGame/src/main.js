import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

library.add(faUserSecret)

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

app.component('font-awesome-icon', FontAwesomeIcon) // Integrating Font Awesome component

app.mount('#app')
