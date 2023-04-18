import * as API from '../api/users'

export const login = async(access, password) => {
    try{
        var result = await API.login(access, password)
    }catch(e){
        //todo
        return undefined
    }
    
    if (result.lenght){
        //not fount
        return undefined
    }
    return result[0]
}

export const list = async(exclude) => {
    try{
        var result = await API.list(exclude)
    }catch(e){
        return undefined
    }

    return result
}

export const listByRole = async(role) => {
    try{
        var result = await API.listByRole(role)
    }catch(e){
        return undefined
    }

    return result
}

export const find = async(id) => {
    try{
        var result = await API.find(id)
    }catch(e){
        return undefined
    }

    return result
}

export const create = async(user) => {
    try{
        var result = await API.create(user)
    }catch(e){
        return undefined
    }

    return result
}

export const update = async(user) => {
    try{
        var result = await API.update(user)
    }catch(e){
        return undefined
    }

    return result
}

export const remove = async(id) =>{
    try{
        var result = await API.remove(id)
    }catch(e){
        return undefined
    }

    return result
}

export const findByName = async(userName) =>{
    try{
        var result = await API.findByName(userName)
    }catch(e){
        return undefined
    }

    return result
}