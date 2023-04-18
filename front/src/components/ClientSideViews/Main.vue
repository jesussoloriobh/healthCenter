<script setup>
    import { onMounted, ref, watch } from 'vue'
    import * as UsersAPI from '../../controllers/users'
    import * as AppointmentsAPI from '../../controllers/appointments'
    import FeedBackModal from '../generics/FeedBackModal.vue';
    import ConfirmModal from '../generics/ConfirmModal.vue';
    
    const props = defineProps(['navigation', 'credentials'])
    const navigation = props.navigation
    const credentials = ref('')

    const allowUserManagement = ref(false)
    const appointmentsList = ref([])
    const usersList = ref([])
    const showData = ref(false)
    const dataDisplay = ref({
        id: 0,
        name: '',
        date: ''
    })

    const fbModal = ref(null)
    const cfModal = ref(null)

    onMounted(() => {
        credentials.value = props.credentials
        if(credentials.value.role === 'admin'){
            allowUserManagement.value = true
        }

        getUsers()
    })

    watch(usersList, async() => {
        getAppointments()
    })

    watch(appointmentsList, async() => {
        if (appointmentsList.value.length < 0){
            showData.value = false
            return
        }

        createDisplay()
    })

    const getUsers = async() => {
        var result = await UsersAPI.list()

        if(result === undefined){
            fbModal.value.setModalinfo('Error - Users', 'Error while loading landing data')
            return
        }

        usersList.value = result
    }

    const getAppointments = async() => {
        var result = await AppointmentsAPI.findByClient(credentials.value.id)

        if(result === undefined){
            fbModal.value.setModalinfo('Error - Appointments', 'Error while loading landing data')
            return
        }

        appointmentsList.value = result
    }

    const createDisplay = async() => {
        var data = appointmentsList.value.find(x => x.status = 'created')
        var user = usersList.value.find(x => x.id === data.user)
        
        console.log(appointmentsList.value)
        console.log(data)
        
        dataDisplay.value = {
            id: data.id,
            name: user.alias,
            date: new Date(data.date.year,data.date.month, data.date.day, Math.floor(data.date.hour), (data.date.hour - Math.floor(data.date.hour)) * 60 ).toLocaleString("en-US", {month:'long', day:'2-digit', year:'numeric', hour12: true, hour:'2-digit', minute:'2-digit'})
        }

        showData.value = true
    }

    const confirmAppointment = async(id) => {
        var data = {...appointmentsList.value.find(x => x.id === id)}
        data.status = 'confirmed'

        var result = await AppointmentsAPI.update(data)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while confirming appointment')
            return
        }

        console.log(result)

        fbModal.value.setModalinfo('Appointment Confirmed', 'Appointment confirmed successfully')

        getUsers()
    }

    const cancelAppointment = async() => {
        cfModal.value.setModalinfo('Appointment Cancelation', 'Do you want to cancel the selected appointment?')
    }

    const confirmCancelAppointment = async() => {
        var data = {...appointmentsList.value.find(x => x.id === dataDisplay.value.id)}
        data.status = 'canceled'

        var result = await AppointmentsAPI.update(data)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while canceling appointment')
            return
        }

        console.log(result)

        fbModal.value.setModalinfo('Appointment Canceled', 'Appointment canceled successfully')

        getUsers()
    }

</script>

<template>
    <div class="row" v-if="showData">
        <div class="card">
            <div class="card-body">
                <div class="d-flex flex-row align-items-center">
                    <div class="col-2">
                        <font-awesome-icon icon="fa-solid fa-calendar-days" size="5x" />
                    </div>
                    <div class="col p-2">
                        <h3>Next Appointment</h3>
                        <div class="row p-2">
                            Date: {{dataDisplay.date}}
                        </div>
                        <div class="row p-2">
                            Doctor: {{ dataDisplay.name }}
                        </div>
                    </div>
                    <div class="col p-2">
                        <div class="row p-2">
                            <button type="button" class="btn btn-success" @click="confirmAppointment(dataDisplay.id)">CONFIRM</button>
                        </div>
                        <div class="row p-2">
                            <button type="button" class="btn btn-danger" @click="cancelAppointment(dataDisplay.id)">CANCEL</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <div class="row d-flex justify-content-center">
                        <font-awesome-icon icon="fa-solid fa-book" size="5x"/>
                    </div>
                    <br>
                    <div class="col d-flex justify-content-center">
                        <a @click="navigation('history')" class="btn btn-primary">Appointments <br> History</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <div class="row d-flex justify-content-center">
                        <font-awesome-icon icon="fa-solid fa-calendar-days" size="5x"/>
                    </div>
                    <br>
                    <div class="col d-flex justify-content-center">
                        <a @click="navigation('create')" class="btn btn-primary">Create <br> Appointment</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <FeedBackModal ref="fbModal" />
    <ConfirmModal ref="cfModal" :confirm="confirmCancelAppointment" />
</template>