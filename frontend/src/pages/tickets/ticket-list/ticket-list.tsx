import React, { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useTicket, type TICKET } from "@/context/TicketContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Equal, PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { commonBadgeStyle, convertDate, priorityStyles, taskStatusStyle, ticketStatus } from '../../../lib/utils';

import LoadingComponent from "@/components/loading";

const priorityIcons: any = {
    HIGH: <ChevronUp className="h-4 w-4" />,
    MEDIUM: <Equal className="h-4 w-4" />,
    LOW: <ChevronDown className="h-4 w-4" />,
};

const TicketList = () => {
    const { user } = useAuth();
    const { tickets, fetchTickets, loading, error, deleteTicket } = useTicket();
    const navigate = useNavigate();

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchTickets();
    }, []);

    if (loading) {
        return <LoadingComponent message="We are fetching your ticket." />
    }
    return (
        <section className="p-10 flex flex-col space-y-8 bg-muted/30">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl"> Tickets </h1>
                {
                    isAdmin && (
                        <Button className="cursor-pointer" onClick={() => navigate("create-ticket")}>
                            Create Ticket <PlusIcon />
                        </Button>
                    )
                }

            </div>

            <Table className="border border-primary rounded-xs">
                <TableHeader>
                    <TableRow className="bg-accent uppercase tracking-wider text-blue-950 border border-primary">
                        <TableHead className="font-semibold w-100 text-center">
                            Title
                        </TableHead>
                        {/* <TableHead className="w-[25] overflow-hidden">Description</TableHead> */}
                        <TableHead className="font-semibold text-center">
                            Status
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                            Priority
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                            Assignee
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                            Created By
                        </TableHead>
                        {
                            isAdmin && (
                                <TableHead className="font-semibold text-center">
                                    Action
                                </TableHead>
                            )
                        }
                        <TableHead className="font-semibold text-center">
                            Due Date
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket: TICKET) => (
                        <TableRow key={ticket._id} className="text-center">
                            <TableCell className="font-medium capitalize underline w-100 text-left">
                                <Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link>
                            </TableCell>
                            <TableCell className="capitalize">
                                <Badge
                                    className={clsx('uppercase', commonBadgeStyle, taskStatusStyle[ticket?.status?.toLowerCase()])}
                                >
                                    {ticketStatus[ticket.status?.toLowerCase() as keyof typeof ticketStatus]}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={clsx('uppercase', commonBadgeStyle,
                                        priorityStyles[ticket.priority]
                                    )}
                                >
                                    {priorityIcons[ticket.priority]}
                                    {ticket.priority}
                                </Badge>
                            </TableCell>

                            {/* <TableCell>{ticket.description}</TableCell> */}
                            <TableCell className="capitalize">
                                {ticket.assignedTo.userName}
                            </TableCell>
                            <TableCell className="capitalize">
                                {ticket.createdBy.userName}
                            </TableCell>
                            {
                                isAdmin && (
                                    <TableCell className="capitalize">
                                        <Button
                                            variant="destructive"
                                            size={"sm"}
                                            className="px-6 cursor-pointer"
                                            onClick={() => deleteTicket(ticket._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                )
                            }
                            <TableCell>{convertDate(ticket?.dueDate)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {
                tickets?.length === 0 && (
                    <div className="text-center p-4 mx-auto">You currently do not have any tickets assigned to you.</div>
                )
            }
        </section>
    );
};

export default TicketList;
