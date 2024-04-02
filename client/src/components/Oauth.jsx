import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

export default function Oauth() {
  return (
    <Button type="button" gradientDuoTone="pinkToOrange" outline>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
