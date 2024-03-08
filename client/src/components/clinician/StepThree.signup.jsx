import { Label, TextInput } from "flowbite-react";

export default function StepThree() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="hefra" value="please enter your hefra number" />
        <TextInput type="text" id="hefra" />
      </div>
      
    </div>
  );
}
