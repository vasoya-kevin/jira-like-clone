import mongoose from 'mongoose'

const TicketsSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['TO DO', 'IN_PROGRESS', 'DONE'],
        default: 'TO DO'
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    dueDate: Date,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamp: true
});

export const Tickets = mongoose.Model("Tickets", TicketsSchema);