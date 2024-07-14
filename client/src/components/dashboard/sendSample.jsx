import { ChevronLeft, Minus, PlusCircle, Upload } from "lucide-react";

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
import { Form } from "../ui/form";
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

  const onSendSample = useSendSample();

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
  const filePickeRef = useRef();

  //field array for tests
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  // id of lab to fetch tests for
  useEffect(() => {
    setId(form.watch("to_laboratory"));
    form.setValue("tests", []);
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
    isPending: testsLoading,
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <RestoreDialog
        setOpen={setOpen}
        open={open}
        handleDiscard={handleDiscard}
        handleRestore={handleRestore}
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                  {saving && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
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

                        <div className="grid sm:grid-cols-[1fr_200px] gap-4">
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
                        <div className="grid gap-3">
                          <FormBuilder
                            control={form.control}
                            name="description"
                            label={"Relevant Clinical History (Optional)"}
                          >
                            <Textarea
                              className="min-h-28 resize-none"
                              maxLength={200}
                            />
                          </FormBuilder>
                        </div>
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
                    <CardFooter className="justify-center border-t p-4 text-xs tracking-tight text-center text-muted-foreground">
                      Select the laboratory you want to send sample to so you
                      can see the tests available
                    </CardFooter>
                  </Card>

                  <div ref={TestsCardRef} className="py-4">
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
                              className="grid gap-2 md:gap-6 lg:grid-cols-[1fr_1fr] max-md:border-b max-md:pb-4 max-md:mb-4 max-md:last:border-b-0 max-md:last:pb-0 max-md:last:mb-0 max-lg:border max-lg:border-dotted rounded-md shadow-md max-lg: p-2"
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
                      </CardContent>
                      <CardFooter className="justify-center border-t p-0 py-2 text-xs tracking-tight text-center text-muted-foreground">
                        <Button
                          variant="ghost"
                          onClick={() => append({ test: "", sample_type: "" })}
                        >
                          Add more tests <PlusCircle className="w-4 h-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  <Button className="-mt-4 hidden md:block">
                    Proceed to checkout
                  </Button>
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
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="whitespace-pre-line text-lg">
                        Upload necessary documents{" "}
                        <span className="text-sm">(Optional)</span>
                      </CardTitle>
                      <CardDescription>
                        you can Upload document such as request cards or other
                        informations that are necessary in the test
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="">
                      <input type="file" hidden ref={filePickeRef} />
                      <button
                        onClick={() => filePickeRef.current.click()}
                        type="button"
                        className="flex md:aspect-video w-full items-center justify-center rounded-md border border-dashed max-md:h-20"
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
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
              <Button className="flex-grow ml-4">Proceed to checkout</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
