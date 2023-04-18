import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'

library.add( 
    Icons.faUser,
    Icons.faUserTie,
    Icons.faRightToBracket, 
    Icons.faRightFromBracket,
    Icons.faRotateLeft,
    Icons.faCalendarDays,
    Icons.faAddressCard,
    Icons.faUserPen,
    Icons.faUserXmark,
    Icons.faBook,
    Icons.faArrowLeft,
    Icons.faArrowRight)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(bootstrap).mount('#app')
