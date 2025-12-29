import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import s from './table.module.css'

import { initialTicketState, useTicket, type TICKET, type TicketFilters } from "@/context/TicketContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Equal, PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { commonBadgeStyle, convertDate, priorityStyles, taskStatusStyle, TicketPriority, TicketStatus, ticketStatus } from '../../../lib/utils';

import LoadingComponent from "@/components/loading";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "@/components/modals";
import { DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import ErrorMessage from "@/components/atoms/error-message";

const priorityIcons: any = {
    HIGH: <ChevronUp className="h-4 w-4" />,
    MEDIUM: <Equal className="h-4 w-4" />,
    LOW: <ChevronDown className="h-4 w-4" />,
};

const initalFilterState = {
    limit: 10,
    page: 1,
    priority: '',
    status: '',
    search: '',
    assignee: ''
}

const TicketList = () => {
    const { user } = useAuth();
    const { users: userList, fetchUsers } = useUser();
    const { tickets, fetchTickets, meta, loading, error, deleteTicket } = useTicket();
    const [filter, setFilter] = useState<TicketFilters>(initalFilterState);
    console.log('filter: ', filter);
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (filter.search) {
                fetchTickets(filter);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [filter.search]);

    useEffect(() => {
        fetchTickets(filter);
    }, [
        filter.priority,
        filter.status,
        filter.assignee,
        filter.page,
        filter.limit
    ]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault(); // optional for onChange
        setFilter((prev) => ({ ...prev, search: e.target.value }));
    };

    const resetFilter = () => {
        setFilter(initalFilterState);
        fetchTickets(initalFilterState);
    }

    const totalPages = meta?.pages ?? 0
    const currentPage = meta?.page ?? 1

    const canGoPrev = currentPage > 1
    const canGoNext = currentPage < totalPages

    if (error) {
        return <ErrorMessage message={error?.message} />
    }

    const filterUserList = isAdmin ? userList : userList.filter((u) => u._id === user?._id && user.role === "user")

    return (
        <section className="p-5 2xl:p-10 flex flex-col space-y-8 w-full box-border">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-Staatliches tracking-wider"> Tickets </h1>
                <Button className="cursor-pointer" onClick={() => navigate("create-ticket")}>
                    Create Ticket <PlusIcon />
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <Input
                    placeholder="Search Ticket ..."
                    value={filter.search || ""}
                    onChange={(e) => handleSearch(e)}
                />
                <Select value={filter.priority} onValueChange={(e) => {
                    setFilter((prev) => ({ ...prev, page: 1, priority: e as any }))
                }}>
                    <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectContent>
                            {
                                TicketPriority?.map((priority) => (
                                    <SelectItem key={priority?.value} value={priority?.value}>{priority?.label}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </SelectContent>
                </Select>
                <Select value={filter.status} onValueChange={(e) => {
                    setFilter((prev) => ({ ...prev, page: 1, status: e as any }))
                }}>
                    <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            TicketStatus?.map((status) => (
                                <SelectItem key={status?.value} value={status?.value}>{status?.label}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <Select value={filter.assignee} onValueChange={(e) => {
                    setFilter((prev) => ({ ...prev, page: 1, assignee: e as any }))
                }}>
                    <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            filterUserList?.map((user) => (
                                <SelectItem key={user?._id} value={user?._id}>{user?.userName}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="flex ml-auto  items-center justify-end gap-4">
                <p className="px-8 bg-neutral-100 py-1.5 rounded-md">Total: {(meta as any)?.total ?? 0}</p>
                <Button className="w-fit cursor-pointer" onClick={() => resetFilter()} type="button">
                    Reset Filter
                </Button>
            </div>

            {
                loading ? <LoadingComponent className="min-h-96!" message="We are fetching tickets which are assingned to you." /> :
                    <>
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
                                        <TableCell className="text-blue-950 border border-primary font-medium capitalize underline max-w-100 truncate text-left">
                                            <Link to={`/tickets/${ticket?._id}`} className="block truncate">
                                                {ticket?.title}
                                            </Link>
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
                            tickets?.length > 0 &&
                            <Pagination>
                                <PaginationContent>

                                    {/* Previous */}
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                canGoPrev &&
                                                setFilter((prev) => ({
                                                    ...prev,
                                                    page: prev.page as number - 1,
                                                }))
                                            }
                                            aria-disabled={!canGoPrev}
                                            className={!canGoPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {/* Page numbers */}
                                    {Array.from({ length: meta?.pages ?? 0 }).map((_, index) => {
                                        const page = index + 1;

                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    isActive={page === meta?.page}
                                                    onClick={() =>
                                                        setFilter((prev) => ({
                                                            ...prev,
                                                            page,
                                                        }))
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {/* Next */}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                canGoNext &&
                                                setFilter((prev) => ({
                                                    ...prev,
                                                    page: prev.page as number + 1,
                                                }))
                                            }
                                            aria-disabled={!canGoNext}
                                            className={!canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                </PaginationContent>
                            </Pagination>
                        }
                    </>
            }
            {
                tickets?.length === 0 && (
                    <div className="text-center p-4 mx-auto">You currently do not have any tickets assigned to you.</div>
                )
            }
        </section>
    );
};

export default TicketList;
