import * as HTTP from './http'

export const login = async (access, password) => {
    let endpoint = 'users'
    let params = `?user=${access}&pass=${password}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const list = async (exclude) => {
    let endpoint = 'users'
    let params = `?id_ne=0&id_ne=${exclude}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const listByRole = async (role) => {
    let endpoint = 'users'
    let params = `?role=${role}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const find = async (id) => {
    let endpoint = 'users'
    let params = `/${id}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const findByName = async (userName) => {
    let endpoint = 'users'
    let params = `?user=${userName}`
    let data = HTTP.GET(`${endpoint}${params}`);
    return data;
}

export const create = async(user) => {
    let endpoint = 'users'
    let data = HTTP.POST(endpoint, user);
    return data;
}

export const update = async(user) => {
    let endpoint = `users/${user.id}`
    let data = HTTP.PUT(endpoint, user);
    return data;
}

export const remove = async(id) => {
    let endpoint = `users/${id}`
    let data = HTTP.DELETE(endpoint);
    return data;
}