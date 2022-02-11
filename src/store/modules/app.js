import store from '../index'
import {getUser} from "@/utils/storage";

const state = {
    token: '',
    user: getUser() ? JSON.parse(getUser()) : ''
}

const getters = {
    user: state => {
        return state.user
    },
    token: state => state.token
}

const mutations = {
    SET_TOKEN(state, value) {
        state.token = value
    },
    SET_USER(state, value) {
        state.user = value
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
