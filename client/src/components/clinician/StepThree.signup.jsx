import { Label, TextInput } from "flowbite-react";
import Oauth from "../Oauth";

export default function StepThree() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="hefra" value="please enter your hefra number" />
        <TextInput type="text" id="hefra" />
      </div>
      <div>
        <Label htmlFor="facilty" value="name of current facility" />
        <TextInput type="text" id="facilty" />
      </div>
    </div>
  );
}
