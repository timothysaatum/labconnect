import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { labRequestSchema } from "@/lib/schema";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MultipleSelector from "../ui/multi-select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RequestForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const form = useForm({
    // resolver: zodResolver(labRequestSchema),
    defaultValues: {
      name_of_patient: "",
      patient_age: "",
      patient_sex: "",
      sample_type: "",
      sample_container: "",
      delivery: "",
      lab: "",
      hospital: "",
      ward: "",
      brief_description: "",
      tests: [],
    },
  });
  const fileRef = form.register("attachment");

  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("Year(s)");
  const labels = ["Year(s)", "Month(s)", "Day(s)"];

  const isMobile = useMediaQuery("(min-width: 640px)");

  const OPTIONS = [
    { label: "Full Blood Count (FBC)", value: "fbc" },
    { label: "Urinalysis (U/A)", value: "urinalysis" },
    { label: "Blood Glucose", value: "bloodGlucose" },
    { label: "Electrolytes", value: "electrolytes" },
    { label: "Liver Function Tests (LFTs)", value: "lft" },
    { label: "Kidney Function Tests (KFTs)", value: "kft" },
    { label: "Lipid Profile", value: "lipidProfile" },
    { label: "HIV Test", value: "hivTest" },
    { label: "Malaria Parasite Detection", value: "malariaParasite" },
    { label: "Hepatitis B Test", value: "hepatitisB" },
    { label: "Hepatitis C Test", value: "hepatitisC" },
    { label: "Urinalysis Culture", value: "urineCulture" },
    { label: "Stool Occult Blood", value: "stoolOccultBlood" },
    { label: "Sputum Culture", value: "sputumCulture" },
    { label: "Widal Test", value: "widalTest" },
  ];

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      console.log(data);

      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await axiosPrivate.post(
        "/hospital/clinician/sample/add/",
        data,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response?.data);
    } catch (error) {
      console.log(error.data);
    }
  };
  return (
    <section>
      <Form {...form}>
        <form
          className={`${
            isDesktop ? "grid grid-cols-2 gap-x-8 gap-y-10" : ""
          } px-4 py-2`}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="name_of_patient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Patient</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Name of patient" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient's age</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="numeric"
                      placeholder="Patient's age"
                      autoComplete="off"
                      maxLength={3}
                      {...field}
                    />
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                      <DropdownMenuTrigger
                        asChild
                        className="absolute right-0 top-0 h-full"
                      >
                        <Button variant="ghost" className="text-gray-500">
                        {label} <ChevronDown size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={`${
                          isMobile ? `w-[50px] ` : "w-[20px]"
                        }`}
                      >
                        {labels.map((label) => (
                          <DropdownMenuItem
                            key={label}
                            onClick={() => setLabel(label)}
                          >
                            {isMobile ? label : label.charAt(0)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patient_sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient gender</FormLabel>
                <Select
                  onValueChange={(newValue) => {
                    field.onChange(newValue);
                    form.clearErrors("gender");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Patient sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="sample_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Type</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sample type"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="sample_container"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Container</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sample container"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="delivery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Delivery Service <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Delivery Service"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lab"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient gender</FormLabel>
                <Select
                  onValueChange={(newValue) => {
                    field.onChange(newValue);
                    form.clearErrors("lab");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose laboratory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Hospital"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="ward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ward</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ward"
                    {...field}
                    size="small"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="attachment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Attachment" {...fileRef} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tests"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tests</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    defaultOptions={OPTIONS}
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        Test not found
                      </p>
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brief_description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Brief Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="col-span-2">
            Submit Request
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default RequestForm;
