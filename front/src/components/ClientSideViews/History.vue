<script setup>

    import { ref, onMounted, watch } from 'vue';
    import * as UsersAPI from '../../controllers/users'
    import * as AppointmentsAPI from '../../controllers/appointments'
    import FeedBackModal from '../generics/FeedBackModal.vue';
    import ConfirmModal from '../generics/ConfirmModal.vue';

    const props = defineProps(['navigation', 'credentials'])
    const navigation = props.navigation
    const credentials = ref('')

    const fbModal = ref(null)
    const cfrmModal = ref(null)

    const seletedId = ref('')

    const appointmentsList = ref()
    const usersList = ref()
    const displayList = ref()

    const cancelSelectedId = ref(0)

    onMounted(() => {
        credentials.value = props.credentials
        seletedId.value = credentials.value.id
    })

    watch(seletedId, async() => {
        getAppointments()
    })

    watch(appointmentsList, async(newValue) =>{

        if(newValue.length < 1){
            return
        }

        getUsers()
    })

    watch(usersList, async() => {
        getDisplay()
    })

    const getAppointments = async() => {
        var result = await AppointmentsAPI.findByClient(seletedId.value)

        if( result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while loading registered appointments')
            return
        }

        appointmentsList.value = result
    }

    const getUsers = async() => {
        var result = await UsersAPI.listByRole('user')

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while loading registered doctors')
            return
        }

        usersList.value = result
    }

    const getDisplay = async() => {
        var result = []

        appointmentsList.value.forEach((x,i)=>{
            var data = {...x, "userName": usersList.value.find(y=> y.id).alias}
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

    const confirmAppointment = async(id) => {
        var data = {...appointmentsList.value.find(x => x.id === id)}
        data.status = 'confirmed'

        var result = await AppointmentsAPI.update(data)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while confirming appointment')
            return
        }

        fbModal.value.setModalinfo('Appointment Confirmed', 'Appointment confirmed successfully')

        getAppointments()
    }
</script>

<template>
    <div class="row">
        <div class="col">
            <h2>Appointments History</h2>
        </div>

        <div class="col d-flex justify-content-end">
            <a @click="navigation('main')" class="btn btn-secondary mx-1 px-3 d-flex align-items-center">Return <font-awesome-icon icon="fa-solid fa-rotate-left"/></a>
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
                    <th scope="col">Doctor</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="display in displayList">
                        <td scope="row">{{ display.userName }}</td>
                        <td>{{ new Date(display.date.year,display.date.month, display.date.day, Math.floor(display.date.hour), (display.date.hour - Math.floor(display.date.hour)) * 60 ).toLocaleString("en-US", {month:'long', day:'2-digit', year:'numeric', hour12: true, hour:'2-digit', minute:'2-digit'}) }}</td>
                        <td>{{ display.status.toUpperCase() }}</td>
                        <td >
                            <div class="row">
                                <div class="col">
                                    <a @click="cancelAppointment(display.id)" class="btn btn-danger btn-sm" v-if="display.status === 'canceled' || display.status === 'attended'? false : true">CANCEL</a>
                                </div>
                                <div class="col">
                                    <a @click="confirmAppointment(display.id)" class="btn btn-success btn-sm" v-if="display.status === 'created' ? true : false">CONFIRM</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <FeedBackModal ref="fbModal" />
    <ConfirmModal ref="cfrmModal" :confirm="confirmCancelAppointment" />

</template>