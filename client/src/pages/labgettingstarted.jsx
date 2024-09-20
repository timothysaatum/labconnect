"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Briefcase,
  MapPin,
  Clock,
  Award,
  Upload,
  Truck,
  Building,
  Book,
  Check,
} from "lucide-react";
import { Form, FormDescription } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { FormBuilder } from "../components/formbuilder";
import { PhoneInput } from "../components/ui/phone-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLabSchema } from "../lib/schema";
import { toast } from "sonner";
import { useCreateLab } from "../lib/formactions";
import { number } from "zod";

export default function EnhancedLabSetup() {
  const [step, setStep] = useState(1);
  const [imageFile, setImagefile] = useState(null);
  const [imageUrl, setImagerUrl] = useState(null);
  const form = useForm({
    resolver: zodResolver(CreateLabSchema),
    defaultValues: {
      name: "",
      main_email: "",
      main_phone: "",
      description: "",
    },
  });
  const fieldToStep = {
    name: 1,
    logo: 1,
    main_phone: 1,
    main_email: 1,
    description: 2,
  };
  const onCreateLab = useCreateLab(form, setStep, fieldToStep);
  const fileref = form.register("logo");
  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      setImagefile(file);
      form.setValue("logo", file);
    }
    form.clearErrors("logo");
  };
  console.log(form.getValues());
  //
  const fileInputRef = useRef(null);

  useEffect(() => {
    const validateLogo = async () => {
      const isValid = await form.trigger("logo");
      if (!isValid) {
        toast.error(form.formState.errors.logo.message);
        form.setValue("logo", undefined);
        setImagefile(null);
        setImagerUrl(null);
      } else {
        console.log(isValid);
        if (imageFile) {
          setImagerUrl(URL.createObjectURL(imageFile[0]));
        }
      }
    };

    validateLogo();
  }, [imageFile]);

  const handleNextStep = async () => {
    let fieldToValidate;

    switch (step) {
      case 1:
        fieldToValidate = ["name", "main_email", "main_phone", "logo"];
        break;
      case 2:
        fieldToValidate = ["description"];
        break;
      default:
        fieldToValidate = [];
    }

    const isValid = await form.trigger(fieldToValidate);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
    if (form.formState.errors.logo && step === 1) {
      toast.error(form.formState.errors.logo.message);
    }
  };
  const handlePrevSTep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const getStepColor = (step) => {
    const colors = [
      "from-blue-400 to-indigo-600",
      "from-yellow-400 to-orange-600",
      "from-green-400 to-teal-600",
      "from-pink-400 to-purple-600",
      "from-red-400 to-rose-600",
    ];
    return colors[(step - 1) % colors.length];
  };
  const icons = [
    {
      icon: <Building2 />,
      number: 1,
    },
    {
      icon: <Book />,
      number: 2,
    },
    {
      icon: <Check />,
      number: 3,
    },
  ];
  return (
    <div className="container mx-auto p-4  min-h-screen flex items-center justify-center mt-10">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader
          className={`bg-primary text-white dark:bg-background dark:text:primary rounded-t-lg`}
        >
          <CardTitle className="text-2xl">Set Up Your Laboratory</CardTitle>
          <CardDescription className="text-blue-100">
            Complete the following steps to get started with our sample referral
            system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <div className="flex justify-around mb-2">
              {icons.map((i) => (
                <div key={i.number} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      i.number <= step
                        ? `bg-gradient-to-r ${getStepColor(i.number)}`
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    {i.icon}
                  </div>
                  <div
                    className={`mt-2 text-xs ${i.number <= step ? "text-primary" : "text-gray-400"}`}
                  >
                    {["Basic", "Description", "Summary"][i.number - 1]}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${getStepColor(step)}`}
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreateLab)}
              className="space-y-6"
            >
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="grid gap-6">
                    <div className="space-y-4 md:col-span-2">
                      <Label
                        htmlFor="logo"
                        className="block text-sm font-medium text-muted-foreground"
                      >
                        Laboratory Logo
                      </Label>
                      <div className="flex items-center space-x-4">
                        {imageUrl ? (
                          <div
                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <img
                              src={imageUrl}
                              alt="Lab Logo"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="text-gray-400" />
                          </div>
                        )}
                        <span className="text-muted-foreground text-sm">
                          Must be less than 4mb
                        </span>

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
                                  ref={fileInputRef}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 col-span-2 gap-8">
                      <FormField
                        name="name"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Laboratory Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building2 className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  type="text"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="main_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Laboratory Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  type="text"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="main_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Laboratory Phone</FormLabel>
                            <FormControl>
                              <PhoneInput
                                type="text"
                                className=""
                                {...field}
                                defaultCountry="GH"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Laboratory Description</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" />
                            <Textarea
                              className="pl-10"
                              rows={10}
                              placeholder="Tell us about your laboratory"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          We Recommend you in this section you tell us about
                          your laboratory.Include your mission and vision
                          statements. Elaborate on your specialities and various
                          departments. you can also include awards and
                          achievements
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}

                {step === 3 && (
                  <div className="grid md:grid-cols-2 gap-6 place-items-start">
                    <p className="md:col-span-2 font-mediumm b-4 text-sm">
                      Review your enteries and make corrections if you
                      wish.Submit your laboratory details after review
                    </p>
                    <div className="grid gap-6">
                      <p className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground t">
                          Laboratory Name
                        </span>
                        <span className="font-medium">
                          {form.getValues("name")}
                        </span>
                      </p>
                      <p className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground t">
                          Laboratory Email
                        </span>
                        <span className="font-medium">
                          {form.getValues("main_email")}
                        </span>
                      </p>
                      <p className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground t">
                          Laboratory Phone Number
                        </span>
                        <span className="font-medium">
                          {form.getValues("name")}
                        </span>
                      </p>
                      <p className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground font-medium">
                          Laboratory Description
                        </span>
                        <span>{form.getValues("description")}</span>
                      </p>
                    </div>
                    {imageFile && (
                      <div className="flex items-center justify-center">
                        <div>
                          <img
                            src={imageUrl}
                            alt="Laboratory profile"
                            className="w-[300px] h-[300px] rounded-md object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevSTep}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button
              className={`ml-auto ${step === 1 ? "w-full" : ""}`}
              onClick={handleNextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="ml-auto"
              onClick={form.handleSubmit(onCreateLab)}
            >
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
