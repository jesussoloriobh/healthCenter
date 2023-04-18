<script setup>
    import { ref, onMounted } from 'vue';

    import Calendar from '../../generics/Calendar.vue'
    import FeedBackModal from '../../generics/FeedBackModal.vue';

    import * as AppointmentsAPI from '../../../controllers/appointments'
    import * as UsersAPI from '../../../controllers/users'

    const props = defineProps(['navigation', 'credentials'])
    const navigation = props.navigation
    const credentials = ref({})
    const fbModal = ref(null)

    const appointmentList = ref([])
    const clientsList = ref([])

    const selectedDate = ref({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate()
    })
    const selectedDateDisplay = ref()

    const validDate = ref(false)
    const availableHoursDelta = ref([8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5])
    const availableHours = ref([])
   
    const selectedClient = ref('')
    const selectedHour = ref('')

    onMounted(() => {
        credentials.value = props.credentials
        getAppointments()
        getClients()
    })
    
    const getAppointments = async() => {
        var result = await AppointmentsAPI.findByUser(credentials.value.id)

        if( result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while getting appoinments information')
            return
        }

        appointmentList.value = result
    }

    const getClients = async() =>{
        var result = await UsersAPI.listByRole('client')

        if(result === undefined) {
            fbModal.value.setModalinfo('Error', 'Error while loading clients')
            return
        }
        
        clientsList.value = result
    }

    const dateSelected = async(year, month, day) =>{
        selectedDate.value = {
            year: year,
            month: month,
            day: day
        }

        var validate = new Date(year, month, day).getDay()

        if(validate === 0 || validate === 6){
            validDate.value = false;
            return
        }

        validDate.value = true
        selectedDateDisplay.value = new Date(year, month, day).toLocaleString("en-US", {month:'long', day:'2-digit', year:'numeric'})
        getDateAvailableAppointments()
    }

    const getDateAvailableAppointments = async() => {
        var dateAppiontments = []
        var hoursTaken = []
        var hoursAvailable = []
        
        appointmentList.value.forEach(info => {
            if( info.date.year === selectedDate.value.year && info.date.month === selectedDate.value.month && info.date.day === selectedDate.value.day && info.status !== 'canceled'){
                dateAppiontments.push(info)
            }
        })

        dateAppiontments.forEach(x => {
            hoursTaken.push(x.date.hour)
        })

        availableHoursDelta.value.forEach(x => {
            var included = hoursTaken.includes(x)
            if(!included){
                hoursAvailable.push(x)
            }
        })

        availableHours.value = hoursAvailable
    }

    const createAppointment = async() => {
        if(![selectedClient.value, selectedHour.value].every(Boolean)){
            fbModal.value.setModalinfo('Error', 'Missing data for appointment creation')
            return
        }

        var appointment = {
            user: credentials.value.id,
            client: selectedClient.value,
            date: {
                year: selectedDate.value.year,
                month: selectedDate.value.month,
                day: selectedDate.value.day,
                hour: selectedHour.value
            },
            status: "created"
        }

        var result = await AppointmentsAPI.create(appointment)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while creating apointment')
            return
        }

        fbModal.value.setModalinfo('Appoinment Created', 'Appointment Created successfully')
        await getAppointments()
        await getDateAvailableAppointments()
        selectedClient.value = ''        
        selectedHour.value = ''
    }

</script>
<template>
    <div class="card">
        <div class="col-12 d-flex justify-content-center p-2" style="background-color:#019119;">
            <div class="col px-1">
                <h2 style="color:white">Appointment Creation</h2>
            </div>
            <div class="col d-flex justify-content-end">
                <a @click="navigation('appointmentsMain')" class="btn btn-secondary mx-1 px-3 d-flex align-items-center">Return <font-awesome-icon icon="fa-solid fa-rotate-left"/></a>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-8 border d-flex justify-content-center">
                    Calendar
                </div>
                <div class="col-4 border d-flex justify-content-center">
                    Detail
                </div>
            </div>
            <div class="row">
                <Calendar class="col-8" :dateSelected="dateSelected"/>
                <div class="col-4 border">
                    <div v-if="validDate">
                        <br>
                        <div class="row">
                            <div class="col d-flex justify-content-end">
                                <labe>{{ selectedDateDisplay}}</labe>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col d-flex justify-content-end">
                                <labe>Client :</labe>
                            </div>
                            <div class="col d-flex align-items-center">
                                <select v-model="selectedClient">
                                    <option value="" disabled>Select Client</option>
                                    <option v-for="client in clientsList" :value="client.id" >{{ client.alias }}</option>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col d-flex justify-content-end">
                                <labe>Hour :</labe>
                            </div>
                            <div class="col d-flex align-items-center">
                                <select v-model="selectedHour">
                                    <option value="" disabled>Select Hour</option>
                                    <option v-for="hour in availableHours" :value="hour" >{{ `${Math.floor(hour)}:${(hour - Math.floor(hour) > 0 ? '30':'00')}` }}</option>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row p-1">
                            <button @click="createAppointment" type="button" class="btn btn-success btn-block">Confirm</button>
                        </div>
                        <br>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <FeedBackModal ref="fbModal" />
</template>