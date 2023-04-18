import Main from './Main.vue'
import * as Users from './Users/index'
import * as Appointments from './Appointments/index'

export const Routes = {
    'main': Main,
    'usersMain': Users._Main,
    'usersDetail': Users._Detail,
    'appointmentsMain': Appointments._Main,
    'appointmentsHistory': Appointments._History,
    'appointmentsCreate': Appointments._Create,
}