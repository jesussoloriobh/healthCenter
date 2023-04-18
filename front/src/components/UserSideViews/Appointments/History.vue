<script setup>

    import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
    import * as UsersAPI from '../../../controllers/users'
    import * as AppointmentsAPI from '../../../controllers/appointments'
    import FeedBackModal from '../../generics/FeedBackModal.vue';
    import ConfirmModal from '../../generics/ConfirmModal.vue';

    const props = defineProps(['navigation', 'credentials'])
    const navigation = props.navigation
    const credentials = ref('')

    const fbModal = ref(null)
    const cfrmModal = ref(null)

    const userList = ref()

    const isFixed = ref(false)
    const seletedId = ref('')

    const appointmentsList = ref()
    const clientsList = ref()
    const displayList = ref()

    const cancelSelectedId = ref(0)

    onMounted(() => {
        credentials.value = props.credentials
        if(credentials.value.role !== 'admin'){
            var userInfo = {...credentials.value}
            userList.value = [userInfo]
            seletedId.value = userInfo.id
            isFixed.value = true
        }else{
            getUsers()
        }
    })

    watch(seletedId, async() => {
        getAppointments()
    })

    watch(appointmentsList, async(newValue) =>{

        if(newValue.length < 1){
            return
        }

        getClients()
    })

    watch(clientsList, async() => {
        getDisplay()
    })

    const getUsers = async() => {
        var result = await UsersAPI.listByRole('user')

        if( result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while loading registered users')
            return
        }

        userList.value = result
    }

    const getAppointments = async() => {
        var result = await AppointmentsAPI.findByUser(seletedId.value)

        if( result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while loading registered appointments')
            return
        }

        appointmentsList.value = result
    }

    const getClients = async() => {
        var result = await UsersAPI.listByRole('client')

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while loading registered clients')
            return
        }

        clientsList.value = result
    }

    const getDisplay = async() => {
        var result = []

        appointmentsList.value.forEach((x,i)=>{
            var data = {...x, "clientName": clientsList.value.find(y=> y.id).alias}
            result.push(data)
        })

        displayList.value = result
    }

    const cancelAppointment = async(id) => {
        cancelSelectedId.value = id
        cfrmModal.value.setModalinfo('Appointment Cancelation', 'Do you want to cancel the selected appointment?')
    }

    const confirmCancelAppointment = async() => {
        var data = {...appointmentsList.value.find(x => x.id === cancelSelectedId.value)}
        data.status = 'canceled'

        var result = await AppointmentsAPI.update(data)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while canceling appointment')
            return
        }

        fbModal.value.setModalinfo('Appointment Canceled', 'Appointment canceled successfully')

        getAppointments()
    }

</script>
<template>
    <div class="row">
        <div class="col">
            <h2>Appointments History</h2>
        </div>

        <div class="col d-flex justify-content-end">
            <a @click="navigation('appointmentsMain')" class="btn btn-secondary mx-1 px-3 d-flex align-items-center">Return <font-awesome-icon icon="fa-solid fa-rotate-left"/></a>
        </div>
    </div>
    <br>
    <div class="d-flex flex-row">
        <div class="mx-2">
            <label>User:</label>
        </div>
        <div >
            <select class="block" v-model="seletedId">
                <option value="" v-if="!isFixed" selected :disabled="true">Select target User</option>
                <option v-for="user in userList" :value="user.id" :disabled="isFixed" :selected="isFixed">{{ user.alias }}</option>
            </select>
        </div>
    </div>
    <br>
    <div class="row">
        <div class="col">
            <h5>User History</h5>
        </div>

        <div class="row">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                    <th scope="col">Client</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col" v-if="isFixed">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="display in displayList">
                        <td scope="row">{{ display.clientName }}</td>
                        <td>{{ new Date(display.date.year,display.date.month, display.date.day, Math.floor(display.date.hour), (display.date.hour - Math.floor(display.date.hour)) * 60 ).toLocaleString("en-US", {month:'long', day:'2-digit', year:'numeric', hour12: true, hour:'2-digit', minute:'2-digit'}) }}</td>
                        <td>{{ display.status.toUpperCase() }}</td>
                        <td class="mx-1" v-if="isFixed">
                            <a @click="cancelAppointment(display.id)" class="btn btn-danger" v-if="display.status === 'canceled' || display.status === 'attended'? false : true">CANCEL</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <FeedBackModal ref="fbModal" />
    <ConfirmModal ref="cfrmModal" :confirm="confirmCancelAppointment" />

</template>