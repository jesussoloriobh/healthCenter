<script setup>
    import { ref, onMounted, watch } from 'vue';
    import * as UsersController from '../../../controllers/users'
    import ConfirmModal from '../../generics/ConfirmModal.vue';
    import FeedBackModal from '../../generics/FeedBackModal.vue';

    const props = defineProps(['navigation'])
    const navigation = props.navigation
    const usersList = ref()
    const usersListDelta = ref()
    const listFilter = ref(0)
    const deleteId = ref(undefined)
    const cfrmModal = ref(null)
    const fbModal = ref(null)

    onMounted(() => {
        localStorage.removeItem('userId')
        getUsers()
    })

    watch(listFilter, async(newValue) => {
        var result = undefined
        switch(newValue){
            case '0':
                result = usersListDelta.value
                break;
            case '1':
                result  = usersListDelta.value.filter(x => x.role === 'user')
                break;
            case '2':
                result  = usersListDelta.value.filter(x => x.role === 'client')
                break;
        }

        usersList.value = result
    })

    const getUsers = async() =>{
        var result = await UsersController.list()

        if(result === undefined){
            //error 
            return
        }

        usersListDelta.value = result
        usersList.value = result
        listFilter.value = '0'
    }

    const editUser = async(userId) => {
        localStorage.setItem('userId', userId)
        navigation('usersDetail')
    }

    const deleteUser = async(userId) => {
        deleteId.value = userId
        cfrmModal.value.setModalinfo('Delete User', 'Do you want to delete the selected user?')
    }

    const confirmDelete = async() => {
        var result = await UsersController.remove(deleteId.value)

        if(result === undefined){
            fbModal.value.setModalinfo('Error', 'Error while deleting user. Please, try again')
            return
        }
        
        await getUsers()

        fbModal.value.setModalinfo('User Deleted', 'User deleted successfully')
    }

    const cancelDelete = async() => {
        deleteId.value = undefined
    }

</script>

<template>
    <div class="row mb-2">
        <div class="col">
            <h2>Users Management</h2>
        </div>

        <div class="col d-flex justify-content-end">
            <a @click="navigation('main')" class="btn btn-secondary mx-1 px-3 d-flex align-items-center">Return <font-awesome-icon icon="fa-solid fa-rotate-left"/></a>
            <a @click="navigation('usersDetail')" class="btn btn-success px-3 d-flex align-items-center">Create User <font-awesome-icon icon="fa-solid fa-address-card" /></a>
        </div>
    </div>
    <br>
    <div class="d-flex flex-row mb-2">
        <div class="mx-2">
            <label>Display:</label>
        </div>
        <div >
            <select class="block" v-model="listFilter">
                <option value="0">All</option>
                <option value="1">Users</option>
                <option value="2">Clients</option>
            </select>
        </div>
    </div>
    <br>
    <div class="row">
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                <th scope="col">User</th>
                <th scope="col">Alias</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in usersList">
                    <td scope="row">{{ user.user }}</td>
                    <td>{{ user.alias }}</td>
                    <td>{{ user.role }}</td>
                    <td class="mx-1">
                        <a @click="editUser(user.id)" class="btn btn-success mx-1"><font-awesome-icon icon="fa-solid fa-user-pen"/></a>
                        <a @click="deleteUser(user.id)" class="btn btn-danger"><font-awesome-icon icon="fa-solid fa-user-xmark" /></a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <ConfirmModal ref="cfrmModal" :confirm="confirmDelete" :cancel="cancelDelete"/>
    <FeedBackModal ref="fbModal" />
</template>