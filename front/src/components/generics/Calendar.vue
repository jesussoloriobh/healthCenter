<script setup>
    import { ref, onMounted } from 'vue';

    const props = defineProps(['dateSelected'])
    const dateSelected = props.dateSelected

    const selectedYear = ref(new Date().getFullYear())

    const months = ref(["January","February","March","April","May","June","July",
            "August","September","October","November","December"])
    const selectedMonthIndex = ref(0)
    const selectedMonth = ref(months.value[selectedMonthIndex.value])

    const monthDays = ref(0)
    const monthDayStart = ref(0)
    const monthWeeks = ref(0)

    const daysDisplay = ref([])

    onMounted(() => {
        getMonthDays()
    })

    const changeYear = async(direcction) => {
        selectedYear.value += direcction
        getMonthDays()
    }

    const changeMonth = async(direcction) => {
        if(direcction < 0 && selectedMonthIndex.value === 0){
            selectedMonthIndex.value = 11
        } else if (direcction > 0 && selectedMonthIndex.value === 11){
            selectedMonthIndex.value = 0
        }else{
            selectedMonthIndex.value += direcction
        }

        selectedMonth.value = months.value[selectedMonthIndex.value]
        getMonthDays()
    }

    const getMonthDays = async() => {
        var result = []
        var dateA = new Date(selectedYear.value, selectedMonthIndex.value + 1,0)
        var dateB = new Date(selectedYear.value, selectedMonthIndex.value,1)

        monthDays.value = dateA.getDate()
        monthDayStart.value = dateB.getDay()
        monthWeeks.value = Math.ceil((monthDays.value + monthDayStart.value)/ 7)

        for (let ed = 0; ed < monthDayStart.value; ed++) {
            result.push('')
        }

        for(let dt = 0; dt < monthDays.value; dt++){
            result.push(dt + 1)
        }

        for (let ed = (monthDays.value + monthDayStart.value); ed < monthWeeks.value * 7; ed++) {
            result.push('')
        }

        daysDisplay.value = result
    }

    const weekDays = (week) => {
        var start = (week * 7) - 7
        var end = (week * 7)

        var result = daysDisplay.value.slice(start, end)
        return result
    }

    const selectDay = async(day) => {
        if(day < 1){
            return
        }
        dateSelected(selectedYear.value, selectedMonthIndex.value, day)
    }
    
</script>
<template>
    <div class="border">
        <div class="row">
            <div class="col border d-flex justify-content-center">
                <button @click="changeYear(-1)" type="button" class="btn btn-link"><font-awesome-icon icon="fa-solid fa-arrow-left" /></button>
            </div>
            <div class="col-8 border d-flex justify-content-center">
                <h3>{{ selectedYear }}</h3>
            </div>
            <div class="col border d-flex justify-content-center">
                <button @click="changeYear(1)" type="button" class="btn btn-link"><font-awesome-icon icon="fa-solid fa-arrow-right" /></button>
            </div>
        </div>
        <div class="row">
            <div class="col border d-flex justify-content-center">
                <button @click="changeMonth(-1)" type="button" class="btn btn-link"><font-awesome-icon icon="fa-solid fa-arrow-left" /></button>
            </div>
            <div class="col-8 border d-flex justify-content-center">
                <h3>{{ selectedMonth }}</h3>
            </div>
            <div class="col border d-flex justify-content-center">
                <button @click="changeMonth(1)" type="button" class="btn btn-link"><font-awesome-icon icon="fa-solid fa-arrow-right" /></button>
            </div>
        </div>
        <div class="row" style="background-color:#019119;">
            <div class="col border d-flex justify-content-center" style="color: black;">
                Sun
            </div>
            <div class="col border d-flex justify-content-center" style="color: white;">
                Mon
            </div>
            <div class="col border d-flex justify-content-center" style="color: white;">
                Tues
            </div>
            <div class="col border d-flex justify-content-center" style="color: white;">
                Wed
            </div>
            <div class="col border d-flex justify-content-center" style="color: white;">
                Thurs
            </div>
            <div class="col border d-flex justify-content-center" style="color: white;">
                Fri
            </div>
            <div class="col border d-flex justify-content-center" style="color: black;">
                Sat
            </div>
        </div>

        <div class="row" v-for="w in monthWeeks">
            <div class="col border w-100 d-flex justify-content-center" @click="selectDay(d)" v-for="d in weekDays(w)">
                <label>{{ d }}</label>
            </div>
        </div>
    </div>
</template>
