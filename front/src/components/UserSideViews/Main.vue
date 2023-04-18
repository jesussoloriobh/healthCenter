<script setup>
    import { onMounted, ref } from 'vue'

    const props = defineProps(['navigation', 'credentials'])
    const navigation = props.navigation
    const credentials = ref('')

    const allowUserManagement = ref(false)

    onMounted(() => {
        credentials.value = props.credentials
        if(credentials.value.role === 'admin'){
            allowUserManagement.value = true
        }
    })
    
</script>

<template>
    <div class="row">
        <div class="col" v-if="allowUserManagement">
            <div class="card">
                <div class="card-body">
                    <div class="row d-flex justify-content-center">
                        <font-awesome-icon icon="fa-solid fa-user-tie" size="5x"/>
                    </div>
                    <br>
                    <div class="col d-flex justify-content-center">
                        <a @click="navigation('usersMain')" class="btn btn-primary">Manage <br> Users</a>
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
                        <a @click="navigation('appointmentsMain')" class="btn btn-primary">Manage <br> Appointments</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>