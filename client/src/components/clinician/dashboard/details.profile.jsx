import { Card, Label } from "flowbite-react";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { setSection } from "../../../redux/profileSection/SectionSlice";
import { useForm } from "react-hook-form";


export default function DetailSection() {

  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <Card className="card-reset max-w-full md:max-w-4xl shadow-sm">
        <div className="!py-4 border-b-2 border-b-gray-200 dark:border-b-gray-500 flex justify-between items-center">
          <div>
            <h3 className=" font-semibold text-xl">Basic Profile</h3>
            <p className="text-xs text-gray-400">
              click on update to edit or update a information
            </p>
          </div>
          <CiEdit
            size={"2em"}
            className="cursor-pointer "
            onClick={() => dispatch(setSection("update"))}
          />
        </div>
        <div className="flex flex-col sm:flex-row divide-y-2 sm:divide-none">
          <div className=" grid place-items-center sm:order-2 mt-4 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt="user-profile"
              className="w-32 h-32 rounded-full object-cover drop-shadow-lg hover:scale-[1.02] transition-transform mx-auto sm:w-48 sm:h-48"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 !gap-y-4 flex-1">
            <div>
              <Label>First name</Label>
              <p>Conficius</p>
            </div>
            <div>
              <Label>Last name</Label>
              <p>Adda</p>
            </div>
            <div>
              <Label>Email address</Label>
              <p>addawebadua@gmail.com</p>
            </div>
            <div>
              <Label>Phone number</Label>
              <p>+233249906015</p>
            </div>
            <div>
              <Label>Region</Label>
              <p>Upper east</p>
            </div>
            <div>
              <Label>Digital address</Label>
              <p>UK-004-3248</p>
            </div>
            <div>
              <Label>institution affliated with</Label>
              <p>Tamale Teaching hospital</p>
            </div>
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
}
