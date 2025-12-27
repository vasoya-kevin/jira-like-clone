import { createContext, useContext, useReducer } from "react"
import type { Error } from "./TicketContext"
import { ApiInstance } from "@/api/api"

export type UserRole = 'user' | 'admin'

export interface User {
    _id: string
    userName: string,
    email: string,
    role: UserRole
}

export interface CreateUserPayload {
    _id?: string
    userName: string,
    email: string,
    role: UserRole
    password: string
}

export interface PatchUserPayload {
    _id?: string
    userName?: string,
    email?: string
    role?: UserRole
    password?: string
}

export type userState = {
    users: User[],
    userById: User | null
    loading: boolean,
    error: Error | null
}

export type UserAction = { type: 'FETCH_INIT_USER' }
    | { type: 'USER_FETCH_ERROR', payload: Error }
    | { type: 'CREATE_USER', payload: CreateUserPayload }
    | { type: 'PATCH_USER', payload: PatchUserPayload }
    | { type: 'DELETE_USER', payload: string }
    | { type: 'FETCH_USERS_BY_ID', payload: User }
    | { type: 'GET_USERS', payload: User[] }

export function userReducer(state: userState, action: UserAction): userState {
    switch (action.type) {
        case 'FETCH_INIT_USER': {
            return { ...state, loading: true }
        }
        case 'GET_USERS': {
            return { ...state, users: action.payload, loading: false }
        }
        case 'FETCH_USERS_BY_ID': {
            return { ...state, loading: false, userById: action.payload }
        }
        case 'CREATE_USER': {
            return { ...state, loading: false, users: [action.payload as any, ...state.users] }
        }

        case 'PATCH_USER': {
            return { ...state, loading: false, users: state.users.map((user) => (user._id === action.payload._id) ? action.payload : user as any) }
        }

        case 'DELETE_USER': {
            return { ...state, loading: false, users: state.users.filter((u) => u._id !== action.payload), }
        }
        default:
            return state;
    }
}

export type UserContextType = userState & {
    fetchUsers: () => void,
    createUser: (user: CreateUserPayload) => void,
    patchUser: (id: string, user: PatchUserPayload) => void,
    deleteUser: (id: string) => void,
    getUserById: (id: string) => void,
}

export const initialUserState: userState = {
    error: null,
    loading: false,
    userById: null,
    users: []
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(userReducer, initialUserState);
    const USER_API_PATH = '/users';

    const fetchUsers = async () => {
        dispatch({ type: "FETCH_INIT_USER" })
        try {
            const response = await ApiInstance.get(USER_API_PATH)
            return dispatch({ type: "GET_USERS", payload: response?.data?.users })
        } catch (error: any) {
            dispatch({ type: "USER_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to get users.", status: false, statusCode: error?.status ?? 500 } })
        }
    }

    const getUserById = async (id: string) => {
        dispatch({ type: "FETCH_INIT_USER" })
        try {
            const response = await ApiInstance.get(USER_API_PATH + `/${id}`)
            return dispatch({ type: "FETCH_USERS_BY_ID", payload: response?.data?.user })
        } catch (error: any) {
            dispatch({ type: "USER_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to get user.", status: false, statusCode: error?.status ?? 500 } })
        }
    }

    const createUser = async (user: CreateUserPayload) => {
        dispatch({ type: "FETCH_INIT_USER" })
        try {
            const response = await ApiInstance.post(USER_API_PATH, user)
            return dispatch({ type: "CREATE_USER", payload: response?.data?.user })
        } catch (error: any) {
            dispatch({ type: "USER_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to create user.", status: false, statusCode: error?.status ?? 500 } })
        }
    }

    const patchUser = async (id: string, user: PatchUserPayload) => {
        dispatch({ type: "FETCH_INIT_USER" })
        try {
            const response = await ApiInstance.patch(USER_API_PATH + `/${id}`, user)
            return dispatch({ type: "PATCH_USER", payload: response?.data?.user })
        } catch (error: any) {
            dispatch({ type: "USER_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to update user.", status: false, statusCode: error?.status ?? 500 } })
        }
    }

    const deleteUser = async (id: string) => {
        dispatch({ type: "FETCH_INIT_USER" })
        try {
            const response = await ApiInstance.delete(USER_API_PATH + `/${id}`)
            return dispatch({ type: "DELETE_USER", payload: id })
        } catch (error: any) {
            dispatch({ type: "USER_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to delete user.", status: false, statusCode: error?.status ?? 500 } })
        }
    }

    return (
        <UserContext.Provider value={{ ...state, createUser, deleteUser, fetchUsers, getUserById, patchUser }}>
            {children}
        </UserContext.Provider >
    )
}

export const useUser = () => {
    const user = useContext(UserContext);
    if (!user) throw new Error("useUser must be used inside UserProvider")
    return user;
}