import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useTicket } from '@/context/TicketContext';

import { Input } from '@/components/ui/input';
import { Spinner } from "@/components/ui/spinner"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldLabel } from '@/components/ui/field';
import ErrorMessage from '@/components/atoms/error-message';
import { convertDate } from '@/lib/utils';
import { Loading } from '@/components';

type CreateTaskForm = {
  title: string
  description: string
  status: "TO DO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  dueDate: string
  assignedTo: string
  createdBy: string
}

const CreateTicket = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { createTicket, loading, error } = useTicket();

  const { users: userList, loading: usersLoading, error: usersError, fetchUsers } = useUser();

  const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<CreateTaskForm>({
    defaultValues: {
      status: "TO DO",
      priority: "MEDIUM",
    },
  });

  useEffect(() => {
    if ((!user) || user?.role === "user") {
      navigate("/");
    }
    fetchUsers();
  }, [user, navigate]);

  const handleTicketCreation = handleSubmit(async (data: CreateTaskForm) => {
    try {
      const response = await createTicket(data as any);
      navigate('/tickets')
    } catch (error) {
      console.log('error: ', error);
    };
  });

  if (usersLoading) {
    return (
      <Loading message='We are gathering information for your experience.' />
    )
  }

  return (
    <div className="w-full bg-muted/30 px-6 py-10">
      <Card className="w-full max-w-5xl mx-auto shadow-sm">
        <CardHeader className="border-b pb-6">
          <CardTitle className="text-2xl font-semibold">
            Create Ticket
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the details to create and assign a new ticket
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <form
            onSubmit={handleTicketCreation}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
          >
            {/* Title */}
            <div className="col-span-2 space-y-2">
              <FieldLabel>Title</FieldLabel>
              <Input
                className="h-11"
                {...register("title", { required: "Title is required" })}
              />
              <ErrorMessage name='title' errors={errors} />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <FieldLabel>Description</FieldLabel>
              <Textarea
                rows={5}
                className="resize-none"
                {...register("description", { required: "Description is required" })}
              />
              <ErrorMessage name='description' errors={errors} />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <FieldLabel>Status</FieldLabel>
              <Controller
                control={control}
                name="status"
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TO DO">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage name='status' errors={errors} />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <FieldLabel>Priority</FieldLabel>
              <Controller
                control={control}
                name="priority"
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage name='priority' errors={errors} />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <FieldLabel>Due Date</FieldLabel>
              <Input
                type="date"
                className="h-9"
                {...register("dueDate", {
                  required: "Due date is required",
                  // validate: (value: string) => {
                  //   const selectedDate = new Date(value);

                  //   const today = new Date();
                  //   today.setHours(0, 0, 0, 0);

                  //   if (selectedDate < today) {
                  //     return "Due date should not be older than today.";
                  //   }

                  //   return true;
                  // },
                })}
              />
              <ErrorMessage name='dueDate' errors={errors} />
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <FieldLabel>Assignee</FieldLabel>
              <Controller
                control={control}
                name="assignedTo"
                rules={{ required: "Assignee is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Assign user" />
                    </SelectTrigger>
                    <SelectContent>
                      {userList.map(u => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.userName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage name='assignedTo' errors={errors} />
            </div>

            {/* Submit */}
            <div className="col-span-2 flex justify-end pt-6 border-t">
              <Button className="px-10 h-11" type="submit" disabled={isSubmitting} >
                {isSubmitting && <Spinner />}
                Create Ticket
              </Button>
            </div>
          </form>
          {
            error && (
              <ErrorMessage className='text-center' message={error?.message} />
            )
          }
        </CardContent>
      </Card>
    </div>

  )
}

export default CreateTicket
