import * as HTTP from './http'

export const findByUser = async (userId) => {
    let endpoint = 'appointments'
    let params = `?user=${userId}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const findByClient = async (clientId) => {
    let endpoint = 'appointments'
    let params = `?client=${clientId}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const update = async(appointment) => {
    let endpoint = `appointments/${appointment.id}`
    let data = HTTP.PUT(endpoint, appointment);
    return data;
}

export const create = async(appointment) => {
    let endpoint = 'appointments'
    let data = HTTP.POST(endpoint, appointment);
    return data;
}
