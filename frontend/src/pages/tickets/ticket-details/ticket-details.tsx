import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTicket, type TICKET } from '@/context/TicketContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { priorityStyles, taskStatusStyle } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Trash } from "lucide-react";
import { Loading } from "@/components";
interface TicketViewProps {
  onBack?: () => void;
}

const TicketView: React.FC<TicketViewProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { users: userList, fetchUsers } = useUser();
  const { fetchTicketById, ticketById: ticket, updateTicket, deleteTicket, loading: loadingTicketDetail } = useTicket();

  const { id } = useParams();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const [editMode, setEditMode] = useState(false);

  // const { register, handleSubmit, control } = useForm<TICKET>({
  //   defaultValues: { ...ticket },
  // });

  const onSubmit = (data: TICKET) => {
    updateTicket(id!, data);
    setEditMode(false);
  };

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchTicketById(id as string);
  }, [id]);

  if (loadingTicketDetail) {
    return <Loading message="We are gathering information regarding ticket." />
  }

  return (
    <div className="w-full bg-gray-50 px-8 py-12">
      <div className="w-full bg-gray-50 px-8 py-12">
        <Card className="w-full max-w-6xl mx-auto shadow-lg border border-gray-200 rounded-xl overflow-hidden py-0 pb-10">
          {/* Header */}
          <CardHeader className="text-primary p-6 bg-accent">
            <CardTitle className="text-2xl font-bold">{ticket?.title}</CardTitle>
            <p className="mt-1 text-sm opacity-80 font-semibold">Assignee: {ticket?.assignedTo.userName}</p>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-8">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-gray-800">Description</h4>
              <textarea readOnly className="mt-2 text-gray-700 text-lg whitespace-pre-line border p-2 rounded-sm bg-accent" value={ticket?.description}></textarea>
            </div>
            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">Status</h4>
                <Badge className={`mt-1 px-4 py-1 rounded-full font-medium ${taskStatusStyle[ticket?.status?.toLowerCase() as any]}`}>
                  {ticket?.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">Priority</h4>
                <Badge className={`mt-1 px-4 py-1 rounded-full font-medium ${priorityStyles[ticket?.priority as any]}`}>
                  {ticket?.priority}
                </Badge>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">Created By</h4>
                <p className="mt-1 text-md">{ticket?.createdBy?.userName}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-800">Due Date</h4>
                <p className="mt-1 text-sm">{new Date(ticket?.dueDate as string).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Button onClick={onBack} className="bg-gray-800 hover:bg-gray-900 text-white">
                Back
              </Button>
              {
                isAdmin && (
                  <Button onClick={() => {
                    deleteTicket(id!)
                    navigate('/tickets')
                  }} variant='destructive'>
                    <Trash /> Delete Ticket
                  </Button>
                )
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketView;

