import { ChevronLeft, Upload } from "lucide-react";

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

export default function SendSample() {
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const savedData = useSelector(selectSampleData);
  const [saving, setSaving] = useState(false);

  //form declaration
  const form = useForm({
    defaultValues: {
      name_of_patient: "",
      patient_age: "",
      patient_sex: "",
      sample_type: "",
      delivery: "",
      to_lab: "",
      from_lab: "",
      brief_description: "",
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

  //fetching all labs
  const {
    data: labs,
    isError: labsError,
    isLoading: labsLoading,
  } = useFetchAllLabsBranches();

  //filepicker ref
  const filePickeRef = useRef();

  //field array for tests
  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  // id of lab to fetch tests for
  useEffect(() => {
    setId(form.watch("to_lab"));
    form.setValue("tests", []);
  }, [form.watch("to_lab")]);

  //intialize with a single field
  useEffect(() => {
    // if (savedData?.tests) {
    //   for (let index = 0; index < savedData?.test?.length; index++) {
    //     prepend(savedData?.test[index]);
    //   }
    // }
  }, [savedData, prepend]);

  //fetching selected lab test
  const {
    data: tests,
    isError: testsError,
    isPending: testsLoading,
  } = useFetchLabTests(id);

  //tests card ref
  const TestsCardRef = useRef(null);

  useEffect(() => {
    if (TestsCardRef.current) {
      // Scroll into view
      TestsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      // Optional: Focus if the element can be focused
      TestsCardRef.current.focus();
    }
  }, [tests]);

  //saving form to redux
  const handleSave = (data) => {
    try {
      setSaving(true);
      dispatch(setSampleData(data));
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
    if (savedData) {
      form.setValue("name_of_patient", savedData.name_of_patient);
      form.setValue("patient_age", savedData.patient_age);
      form.setValue("patient_sex", savedData.patient);
      form.setValue("sample_type", savedData.sample_type);
      form.setValue("delivery", savedData.delivery);
      form.setValue("to_lab", savedData.to_lab);
      form.setValue("from_lab", savedData.from_lab);
      form.setValue("brief_description", savedData.brief_description);
    }
  }, [savedData]);

  return (
    <div className="flex min-h-screen w-full flex-col">
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
                <Button size="sm" onClick={form.handleSubmit(handleSave)}>
                  Save and continue later{" "}
                  {saving && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                </Button>
              </div>
            </div>
            <Form {...form}>
              <form className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
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
                            name={"name_of_patient"}
                            label={"Patient Name"}
                            className="grid gap-3"
                          >
                            <Input placeholder="patient name" />
                          </FormBuilder>
                        </div>

                        <div className="grid grid-cols-[1fr_200px] gap-4">
                          <div>
                            <SelectComponent
                              label={"Select patient gender"}
                              name={"patient_gender"}
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
                            name="clinical_history"
                            label={"Relevant Clinical History"}
                          >
                            <Textarea
                              lab
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
                      <PopoverSelectwithhover
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
                        name={"to_lab"}
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

                  {form.watch("to_lab") && (
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
                          <div className="grid gap-6 sm:grid-cols-[1fr_200px]">
                            {fields.map((item, index) => (
                              <div className="grid gap-3">
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
                            ))}
                            <div className="grid gap-3">
                              <Label htmlFor="subcategory">
                                Subcategory (optional)
                              </Label>
                              <Select>
                                <SelectTrigger
                                  id="subcategory"
                                  aria-label="Select subcategory"
                                >
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="t-shirts">
                                    T-Shirts
                                  </SelectItem>
                                  <SelectItem value="hoodies">
                                    Hoodies
                                  </SelectItem>
                                  <SelectItem value="sweatshirts">
                                    Sweatshirts
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {form.watch("to_lab") && (
                    <Button className="-mt-4">Proceed to checkout</Button>
                  )}
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Sample Priority</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Choose sample Priority</Label>
                          <Select>
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
                              <SelectValue placeholder="Choose priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Express</SelectItem>
                              <SelectItem value="published">Normal</SelectItem>
                              <SelectItem value="archived">
                                Not urgent
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="whitespace-nowrap text-lg">
                        Upload necessary documents
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
                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>Archive Product</CardTitle>
                      <CardDescription>
                        Lipsum dolor sit amet, consectetur adipiscing elit.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div></div>
                      <Button size="sm" variant="secondary">
                        Archive Product
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </Form>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => form.reset()}
                type="button"
              >
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
