import { ApiInstance } from '@/api/api';
import { createContext, useContext, useReducer } from 'react';

export type TASK_STATUS = 'TO DO' | 'IN_PROGRESS' | 'DONE';
export type TICKET_PRIORITY = 'HIGH' | "MEDIUM" | "LOW";
export type USER_DETAILS = {
    _id: string,
    userName: string,
    email: string
};

export type Error = {
    message: string,
    status: false,
    statusCode: number
};

export interface TICKET {
    _id: string
    title: string,
    description: string,
    status: TASK_STATUS,
    priority: TICKET_PRIORITY,
    dueDate: string,
    createdBy: USER_DETAILS
    assignedTo: USER_DETAILS
}

export type ticketState = {
    tickets: TICKET[],
    ticketById: TICKET | null
    loading: boolean,
    error: Error | null
}

export type ticketActions = { type: "FETCH_INIT" }
    | { type: "FETCH_TICKETS", payload: TICKET[] }
    | { type: "TICKET_FETCH_ERROR", payload: Error }
    | { type: "CREATE_TICKET", payload: TICKET }
    | { type: "FETCH_TICKET_BY_ID", payload: TICKET }
    | { type: "PATCH_TICKET", payload: TICKET }
    | { type: "DELETE_TICKET", payload: string }


export function ticketReducer(state: ticketState, action: ticketActions): ticketState {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true };

        case 'FETCH_TICKETS': {
            return { ...state, tickets: action.payload, loading: false, error: null }
        }

        case 'FETCH_TICKET_BY_ID': {
            return { ...state, ticketById: action.payload, loading: false }
        }

        case 'TICKET_FETCH_ERROR': {
            return { ...state, loading: false, error: action.payload }
        }

        case 'CREATE_TICKET': {
            return { ...state, loading: false, tickets: [action.payload, ...state.tickets] }
        }

        case 'PATCH_TICKET': {
            return { ...state, loading: false, tickets: state.tickets.map((ticket) => ticket._id === action.payload._id ? action.payload : ticket) }
        }

        case "DELETE_TICKET":
            return {
                ...state,
                loading: false,
                tickets: state.tickets.filter((t) => t._id !== action.payload),
            }

        default:
            return state
    }
}

export type ticketContextType = ticketState & {
    fetchTickets: () => void
    fetchTicketById: (id: string) => void
    createTicket: (ticket: TICKET) => void
    updateTicket: (id: string, ticket: TICKET) => void
    deleteTicket: (id: string) => void
}

export const initialTicketState: ticketState = {
    tickets: [],
    ticketById: null,
    loading: false,
    error: null
}

export const TicketContext = createContext<ticketContextType | null>(null);
export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(ticketReducer, initialTicketState);

    const fetchTickets = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
            const response = await ApiInstance.get('/tickets');
            dispatch({ type: "FETCH_TICKETS", payload: response.data?.tickets })
        } catch (error: any) {
            dispatch({ type: "TICKET_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to load tickets", status: false, statusCode: error?.status ?? 500 } })
        }
    }

    const fetchTicketById = async (id: string) => {
        dispatch({ type: "FETCH_INIT" })

        try {
            const res = await ApiInstance.get(`/tickets/${id}`)
            dispatch({ type: "FETCH_TICKET_BY_ID", payload: res.data?.tickets })
        } catch (error: any) {
            dispatch({ type: "TICKET_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to load tickets", status: false, statusCode: error?.status ?? 500 } })
        }
    }


    const createTicket = async (ticket: TICKET) => {
        dispatch({ type: "FETCH_INIT" });

        try {
            const response = await ApiInstance.post("/tickets", ticket)
            dispatch({ type: "CREATE_TICKET", payload: response.data?.tickets })
            return response;
        } catch (error: any) {
            dispatch({ type: "TICKET_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to load ticket.", status: false, statusCode: error?.status ?? 500 } })
            throw error;
        }
    }

    const updateTicket = async (id: string, ticket: TICKET) => {
        dispatch({ type: "FETCH_INIT" });
        try {
            const response = await ApiInstance.patch(`/tickets/${id}`, ticket);
            dispatch({ type: "PATCH_TICKET", payload: response.data?.tickets })
            return response;
        } catch (error: any) {
            dispatch({ type: "TICKET_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to load ticket.", status: false, statusCode: error?.status ?? 500 } })
            throw error;
        }
    }

    const deleteTicket = async (id: string) => {
        dispatch({ type: "FETCH_INIT" });
        try {
            const response = await ApiInstance.delete(`/tickets/${id}`);
            dispatch({ type: "DELETE_TICKET", payload: id })
            return response;
        } catch (error: any) {
            console.log('error: ', error);
            dispatch({ type: "TICKET_FETCH_ERROR", payload: { message: error?.response?.data?.message || "Failed to delete ticket.", status: false, statusCode: error?.status ?? 500 } })
            throw error;
        }
    }

    return (
        <TicketContext.Provider value={{ ...state, fetchTickets, updateTicket, createTicket, deleteTicket, fetchTicketById }}>
            {children}
        </TicketContext.Provider >
    )
}

export const useTicket = () => {
    const ticket = useContext(TicketContext);
    if (!ticket) throw new Error("useTicket must be used inside TicketProvider")
    return ticket;
}