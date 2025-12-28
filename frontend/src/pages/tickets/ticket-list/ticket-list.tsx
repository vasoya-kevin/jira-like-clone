import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import s from './table.module.css'

import { useTicket, type TICKET } from "@/context/TicketContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Equal, PlusIcon, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { commonBadgeStyle, convertDate, priorityStyles, taskStatusStyle, ticketStatus } from '../../../lib/utils';

import LoadingComponent from "@/components/loading";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "@/components/modals";
import { DialogClose } from "@/components/ui/dialog";

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
        return <LoadingComponent message="We are fetching your ticket?." />
    }

    return (
        <section className="p-10 flex flex-col space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-Staatliches tracking-wider"> Tickets </h1>
                <Button className="cursor-pointer" onClick={() => navigate("create-ticket")}>
                    Create Ticket <PlusIcon />
                </Button>
            </div>
            <Input className="" placeholder="Search Ticket ..." />

            <Table >
                <TableHeader >
                    <TableRow className="bg-primary uppercase tracking-wider border border-primary hover:bg-primary">
                        <TableHead className={`w-100 text-center ${s['table-head']}`}>
                            Title
                        </TableHead>
                        {/* <TableHead className="w-[25] overflow-hidden">Description</TableHead> */}
                        <TableHead className={s['table-head']}>
                            Status
                        </TableHead>
                        <TableHead className={s['table-head']}>
                            Priority
                        </TableHead>
                        <TableHead className={s['table-head']}>
                            Assignee
                        </TableHead>
                        <TableHead className={s['table-head']}>
                            Created By
                        </TableHead>
                        {
                            isAdmin && (
                                <TableHead className={s['table-head']}>
                                    Action
                                </TableHead>
                            )
                        }
                        <TableHead className={s['table-head']}>
                            Due Date
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket: TICKET) => (
                        <TableRow key={ticket?._id} className="text-center">
                            <TableCell className="text-blue-950 border border-primary font-medium capitalize underline w-100 text-left">
                                <Link to={`/tickets/${ticket?._id}`}>{ticket?.title}</Link>
                            </TableCell>

                            <TableCell className={s['border-primary-capitialize']}>
                                <Badge
                                    className={clsx('uppercase', commonBadgeStyle, taskStatusStyle[ticket?.status?.toLowerCase()])}
                                >
                                    {ticketStatus[ticket?.status?.toLowerCase() as keyof typeof ticketStatus]}
                                </Badge>
                            </TableCell>

                            <TableCell className={s['border-primary-capitialize']}>
                                <Badge
                                    className={clsx('uppercase', commonBadgeStyle,
                                        priorityStyles[ticket?.priority]
                                    )}
                                >
                                    {priorityIcons[ticket?.priority]}
                                    {ticket?.priority}
                                </Badge>
                            </TableCell>

                            {/* <TableCell>{ticket?.description}</TableCell> */}
                            <TableCell className={s['border-primary-capitialize']}>
                                {ticket?.assignedTo?.userName ?? '-'}
                            </TableCell>

                            <TableCell className={s['border-primary-capitialize']}>
                                {ticket?.createdBy?.userName ?? '-'}
                            </TableCell>

                            {
                                isAdmin && (
                                    <TableCell className={s['border-primary-capitialize']}>
                                        <DeleteModal
                                            trigger={'Delete'}
                                            triggerClassName="bg-destructive px-4 py-2 rounded-sm text-white cursor-pointer"
                                        >
                                            <div className="flex justify-end gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="ghost" size="sm">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteTicket(ticket?._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>

                                        </DeleteModal>
                                    </TableCell>
                                )
                            }

                            <TableCell className={s['border-primary-capitialize']}>{convertDate(ticket?.dueDate)}</TableCell>
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
