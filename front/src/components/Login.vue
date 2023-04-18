<script setup>
    import { ref, onMounted } from 'vue'
    import { login } from '../controllers/users'
    import FeedBackModal from './generics/FeedBackModal.vue'

    const user = ref('')
    const password = ref('')
    const fbModal = ref(null)

    onMounted(() => {
        if(localStorage.getItem('user') !== null){
            var existingUser = JSON.parse(localStorage.getItem('user'))
            user.value = existingUser.user
            password.value = existingUser.pass

            getUser()
        }
    })

    const getUser = async() => {
        if(! await sanityCheck()){
            fbModal.value.setModalinfo('Log-in Error', 'Missing credential fields')
            return
        }

        var result = await login(user.value, password.value)
        
        if(result === undefined){
            fbModal.value.setModalinfo('Log-in Error', 'Invalid credentials')
            return
        }
        
        localStorage.setItem('user', JSON.stringify(result))

        switch(result.role){
            case 'client':
                location.href = '#/ClientDashboard'
                break;
            case 'user':
            case 'admin':
                location.href = '#/UserDashboard'
                break;
        }
    }

    const sanityCheck = async() => {
        if(![user.value, password.value].every(Boolean)){
            return false
        } else{
            return true
        }
    }

</script>

<template>
    <div class="card">
        <div class="col-12 d-flex justify-content-center" style="background-color:#019119;">
            <h1 class="h1" style="color: white;">Login</h1>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <h4>Usuario</h4>
                </div>
                <div class="col d-flex align-items-center">
                    <input v-model="user" placeholder="Enter usar name">        
                </div>
            </div>
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <h3>Password</h3>
                </div>
                <div class="col d-flex align-items-center">
                    <input v-model="password" placeholder="Enter password" type="password">
                </div>
            </div>
            <br>
            <div class="row ">
                <div class="col d-flex justify-content-center">
                    <a href="/" class="btn btn-secondary">Return <font-awesome-icon icon="fa-solid fa-rotate-left" /></a>
                </div>
                <div class="col d-flex justify-content-center">
                    <button class="btn btn-success" @click="getUser">Login <font-awesome-icon icon="fa-solid fa-right-to-bracket" /></button>
                </div>
            </div>
        </div>
    </div>

    <FeedBackModal ref="fbModal"/>
</template>