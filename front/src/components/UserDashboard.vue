<script setup>
    import { shallowRef, ref, onMounted } from 'vue'
    import { Routes } from './UserSideViews/index'

    const activeComponent = shallowRef(Routes['main'])
    const credentials = ref(JSON.parse(localStorage.getItem('user')))

    onMounted(()=> {
        if(credentials.value.role === 'client'){
            logOut()
        }
    })

    const componentNavigation = (path) =>{
        activeComponent.value = Routes[path]
    }

    const logOut = async() => {
        location.href = '/'
        localStorage.removeItem('user')
    }
</script>

<template>
    <div class="row" style="background-color:#019119; margin-bottom: 16px;">
        <div class="col">
            <h1 style="color:white">User Dashboard</h1>
        </div>
        <div class="col d-flex align-items-center justify-content-end">
            <button @click="logOut" class="btn btn-danger">Log-out <font-awesome-icon icon="fa-solid fa-right-from-bracket" /></button>
        </div>
    </div>
    <br>
    <component :is="activeComponent" :navigation = "componentNavigation" :credentials="credentials"/>
</template>