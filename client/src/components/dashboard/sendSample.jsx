import { ChevronsUpDown, Loader2, Paperclip, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormBuilder } from "../formbuilder";
import SelectComponent from "../selectcomponent";
import CalenderDatePicker from "./datepicker";
import {
  useFetchAllDeliveries,
  useFetchAllLabsBranches,
  useFetchLabTests,
  useFetchUserBranches,
} from "@/api/queries";
import PopoverSelect from "../popoverselect";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSampleData,
  selectSampleData,
  setSampleData,
} from "@/redux/formData/sendsampleSave";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { labRequestSchema } from "@/lib/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSendSample } from "@/lib/formactions";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import { Switch } from "../ui/switch";
import MultipleSelectorWithHover from "../ui/multiSelectWithHover";
import { calculateTotalCost } from "@/util/totalCost";

//the prompt dialog
export function RestoreDialog({ open, setOpen, handleDiscard, handleRestore }) {
  const isOpen = useMemo(() => open, [open]);
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Uncompleted Request?</AlertDialogTitle>
          <AlertDialogDescription>
            You have an uncompleted request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDiscard}>Discard</AlertDialogCancel>
          <AlertDialogAction onClick={handleRestore}>Restore</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SendSample() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const savedData = useSelector(selectSampleData);
  const [saving, setSaving] = useState(false);
  const [restore, setRestore] = useState(false);
  const activeBranch = useSelector(selectActiveBranch);
  const [imageFile, setImagefile] = useState(null);
  const [selectedTests, setSelectedTests] = useState(null);
  const [testOptions, setTestOptions] = useState([]);
  const [share, setShare] = useState(false);

  //form declaration
  const form = useForm({
    resolver: zodResolver(labRequestSchema),
    defaultValues: {
      patient_name: "",
      patient_age: "",
      patient_sex: "",
      delivery: "",
      to_laboratory: "",
      referring_facility: activeBranch,
      brief_description: "",
      priority: "",
      sample_status: "Received by delivery",
      payment_mode: "Manual",
      payment_status: "Paid",
      tests: [],
      shareWith: "",
    },
  });

  //send sample action
  const onSendSample = useSendSample(form);

  useEffect(() => {
    if (form.formState.errors.attachment) {
      toast.error(form.formState.errors.attachment.message);
    }
  }, [form.formState.errors.attachment]);
  //genders declaration
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  //fetching user branches
  const {
    data: branches,
    isError: branchesError,
    isLoading: branchesLoading,
  } = useFetchUserBranches();

  // fetching deliveries
  const {
    data: deliveries,
    isLoading: deliveriesLoading,
    isError: deliveriesError,
  } = useFetchAllDeliveries();

  //fetching all labs
  const {
    data: labs,
    isError: labsError,
    isLoading: labsLoading,
  } = useFetchAllLabsBranches();

  //filepicker ref
  const fileref = form.register("attachment");
  const filePickRef = useRef(null);

  //file change

  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      setImagefile(file);
    }
    form.clearErrors("attachment");
  };

  useEffect(() => {
    form.setValue("attachment", imageFile);
  }, [imageFile]);

  // id of lab to fetch tests for
  useEffect(() => {
    setId(form.watch("to_laboratory"));
    form.setValue("tests", []);
  }, [form.watch("to_laboratory")]);

  //fetching selected lab test
  const {
    data: tests,
    isError: testsError,
    isFetching: testsLoading,
  } = useFetchLabTests(id);

  //tests card ref
  const TestsCardRef = useRef(null);

  //saving form to redux
  const handleSave = () => {
    try {
      setSaving(true);
      dispatch(setSampleData(form.getValues()));
      setSaving(false);
      toast.success("form saved. you can complete it later");
    } catch (error) {
      toast.error("error saving form");
    } finally {
      setSaving(false);
    }
  };
  const handleReset = (data) => {
    try {
      form.reset();
      dispatch(clearSampleData());
    } catch (error) {
      console.log(error);
    }
  };

  // populating the form with data from redux

  useEffect(() => {
    if (savedData && restore) {
      form.setValue("patient_name", savedData.patient_name);
      form.setValue("patient_age", savedData.patient_age);
      form.setValue("patient_sex", savedData.patient);
      form.setValue("delivery", savedData.delivery);
      form.setValue("to_laboratory", savedData.to_laboratory);
      form.setValue("brief_description", savedData.brief_description);
      form.setValue("priority", savedData.priority);
      form.setValue("sample_status", savedData.sample_status);
      form.setValue("payment_mode", savedData.payment_mode);
      form.setValue("payment_status", savedData.payment_status);
      form.setValue("tests", savedData.tests);
    }
  }, [savedData, restore]);

  //selecting the active branch automatically
  useEffect(() => {
    if (!savedData && activeBranch) {
      form.setValue("referring_facility", activeBranch);
    }
  }, [activeBranch]);

  // checking to see if there is savedData to show the dialog

  useEffect(() => {
    if (savedData) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, []);

  //handle dialog discard

  const handleDiscard = () => {
    setRestore(false);
    dispatch(clearSampleData());
  };
  const handleRestore = () => {
    setRestore(true);
  };

  //priority levels
  const priority = [
    { label: "Normal", value: "Normal" },
    { label: "Express", value: "Express" },
  ];

  // constructing tests in the multiselct format
  useEffect(() => {
    setTestOptions(
      tests?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );
  }, [tests?.data]);
  //selected tests

  useEffect(() => {
    setSelectedTests(
      form
        .watch("tests")
        ?.map((field) => tests?.data?.find((test) => test.id === field.value))
        .map((test) => ({
          ...test,
          amount_to_pay: test.price - test?.discount_price,
        }))
    );
  }, [form.watch("tests")]);
  console.log(selectedTests);
  return (
    <div className="sm:pl-14 mx-4 py-5 md:py-0">
      <RestoreDialog
        setOpen={setOpen}
        open={open}
        handleDiscard={handleDiscard}
        handleRestore={handleRestore}
      />
      <main className="max-w-5xl mx-auto">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Send Sample
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="secondary" size="sm" onClick={handleReset}>
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                type="button"
                variant="outline"
              >
                Save and continue later
                {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
          <section>
            <Form {...form}>
              <form
                className="grid lg:grid-cols-[1fr_350px] gap-8 sm:py-5"
                noValidate
                onSubmit={form.handleSubmit(onSendSample)}
              >
                <div className="grid gap-4 self-start">
                  <div>
                    <PopoverSelect
                      className="flex whitespace-nowrap gap-8 items-center mb-4"
                      form={form}
                      name={"to_laboratory"}
                      error={labsError}
                      loading={labsLoading}
                      items={labs}
                      label={"Sending sample to:"}
                      title={"Laboratories"}
                      search={"Search laboratory..."}
                    />
                  </div>
                  <Card className="max-sm:border-none">
                    <CardHeader className="max-sm:px-2">
                      <CardTitle className="text-lg">Patient Details</CardTitle>
                      <CardDescription>
                        please enter the correct patient details here
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="max-sm:px-2">
                      <div className="grid gap-4">
                        <div>
                          <FormBuilder
                            name={"patient_name"}
                            label={"Patient Name"}
                            className="grid gap-3"
                          >
                            <Input placeholder="patient name" />
                          </FormBuilder>
                        </div>

                        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                          <div>
                            <SelectComponent
                              label={"Select patient gender"}
                              name={"patient_sex"}
                              placeholder={"Select Patient's gender"}
                              control={form.control}
                              items={gender}
                            />
                          </div>
                          <div>
                            <CalenderDatePicker
                              name={"patient_age"}
                              control={form.control}
                            />
                          </div>
                        </div>
                        <div className="flex gap-5 items-end">
                          <FormBuilder
                            control={form.control}
                            name="description"
                            label={"Relevant Clinical History (Optional)"}
                            className="flex-1"
                          >
                            <Textarea
                              className="min-h-28 resize-none"
                              maxLength={200}
                            />
                          </FormBuilder>

                          <FormField
                            name="attachment"
                            render={({}) => (
                              <FormItem className="hidden">
                                <FormLabel>Choose Logo (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    {...fileref}
                                    accept=".pdf"
                                    onChange={handleImageChange}
                                    ref={filePickRef}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => filePickRef.current.click()}
                                  type="button"
                                >
                                  <Paperclip className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                Attach file
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {imageFile && (
                          <p className=" flex gap-2 shadow hover:shadow-none items-center rounded-md w-fit p-2 bg-secondary text-secondary-foreground text-xs">
                            <Paperclip className="w-4 h-4" />{" "}
                            {imageFile[0].name}
                            <Trash2
                              className="w-4 h-4 ml-4 cursor-pointer"
                              onClick={() => {
                                setImagefile(null);
                                form.setValue("attachment", {
                                  target: { files: null },
                                });
                              }}
                            />
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Choose Tests</CardTitle>
                      <CardDescription>
                        These tests are available in the laboratory you
                        selected. <br />
                        Hover over the tests for details and requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        name="tests"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex-1 -mb-2">
                            <FormLabel>Choose Tests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MultipleSelectorWithHover
                                  options={testOptions}
                                  title="tests"
                                  detailedContent={tests?.data}
                                  placeholder="choose tests"
                                  hidePlaceholderWhenSelected
                                  emptyIndicator={
                                    !form.watch("to_laboratory")
                                      ? "Select a laboratory to view tests"
                                      : testsLoading
                                        ? "loading tests..."
                                        : testsError
                                          ? "Error loading tests"
                                          : tests?.data?.length
                                            ? "This Laboratory has no tests available"
                                            : "something went wrong"
                                  }
                                  {...field}
                                />
                                <ChevronsUpDown className="-z-10  absolute top-2.5 right-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col gap-4 rounded-md">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sample Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <SelectComponent
                            name={"priority"}
                            control={form.control}
                            label={"sample priority"}
                            items={priority}
                            placeholder={"Sample priority"}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-md">
                        Delivery (Optional)
                      </CardTitle>
                      <CardDescription>
                        choose a delivery service
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PopoverSelect
                        form={form}
                        name={"delivery"}
                        error={deliveriesError}
                        loading={deliveriesLoading}
                        items={deliveries}
                        label={"Delivery Service (Optional)"}
                        title={"Deliveries"}
                        search={"Search delivery service..."}
                      />
                    </CardContent>
                  </Card>

                  {selectedTests?.length > 0 ? (
                    <div className="border-dashed border-[1px] rounded-md p-4 flex-1">
                      <CardTitle className="text-lg">Tests Requested</CardTitle>

                      <div className="pb-4">
                        {selectedTests
                          ?.filter((item) => item !== undefined)
                          .map((test, index) => (
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full max-"
                              key={index}
                            >
                              <AccordionItem value={"item" + index}>
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex justify-between w-full pr-3 ">
                                    <span>{test.name}</span>
                                    <div className="flex gap-3 items-center">
                                      {test.discount_price && (
                                        <span className=" line-through text-muted-foreground text-xs">
                                          {test.price}
                                        </span>
                                      )}
                                      <span>{test.amount_to_pay}</span>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-col gap-2 whitespace-normal max-w-md">
                                    <h6 className="text-sm uppercase">
                                      {test?.name}
                                    </h6>
                                    <p className="text-xs uppercase">
                                      <span className="capitalize mr-2">
                                        Price:
                                      </span>
                                      GH{`\u20B5`}
                                      {test?.price}
                                    </p>
                                    <p className="text-xs uppercase">
                                      <span className="capitalize mr-2">
                                        Discount:
                                      </span>
                                      GH{`\u20B5`}
                                      {test?.discount_price || "0"}
                                    </p>
                                    <p className="text-xs uppercase">
                                      <span className="capitalize mr-2">
                                        Payable Amount:
                                      </span>
                                      GH{`\u20B5`}
                                      {test?.price - test?.discount_price}
                                    </p>
                                    <p className="text-xs uppercase">
                                      <span className="capitalize mr-2">
                                        Turn around time :
                                      </span>
                                      {test?.turn_around_time}
                                    </p>
                                    <p className="text-xs uppercase border-b-[1px] pb-2">
                                      <span className="capitalize mr-2">
                                        Patient Preparation:
                                      </span>
                                      {test?.patient_preparation}
                                    </p>
                                    <h5 className="font-medium text-sm ">
                                      Sample Requirements
                                    </h5>
                                    <div className="py-3">
                                      {test?.sample_type?.map(
                                        (sample, index) => (
                                          <div
                                            key={index}
                                            className="space-y-2 border-b-[1px] pb-2"
                                          >
                                            <p className="text-xs uppercase">
                                              <span className="capitalize mr-2">
                                                Sample Type:
                                              </span>
                                              {sample.sample_name}
                                            </p>
                                            <p className="text-xs uppercase">
                                              <span className="capitalize mr-2">
                                                Collection time:
                                              </span>
                                              {sample.collection_time}
                                            </p>
                                            <p className="text-xs uppercase">
                                              <span className="capitalize mr-2">
                                                collection Procedure:
                                              </span>
                                              {sample.collection_procedure}
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ))}
                      </div>
                      <div className="text-end">
                        Total:{" "}
                        <span>
                          GH{`\u20B5`}
                          {calculateTotalCost(selectedTests)}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-4">
                    <Switch
                      id="share_result"
                      checked={share}
                      onCheckedChange={() => setShare(!share)}
                    />
                    <Label htmlFor="share_result">Share results</Label>
                  </div>
                  {share && (
                    <FormBuilder
                      name={"shareWith"}
                      label={"Share Results with this email"}
                      description={
                        "A copy of the results will be share with this email "
                      }
                    >
                      <Input type="email" placeholder="share with this email" />
                    </FormBuilder>
                  )}
                </div>

                <Button className="w-96 mx-auto">
                  Send Sample
                  {form.formState.isSubmitting && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </form>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
}
