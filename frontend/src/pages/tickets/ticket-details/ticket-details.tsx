import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTicket, type TICKET } from "@/context/TicketContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { priorityStyles, taskStatusStyle, TicketPriority, TicketStatus } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Edit, Trash } from "lucide-react";
import { Loading } from "@/components";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { DeleteModal } from "@/components/modals";
import { DialogClose } from "@/components/ui/dialog";
interface TicketViewProps {
  onBack?: () => void;
}

const TicketView: React.FC<TicketViewProps> = () => {
  const { user } = useAuth();
  const { users: userList, fetchUsers } = useUser();
  const [edit, setEdit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    fetchTicketById,
    ticketById: ticket,
    updateTicket,
    deleteTicket,
    loading: loadingTicketDetail,
  } = useTicket();

  const { id } = useParams();
  const navigate = useNavigate();
  const { handleSubmit, control, formState: { errors, isSubmitting }, register, reset } = useForm<TICKET>();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (id) {
      fetchTicketById(id as string);
    } else {
      navigate("/tickets");
    }
  }, [id]);

  if (loadingTicketDetail) {
    return <Loading message="We are gathering information regarding ticket." />;
  }

  const handleEditTicket = () => {
    setEdit(true)
    reset({
      title: ticket?.title,
      assignedTo: user?._id as any,
      description: ticket?.description,
      dueDate: ticket?.dueDate ? new Date(ticket.dueDate).toISOString().split("T")[0] // yyyy-mm-dd for input[type=date]
        : "",
      priority: ticket?.priority,
      status: ticket?.status,
    })
  }

  const cancleEdit = () => {
    setEdit(false)
    reset()
  }

  const handleUpdateTicket = handleSubmit(async (data) => {
    try {
      updateTicket(id!, data);
      setEdit(false);
    } catch (error) {
      console.log("error: ", error);
    }
  });

  return (
    <div className="w-full bg-gray-100 px-8 py-12 box-border">
      <div className="w-full bg-gray-100 px-8 py-12">
        <Card className="w-full max-w-6xl mx-auto shadow-lg border border-gray-200 rounded-xl overflow-hidden py-0 pb-10">
          {/* Header */}
          <CardHeader className="grid grid-cols-4 text-primary p-6 bg-accent">
            <div className={`col-span-3 ${edit ? 'space-y-4' : 'space-y-2'}`}>
              {
                edit ?
                  <>
                    <div className="flex gap-2">
                      <Label className="font-semibold">Title: </Label>
                      <Input
                        {...register("title", { required: 'Title is required.' })}
                        className="w-full border border-gray-400 rounded px-2 py-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="font-semibold">Assignee: </Label>
                      <Controller
                        name="assignedTo"
                        control={control}
                        rules={{ required: 'Assignee is required.' }}
                        render={({ field }) => (
                          <Select value={field.value as any} onValueChange={field.onChange}>
                            <SelectTrigger className="text-center rounded-xs border border-gray-200">
                              <SelectValue placeholder="Select Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                userList?.map((u) => {
                                  return (
                                    <SelectItem value={u._id}>{u.userName}</SelectItem>
                                  )
                                })
                              }
                            </SelectContent>
                          </Select>
                        )
                        }
                      />
                    </div>
                  </>
                  : <>
                    <CardTitle className="text-2xl font-bold">
                      {ticket?.title}
                    </CardTitle>
                    <p className="mt-1 text-sm opacity-80 font-semibold flex items-center gap-1 ">
                      Assignee:{" "}
                      {ticket?.assignedTo?.userName ?? (
                        <span className="px-4 py-1 rounded-md text-white bg-primary">
                          Unassigned
                        </span>
                      )}
                    </p>
                  </>
              }


            </div>
            <div className="flex justify-between items-center justify-self-end">
              {edit ?
                <>
                  <Button className="cursor-pointer" onClick={() => handleUpdateTicket()} disabled={isSubmitting}>
                    {
                      isSubmitting ? <>
                        <Spinner />
                        Applying...
                      </>
                        : 'Apply'
                    }
                  </Button>
                  <Button className="cursor-pointer" variant={"ghost"} onClick={() => cancleEdit()}>
                    Cancel
                  </Button>
                </>
                :
                <Button className="cursor-pointer" onClick={() => handleEditTicket()}>
                  Update Ticket <Edit />
                </Button>
              }
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-8">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-gray-800">
                Description
              </h4>
              {
                edit ? <Textarea
                  className="mt-2 text-gray-700 text-lg whitespace-pre-line border p-2 rounded-sm bg-accent"
                  {...register("description", {
                    required: "Description is required."
                  })}
                />
                  :
                  <Textarea
                    readOnly
                    className="mt-2 text-gray-700 text-lg whitespace-pre-line border p-2 rounded-sm bg-accent"
                    defaultValue={ticket?.description}
                  />
              }

            </div>
            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">Status</h4>
                {
                  edit ? <Controller
                    control={control}
                    name="status"
                    rules={{ required: "Status is required" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            TicketStatus?.map((status) => (
                              <SelectItem key={status?.value} value={status?.value}>{status?.label}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    )}
                  /> : <Badge
                    className={`mt-1 px-4 py-1 rounded-full font-medium ${taskStatusStyle[ticket?.status?.toLowerCase() as any]
                      }`}
                  >
                    {ticket?.status.replace("_", " ")}
                  </Badge>
                }

              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">
                  Priority
                </h4>
                {
                  edit ?
                    <Controller
                      control={control}
                      name="priority"
                      rules={{ required: "Priority is required" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11 text-primary">
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
                      )}
                    /> :
                    <Badge
                      className={`mt-1 px-4 py-1 rounded-full font-medium ${priorityStyles[ticket?.priority as any]
                        }`}
                    >
                      {ticket?.priority}
                    </Badge>
                }

              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">
                  Created By
                </h4>
                <p className="mt-1 text-md">{ticket?.createdBy?.userName}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">
                  Due Date
                </h4>
                {edit ?
                  <input type="date" {...register("dueDate", {
                    required: "Due Date is required."
                  })} /> :
                  <p className="mt-1 text-sm">
                    {new Date(ticket?.dueDate as string).toLocaleDateString()}
                  </p>
                }

              </div>
            </div>
            <div className="mt-4 flex justify-between items-center ml-auto">
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
                    onClick={() => navigate(-1)}
                    className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    Back
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={() => {
                        deleteTicket(id!);
                        navigate("/tickets");
                      }}
                      variant="destructive"
                    >
                      <Trash /> Delete Ticket
                    </Button>
                  )}
                </div>
              </DeleteModal>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketView;
