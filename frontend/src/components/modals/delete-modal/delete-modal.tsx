import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import React from "react";

interface DeleteModalProps {
    trigger: React.ReactNode;
    dialogTitle?: string;
    dialogDescription?: string;
    children: React.ReactNode;

    triggerClassName?: string;
    contentClassName?: string;
    dialogTitleClassName?: string;
    dialogDescriptionClassName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    trigger,
    dialogTitle = "Are you absolutely sure?",
    dialogDescription = "This action cannot be undone.",
    children,
    triggerClassName,
    contentClassName,
    dialogTitleClassName,
    dialogDescriptionClassName,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className={cn(triggerClassName)}>
                    {trigger}
                </span>
            </DialogTrigger>

            <DialogContent className={cn(contentClassName)}>
                <DialogHeader>
                    <DialogTitle className={cn(dialogTitleClassName)}>
                        {dialogTitle}
                    </DialogTitle>

                    <DialogDescription className={cn(dialogDescriptionClassName)}>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
