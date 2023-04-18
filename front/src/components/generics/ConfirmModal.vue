<script setup>
    import bootstrapBundle from 'bootstrap/dist/js/bootstrap.bundle'
    import { ref, reactive, onMounted } from 'vue'
    
    const porps = defineProps(['confirm', 'cancel'])
    const confirm = porps.confirm
    const cancel = porps.cancel

    const modalInfo = ref({
        title: 'Modal Title',
        msg: 'Modal Msg'
    })

    const state = reactive({
        modaDemo: null
    })

    onMounted(() => {
        state.modaDemo = new bootstrapBundle.Modal('#cfrmModal', {})
        state.modaDemo.hide()
    })

    function setModalinfo(title, message){
        modalInfo.value.title = title
        modalInfo.value.msg = message

        state.modaDemo.show()
    }

    function hideModal (){
        state.modaDemo.hide()
        if(cancel !== undefined){
            cancel()
        }
    }

    function confirmEvent (){
        state.modaDemo.hide()
        confirm()
    }

    defineExpose({
        setModalinfo,
    })

</script>

<template>
    <div id="cfrmModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ modalInfo.title }}</h5>
                <button type="button" @click="hideModal" class="close" data-dismiss="modal" data-backdrop="false" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>{{ modalInfo.msg }}</p>
            </div>
            <div class="modal-footer">
                <button type="button" @click="hideModal" class="btn btn-danger" data-dismiss="modal" data-backdrop="false">Cancel</button>
                <button type="button" @click="confirmEvent" class="btn btn-success" data-dismiss="modal" data-backdrop="false">Confirm</button>
            </div>
            </div>
        </div>
    </div>
</template>