import s from '@/pages/tickets/ticket-list/table.module.css'

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Loading } from '@/components';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Edit, PlusIcon, TrashIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useUser, type PatchUserPayload, type User } from '@/context/UserContext';
import { Controller, useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ErrorMessage from '@/components/atoms/error-message';
import { DeleteModal } from '@/components/modals';
import { DialogClose } from '@/components/ui/dialog';

const UserListPage = () => {
    const navigate = useNavigate();

    const { user: loggedInUser } = useAuth();
    const [editingUserId, setEditingUserId] = useState<string | null>(null);


    const { fetchUsers, loading, users, deleteUser, patchUser, error } = useUser();

    const { handleSubmit, register, control, reset, } = useForm<PatchUserPayload>()

    const isAdmin = loggedInUser!.role === "admin"

    useEffect(() => {
        if (loggedInUser?.role === 'admin') {
            fetchUsers();
        } else {
            navigate('/')
        }
    }, [loggedInUser]);

    if (loading) {
        return <Loading message='we are gathering information for you.' />
    }

    const startEdit = (user: User) => {
        setEditingUserId(user._id);
        reset({
            userName: user.userName,
            role: user.role,
        });
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        reset();
    };


    const handleUpdateUser = (userId: string) =>
        handleSubmit(async (data) => {
            try {
                // await updateUser(userId, data);
                console.log("Updating:", userId, data);
                const response = await patchUser(userId, data)
                setEditingUserId(null);
                console.log('response: ', response);
            } catch (error) {
                console.error(error);
            }
        });

    return (
        <section className="p-10 flex flex-col space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-Staatliches tracking-wider"> USERS </h1>
                {
                    isAdmin && (
                        <Button className="cursor-pointer" onClick={() => navigate("create-user")}>
                            Create User <PlusIcon />
                        </Button>
                    )
                }
            </div>
            <Table >
                <TableHeader >
                    <TableRow className="bg-primary uppercase tracking-wider border border-primary hover:bg-primary">
                        <TableHead className={`w-100 text-center ${s['table-head']}`}>
                            User Name
                        </TableHead>
                        {/* <TableHead className="w-[25] overflow-hidden">Description</TableHead> */}
                        <TableHead className={s['table-head']}>
                            Email
                        </TableHead>
                        <TableHead className={s['table-head']}>
                            Role
                        </TableHead>
                        {
                            isAdmin && (
                                <>
                                    <TableHead className={s['table-head']}>
                                        Edit
                                    </TableHead>
                                    <TableHead className={s['table-head']}>
                                        Delete
                                    </TableHead>
                                </>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user: User) => {
                        const disabledAdmin = isAdmin && user?._id === loggedInUser?._id
                        return (
                            <TableRow key={user?._id} className="text-center">
                                <TableCell className="border border-primary font-semibold">
                                    {editingUserId === user._id ? (
                                        <input
                                            {...register("userName", { required: true })}
                                            className="w-full border rounded px-2 py-1"
                                        />
                                    ) : (
                                        user.userName
                                    )}
                                </TableCell>

                                <TableCell className="text-blue-950 border border-primary font-semibold text-center">
                                    {user?.email}
                                </TableCell>
                                <TableCell className="border border-primary capitalize font-semibold">
                                    <div className="flex justify-center">
                                        {editingUserId === user._id ? (
                                            <Controller
                                                control={control}
                                                name="role"
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-[120px] text-center rounded-xs">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">User</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        ) : (
                                            <span className="text-center">{user.role}</span>
                                        )}
                                    </div>
                                </TableCell>

                                {
                                    isAdmin && (
                                        <>
                                            <TableCell className='border border-primary'>
                                                {editingUserId === user._id ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <Button size="sm" onClick={handleUpdateUser(user._id)}>
                                                            Apply
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-500"
                                                        onClick={() => startEdit(user)}
                                                    >
                                                        <Edit className="mr-1" />
                                                        Edit
                                                    </Button>
                                                )}
                                            </TableCell>

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

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span
                                                                    className={clsx({
                                                                        "cursor-not-allowed": disabledAdmin,
                                                                        "cursor-pointer": !disabledAdmin
                                                                    })}
                                                                >
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="px-6"
                                                                        disabled={disabledAdmin}
                                                                        onClick={() => {
                                                                            deleteUser(user?._id);
                                                                        }}
                                                                    >
                                                                        <TrashIcon />
                                                                        Delete
                                                                    </Button>
                                                                </span>
                                                            </TooltipTrigger>

                                                            <TooltipContent>
                                                                <p>
                                                                    {disabledAdmin
                                                                        ? "You can not delete Admin User"
                                                                        : "Are you sure you want to delete?"}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </DeleteModal>
                                            </TableCell>
                                        </>
                                    )
                                }
                            </TableRow>
                        )
                    })}
                </TableBody>
                {
                    error &&
                    <ErrorMessage message={error?.message} />
                }
            </Table>
        </section>
    );
};

export default UserListPage;
