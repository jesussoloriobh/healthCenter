import Landing from './components/Landing.vue'
import Login from './components/Login.vue'

import UserDashboard from './components/UserDashboard.vue'

import ClientDashboard from './components/ClientDashboard.vue'

export const Routes = {
    '/': Landing,
    '/Login': Login,
    '/UserDashboard' : UserDashboard,
    '/ClientDashboard' : ClientDashboard
}