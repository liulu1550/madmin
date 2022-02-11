const token = 'token'
const user = 'user'

export function getToken(){
    return window.localStorage.getItem(token)
}

export function setToken(token_value){
    return window.localStorage.setItem(token, token_value)
}

export function removeToken() {
    return window.localStorage.removeItem(token)
}


export function setUser(user_key) {
    return window.localStorage.setItem(user, user_key)
}

export function getUser() {
    return window.localStorage.getItem(user)
}
export function removeUser() {
    return window.localStorage.removeItem(user)
}
