<script setup>
    import { ref, onMounted } from 'vue';
    const props = defineProps(['navigation', 'credentials'])
    const navigation = props.navigation
    const credentials = ref('')

    const allowCreation = ref(true)

    onMounted(() => {
        credentials.value = props.credentials
        if(credentials.value.role === 'admin'){
            allowCreation.value = false
        }
    })

</script>

<template>
    <div class="row mb-2">
        <div class="col">
            <h2>Appointments Management</h2>
        </div>

        <div class="col d-flex justify-content-end">
            <a @click="navigation('main')" class="btn btn-secondary mx-1 px-3 d-flex align-items-center">Return <font-awesome-icon icon="fa-solid fa-rotate-left"/></a>
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
                        <a @click="navigation('appointmentsHistory')" class="btn btn-primary">Appointments <br> History</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col" v-if="allowCreation">
            <div class="card">
                <div class="card-body">
                    <div class="row d-flex justify-content-center">
                        <font-awesome-icon icon="fa-solid fa-calendar-days" size="5x"/>
                    </div>
                    <br>
                    <div class="col d-flex justify-content-center">
                        <a @click="navigation('appointmentsCreate')" class="btn btn-primary">Create <br> Appointment</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>