import mongoose from "mongoose";

const TicketsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["TO DO", "IN_PROGRESS", "DONE"],
            default: "TO DO",
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },
        dueDate: Date,
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

export const Tickets = mongoose.model("Tickets", TicketsSchema);


export const getTickets = () => Tickets.find();
export const getTicketById = (id) => Tickets.findById(id);

// export const getAllTicket = () => Tickets.find();
// export const getTicketById = (id) => Tickets.findById(id);
// export const createTicket = (values) => new Tickets.create(values).save().then((ticket) => ticket.toObject());
