import { Button, Card, Label, TextInput } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

export default function UpdateSection() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      first_name: "Conficius",
      last_name: "Adda",
      email: "addawebadua@gmail.com",
      phone: "+233249906015",
      region: "Upper east",
      digital_address: "UK-004-3248",
      institution: "Tamale Teaching hospital",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <Card className="max-w-full md:max-w-5xl shadow-sm">
    <div className="!py-4 border-b-2 border-b-gray-200 dark:border-b-gray-500 flex justify-between items-center">
        <div>
          <h3 className=" font-semibold text-xl">Update Profile</h3>
          <p className="text-xs text-gray-400">
            Make changes and Submit to update your profile
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row divide-y-2 sm:divide-none gap-10">
        <div className=" grid place-items-center sm:order-2 mt-4 mx-auto">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            alt="user-profile"
            className="w-32 h-32 rounded-full object-cover drop-shadow-lg hover:scale-[1.02] transition-transform mx-auto sm:w-48 sm:h-48"
          />
        </div>
        <form className="flex-1" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-4">
            <div>
              <Label>First name</Label>
              <TextInput
                {...register("first_name", {
                  required: "This field is required",
                })}
              />
            </div>
            <div>
              <Label>Last name</Label>
              <TextInput
                {...register("last_name", {
                  required: "This field is required",
                })}
              />
            </div>

            <div>
              <Label>Email address</Label>
              <TextInput
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            <div>
              <Label>Phone number</Label>
              <TextInput
                addon="+233"
                {...register("phone", {
                  required: "This field is required",
                })}
              />
            </div>
            <div>
              <Label>Region</Label>
              <TextInput
                {...register("region", {
                  required: "This field is required",
                })}
              />
            </div>
            <div>
              <Label>Digital address</Label>
              <TextInput
                {...register("digital_address", {
                  required: "This field is required",
                })}
              />
            </div>
            <div>
              <Label>institution affliated with</Label>
              <TextInput
                disabled
                {...register("institution", {
                  required: "This field is required",
                })}
              />
            </div>
          </div>

          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full mx-auto mt-8 md:w-1/2"
            type="submit"
          >
            Save
          </Button>
        </form>
      </div>
    </Card>
  );
}
