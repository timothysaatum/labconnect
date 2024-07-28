import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { FormBuilder } from "../formbuilder";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useRejectSampleMutation } from "@/api/mutations";

const reasonSchema = z
  .string()
  .min(1, "Reason is required")
  .max(255, "Reason must be less than 255 characters");

const RejectSample = () => {
  const { mutate } = useRejectSampleMutation();
  const form = useForm({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleMutate = async () => {
    if (form.watch("reason") === "") return toast.error("Reason is required");
    mutate(form.getValues("reason"));
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <span className="relative gap-2 text-destructive flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-destructive">
            Reject Sample
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-sm:max-w-[90vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will reject the sample and
              inform the the referor of the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form className="grid gap-2">
            <Form {...form}>
              <FormBuilder
                control={form.control}
                name={"reason"}
                label={"Why are you rejecting this sample?"}
                message
                description={"This reason will be sent to the referor"}
              >
                <Textarea maxLength={255} className="resize-y" />
              </FormBuilder>
            </Form>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMutate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RejectSample;
