import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'



const app = createApp(App)
app.use(Quasar, {
  plugins: {Notify}, // import Quasar plugins and add here
  config: {
    notify: { /* look at QUASARCONFOPTIONS from the API card (bottom of page) */ }
  }
})

app.mount('#app')
