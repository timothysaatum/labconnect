import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
    </>
  );
};

const LabLogo = ({ form }) => {
  const fileref = form.register("logo");
  const filePickRef = useRef(null);
  const [imageFile, setImagefile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      setImagefile(file);
    }
    form.clearErrors("logo");
  };
  useEffect(() => {
    form.setValue("logo", imageFile);
  }, [imageFile]);

  useEffect(() => {
    const validateLogo = async () => {
      const isValid = await form.trigger("logo");
      if (!isValid && imageFile?.length > 0) {
        setImagefile(null);
        form.setValue("logo", undefined);
        toast.error(form.formState.errors.logo.message);
      }
    };
    validateLogo();
  }, [imageFile]);

  console.log(form.formState.errors);

  return (
    <div className="grid gap-8 text-center">
      <h4 className="text-xl font-semibold">Upload Laboratory Logo</h4>
      <div className="flex justify-center items-center">
        <FormField
          name="logo"
          render={({}) => (
            <FormItem className="hidden">
              <FormLabel>Choose Logo (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...fileref}
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={filePickRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!imageFile || !imageFile[0] ? (
          <div
            className="w-full h-32 rounded-md flex items-center cursor-pointer justify-center flex-col border-dashed border-muted border-[1px]"
            onClick={() => filePickRef.current.click()}
          >
            <FileSvgDraw />
          </div>
        ) : (
          <div>
            <div
              onClick={() => filePickRef.current.click()}
              className="grid place-items-center w-fit h-fit rounded-full outline-dashed outline-offset-4 outline-muted outline-[1px]"
            >
              <img
                src={imageFile[0] ? URL.createObjectURL(imageFile[0]) : null}
                alt="lab logo"
                className="w-56 h-56 rounded-full cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabLogo;
