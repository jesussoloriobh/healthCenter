<script setup>
    import { ref, onMounted, watch } from 'vue';
    import * as API from '../../../controllers/users'
    import FeedBackModal from '../../generics/FeedBackModal.vue';
    import ConfirmModal from '../../generics/ConfirmModal.vue';

    const props = defineProps(['navigation'])

    const navigation = props.navigation
    const title = ref('User Registration')
    const isUpdate = ref(false)
    const updateId = ref('')
    const fbModal = ref(null)
    const cfrmModal = ref(null)

    const userPlaceholder = ref({
            "id":0,
            "user": "",
            "pass": "",
            "role": "",
            "alias": ""
        })

    watch(updateId, async (newValue) => {
        LoadUserInformation(newValue)
    })

    onMounted(() => {
        if(localStorage.userId !== undefined){
            updateId.value = localStorage.userId
            title.value = 'User Update'
        }
    })

    const LoadUserInformation = async(userId) => {
        var result = await API.find(userId)

        if(result === undefined){
            return
        }

        isUpdate.value = true
        userPlaceholder.value = result
    }

    const CreateUser = async() => {
        if (! await DataValidation()){
            fbModal.value.setModalinfo('Error', 'User data is incomplete')
            return
        }
        
        var findExistingResult = await API.findByName(userPlaceholder.value.user)
        if(findExistingResult.length > 0){
            fbModal.value.setModalinfo('Error', 'User name already exist')
            return
        }
        
        var info = userPlaceholder.value
        delete info.id

        var result = await API.create(info)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while creating new user')
            return
        }

        CancelReturn()
    }

    const UpdateUser = async() => {
        if(userPlaceholder.id <= 0){
            return
        }
        
        if (! await DataValidation()){
            fbModal.value.setModalinfo('Error', 'User data is incomplete')
            return
        }

        var result = await API.update(userPlaceholder.value)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while updating user')
            return
        }

        CancelReturn()
    }

    const DataValidation = async() => {
        var data = {...userPlaceholder.value}
        delete data.id
        if(![data.user, data.pass, data.alias, data.role].every(Boolean)){
            return false
        }

        return true
    }

    const CancelReturn = async() => {
        navigation('usersMain')
    }

</script>
<template>

    <div class="card">
        <div class="col-12 d-flex justify-content-center p-2" style="background-color:#019119;">
            <div class="col px-1">
                <h2 style="color:white">{{ title }}</h2>
            </div>
            <div class="col d-flex justify-content-end">
                <a @click="CancelReturn" class="btn btn-secondary mx-1 px-3 d-flex align-items-center">Return <font-awesome-icon icon="fa-solid fa-rotate-left"/></a>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <h4>User</h4>
                </div>
                <div class="col-8 d-flex align-items-center">
                    <input v-model="userPlaceholder.user" placeholder="Enter user name" :disabled="isUpdate">
                </div>
            </div>
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <h4>Password</h4>
                </div>
                <div class="col-8 d-flex align-items-center">
                    <input v-model="userPlaceholder.pass" placeholder="Enter password">
                </div>
            </div>
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <h4>Alias</h4>
                </div>
                <div class="col-8 d-flex align-items-center">
                    <input v-model="userPlaceholder.alias" placeholder="Enter user alias">
                </div>
            </div>
            <div class="row">
                <div class="col d-flex justify-content-end">
                    <h4>Role</h4>
                </div>
                <div class="col-8 d-flex align-items-center">
                    <select v-model="userPlaceholder.role" :disabled="isUpdate">
                        <option value="" disabled>Select user role</option>
                        <option value="user">User</option>
                        <option value="client">Client</option>
                    </select>
                </div>
            </div>

            <br>
            <div class="row ">
                <div class="col d-flex justify-content-center">
                    <button class="btn btn-danger" @click="CancelReturn">Cancel</button>
                </div>
                <div class="col d-flex justify-content-center">
                    <button class="btn btn-success" v-if="!isUpdate" @click="CreateUser">Create</button>
                    <button class="btn btn-success" v-else @click="UpdateUser">Update</button>
                </div>
            </div>
        </div>
    </div>

    <FeedBackModal ref="fbModal" />
    <ConfirmModal ref="cfrmModal" :confirm="CancelReturn"/>
</template>