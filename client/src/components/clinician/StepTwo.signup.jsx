import { Label, TextInput } from 'flowbite-react'

export default function StepTwo() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor="firstname" value="firstname" />
        <TextInput type="text" id="firstname"/>
      </div>
      <div>
        <Label htmlFor="lastname" value="lastname" />
        <TextInput type="text" id="lastname" />
      </div>
      <div>
        <Label htmlFor="email" value="email" />
        <TextInput type="email" id="email" />
      </div>
      <div>
        <Label htmlFor="phone" value="phone number" />
        <TextInput type="text" id="phone" />
      </div>
      <div>
        <Label htmlFor="facilty" value="name of current facility" />
        <TextInput type="text" id="facilty" />
      </div>
    </div>
  );
}
