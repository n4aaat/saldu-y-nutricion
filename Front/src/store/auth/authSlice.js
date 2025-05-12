import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', //  'checking', 'not-authenticated', 'authenticated'
        user: {},
        errorMessage: undefined
    },
    reducers: {
        login: ( state, { payload } ) => {
            state.status = 'authenticated'
            state.user = payload
            state.errorMessage = undefined
        },
        checking: ( state ) => {
            state.status = 'checking'
            state.user = {}
            state.errorMessage = undefined
        },
        logout: (state, { payload }) => {
            state.status = 'not-authenticated'
            state.user = {}
            state.errorMessage = payload
        }
    }
})

export const { login, checking, logout } = authSlice.actions