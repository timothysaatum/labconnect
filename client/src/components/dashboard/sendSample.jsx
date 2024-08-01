import {
  ChevronLeft,
  Minus,
  Paperclip,
  PlusCircle,
  Trash2,
} from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { useFieldArray, useForm } from "react-hook-form";
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
import PopoverSelectwithhover from "./popoverselectwithhover";
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
import SelectComponentWithHover from "./hoverselect";
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
import { useSendSample } from "@/lib/formactions";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import { Switch } from "../ui/switch";

//the prompt dialog
export function RestoreDialog({ open, setOpen, handleDiscard, handleRestore }) {
  const isOpen = useMemo(() => open, [open]);
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>uncompleted request?</AlertDialogTitle>
          <AlertDialogDescription>
            you have an uncompleted request.
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

  //form declaration
  const form = useForm({
    // resolver: zodResolver(labRequestSchema),
    defaultValues: {
      patient_name: "",
      patient_age: "",
      patient_sex: "",
      delivery: "",
      to_laboratory: "",
      from_lab: "",
      brief_description: "",
      priority: "",
      sample_status: "Received by delivery",
      payment_mode: "Manual",
      payment_status: "Paid",
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

  //field array for tests
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "test_data",
  });

  // id of lab to fetch tests for
  useEffect(() => {
    setId(form.watch("to_laboratory"));
    form.setValue("test_data", []);
  }, [form.watch("to_laboratory")]);

  //intialize with a single field
  useEffect(() => {
    if (fields.length === 0) {
      append({ test: "", sample_type: "" });
    }
  }, [append, fields.length]);

  // removing test fields
  const handleRemove = (index) => {
    if (fields.length === 1) {
      toast.message("you need to choose at least one test");
      return;
    }
    remove(index);
  };
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
      form.setValue("sample_type", savedData.sample_type);
      form.setValue("delivery", savedData.delivery);
      form.setValue("to_laboratory", savedData.to_laboratory);
      form.setValue("from_lab", savedData.from_lab);
      form.setValue("brief_description", savedData.brief_description);
    }
  }, [savedData, restore]);

  //selecting the active branch automatically
  useEffect(() => {
    if (!savedData && activeBranch) {
      form.setValue("from_lab", activeBranch);
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

  //selected tests
  return (
    <div className="sm:pl-14 mx-4 py-5 md:py-0">
      <RestoreDialog
        setOpen={setOpen}
        open={open}
        handleDiscard={handleDiscard}
        handleRestore={handleRestore}
      />
      {/* <div className="flex sm:gap-4 sm:py-4 sm:pl-14 ">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Send Sample
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Discard
                </Button>
                <Button size="sm" onClick={handleSave} type="button">
                  Save and continue later
                  {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </div>
            <Form {...form}>
              <form
                className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8"
                noValidate
                onSubmit={form.handleSubmit(onSendSample)}
              >
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Patient Details</CardTitle>
                      <CardDescription>
                        please enter the correct patient details here
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div>
                          <FormBuilder
                            name={"patient_name"}
                            label={"Patient Name"}
                            className="grid gap-3"
                          >
                            <Input placeholder="patient name" />
                          </FormBuilder>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
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
                      <CardTitle>Laboratory Details</CardTitle>
                      <CardDescription>
                        Choose your branch and the laboratory you wish to send
                        sample from
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <PopoverSelect
                        form={form}
                        name={"from_lab"}
                        error={branchesError}
                        loading={branchesLoading}
                        items={branches}
                        label={"Which branch are you sending sample from?"}
                        title={"Branches"}
                        search={"Search branches..."}
                        info={"branch_name"}
                      />
                      <PopoverSelect
                        form={form}
                        name={"to_laboratory"}
                        error={labsError}
                        loading={labsLoading}
                        items={labs}
                        label={"Which laboratory are you sending sample to?"}
                        title={"Laboratories"}
                        search={"Search laboratory..."}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Priority</CardTitle>
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
                        label={"Choose Delivery Service (Optional)"}
                        title={"Deliveries"}
                        search={"Search delivery service..."}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div ref={TestsCardRef} className="col-span-2 py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Choose Tests</CardTitle>
                      <CardDescription>
                        These tests are available in the laboratory you
                        selected.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        {fields.map((item, index) => (
                          <div
                            key={item.id}
                            className="grid gap-2 md:gap-6 lg:grid-cols-[1fr_1fr] max-md:border-b max-md:pb-4 max-md:mb-4 max-md:last:border-b-0 max-md:last:pb-0 max-md:last:mb-0"
                          >
                            <div>
                              <PopoverSelectwithhover
                                form={form}
                                name={`tests.${index}.test`}
                                error={testsError}
                                loading={testsLoading}
                                items={tests}
                                label={"Choose a test to request"}
                                title={"tests"}
                                search={"Search tests..."}
                              />
                            </div>
                            <div className="flex justify-between items-end gap-2">
                              <div>
                                <SelectComponentWithHover
                                  form={form}
                                  name={`tests.${index}.sample_type`}
                                  error={testsError}
                                  loading={testsLoading}
                                  index={index}
                                  data={tests?.data}
                                  id={form.watch(`tests.${index}.test`)}
                                  label={"what sample are you sending"}
                                  title={"sample types"}
                                  search={"Search sample type..."}
                                />
                              </div>
                              <div>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  type="button"
                                  onClick={() => handleRemove(index)}
                                >
                                  <Minus />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <CardFooter className="justify-center border-t p-0 py-2 text-xs tracking-tight text-center text-muted-foreground">
                        <Button
                          variant="ghost"
                          onClick={() => append({ test: "", sample_type: "" })}
                        >
                          Add more tests <PlusCircle className="w-4 h-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </div>
                <Button className="col-span-2 -mt-4 hidden w-full md:block">
                  Proceed to checkout
                </Button>
              </form>
            </Form>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReset}
                type="button"
              >
                Discard
              </Button>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={handleSave}
              >
                Continue later
              </Button>
              {}
              <Button className="ml-4 flex-grow">Proceed to checkout</Button>
            </div>
          </div>
        </main>
      </div> */}
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
                className="grid md:grid-cols-[1fr_300px] gap-8 sm:py-5"
                noValidate
                onSubmit={form.handleSubmit(onSendSample)}
              >
                <div className="grid ">
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

                        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
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
                        selected.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        {fields.map((item, index) => (
                          <div
                            key={item.id}
                            className="grid gap-2 md:gap-6 lg:grid-cols-[2fr_1fr] max-md:border-b max-md:pb-4 max-md:mb-4 max-md:last:border-b-0 max-md:last:pb-0 max-md:last:mb-0"
                          >
                            <div>
                              <PopoverSelectwithhover
                                form={form}
                                name={`test_data.${index}.test`}
                                error={testsError}
                                loading={testsLoading}
                                items={tests}
                                label={"Choose a test to request"}
                                title={"tests"}
                                search={"Search tests..."}
                              />
                            </div>
                            <div>
                              <SelectComponentWithHover
                                form={form}
                                name={`test_data.${index}.sample_type`}
                                error={testsError}
                                loading={testsLoading}
                                index={index}
                                data={tests?.data}
                                id={form.watch(`test_data.${index}.test`)}
                                label={"Sample Type"}
                                title={"sample types"}
                                search={"Search sample type..."}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-4 mt-2"
                          type="button"
                          onClick={() =>
                            append({ test: null, sample_type: null })
                          }
                        >
                          Add Test
                        </Button>
                      </div>
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
                  <div className="bg-muted/50 rounded-md p-4 flex-1">
                    <CardTitle className="text-lg">Tests Requested</CardTitle>
                    {selectedTests?.map((test) => (
                      <div>
                        {test.test} {test.sample_type}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Switch id="share_result" />
                    <Label htmlFor="share_result">Share results</Label>
                  </div>
                </div>
                <Button className="max-w-fit">Proceed to summary</Button>
              </form>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
}
