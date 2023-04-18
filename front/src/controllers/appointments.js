import * as API from '../api/appointments'

export const findByUser = async(userId) => {
    try{
        var result = await API.findByUser(userId)
    }catch(e){
        return undefined
    }

    return result
}

export const findByClient = async(clientId) => {
    try{
        var result = await API.findByClient(clientId)
    }catch(e){
        return undefined
    }

    return result
}

export const update = async(appointment) => {
    try{
        var result = await API.update(appointment)
    }catch(e){
        return undefined
    }

    return result
}

export const create = async(appointment)=> {
    try{
        var result = await API.create(appointment)
    }catch(e){
        return undefined
    }

    return result
}