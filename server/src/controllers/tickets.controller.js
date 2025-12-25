import { ticketBodyValidator } from "#helpers/tickets.helper.js";
import { getTicketById, getTickets, Tickets } from "#models/tickets.model.js";
import lodash from "lodash";

const { isEmpty } = lodash;

export const getAllTickets = async (request, response) => {
    try {
        const { user } = request;
        const { page = 1, limit = 10, status, priority, search } = request.query;

        const filter = {};

        if (user.role === "user") filter.assignedTo = user._id;

        if (status) filter.status = status;

        if (priority) filter.priority = priority;

        if (search) filter.title = { $regex: search, $options: "i" };

        const tickets = await Tickets.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ dueDate: 1 });

        response.status(200).json({ page, limit, tickets, status: true });
    } catch (error) {
        console.log("error: ", error);
        return response
            .status(500)
            .json({ error, message: "Something went wrong.", status: false });
    }
};

export const getTicketsById = async (request, response) => {
    try {
        const { id } = request.params;
        const { user } = request;

        if (!id) {
            return response
                .status(400)
                .json({ status: false, message: "id is missing." });
        }

        const ticket = await getTicketById(id);

        if (!ticket) {
            return response
                .status(404)
                .json({ status: false, message: "Ticket is not found." });
        }

        if (
            user.role !== "admin" &&
            ticket.assignedTo.toString() !== user._id.toString()
        ) {
            return response.status(403).json({
                status: false,
                message: "You are not allowed to view this ticket"
            });
        }

        return response.status(200).json({ status: true, ticket });
    } catch (error) {
        console.log("error: ", error);
        return response
            .status(500)
            .json({ error, message: "Something went wrong.", status: false });
    }
};

export const createTicket = async (request, response) => {
    try {
        const { user, body } = request;

        if (isEmpty(user)) {
            return response
                .status(401)
                .json({ status: false, message: "Unathorized." });
        }

        if (isEmpty(body)) {
            return response
                .status(400)
                .json({ status: false, message: "Request body is missing." });
        }

        for (const key of ticketBodyValidator) {
            if (!body.hasOwnProperty(key) || isEmpty(body[key])) {
                return response.status(400).json({ message: `${key} is missing or empty.` })
            }
        }

        const { title, description, assignedTo, dueDate, priority } = body;

        const ticket = await Tickets.create({
            title,
            description,
            assignedTo,
            dueDate,
            priority,
            createdBy: user._id,
        })

        return response.status(201).json({ ticket, status: true });
    } catch (error) {
        console.log("error: ", error);
        return response
            .status(500)
            .json({ error, message: "Something went wrong.", status: false });
    }
};

export const deleteTicket = async (request, response) => {
    try {
        const { params } = request;

        if (!params.id) {
            return response.status(200).json({ status: false, message: 'id is missing.' })
        }

        const { id } = params;

        const ticket = await getTicketById(id);

        if (!ticket) {
            return response.status(404).json({ message: "Ticket is not found", status: false });
        }

        const deletedTicket = await Tickets.findByIdAndDelete(id);

        return response.status(201).json({ message: 'Ticket Delete Successfully', status: true, id, deletedTicket });
    } catch (error) {
        return response
            .status(500)
            .json({ error, message: "Something went wrong.", status: false });
    }
}

export const updateTicket = async (request, response) => {
    try {
        const { params, body, user } = request;

        if (!params.id) {
            return response.status(200).json({ status: false, message: 'id is missing.' })
        }

        if (isEmpty(body)) {
            return response.status(200).json({ status: false, message: 'Request body is required.' })
        }

        const { id } = params;

        const ticket = await getTicketById(id);

        if (!ticket) {
            return response.status(404).json({ message: "Ticket is not found", status: false });
        }

        console.log(ticket.assignedTo.toString(), user._id?.toString())

        if (user.role === "user" && ticket.assignedTo.toString() !== user._id?.toString()) {
            return response.status(403).json({ message: "You are not allowed to update this ticket", status: false });
        }

        // Allowed fields
        const USER_ALLOWED = ["status"];
        const ADMIN_ALLOWED = ["title", "description", "priority", "status", "assignedTo"];

        const allowFields = user.role === 'admin' ? ADMIN_ALLOWED : USER_ALLOWED;

        const data = {};

        for (const key of allowFields) {
            if (![undefined, null]?.includes(body[key])) {
                data[key] = body[key];
            };
        };

        if (Object.keys(data)?.length === 0) {
            return response.status(400).json({ message: 'no valid field are there for update the ticket.', status: false });
        };


        Object.assign(ticket, data);

        await ticket.save();

        return response.status(200).json({
            status: true,
            message: "Ticket updated successfully",
            ticket
        });
    } catch (error) {
        return response
            .status(500)
            .json({ error, message: "Something went wrong.", status: false });
    }
}