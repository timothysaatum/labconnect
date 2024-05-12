import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useFetchLabTests, useFetchUserBranches } from "@/api/queries";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { testscolumnDef } from "./columns/testsColumns";
import { branchcolumnDef } from "./columns/branchcolumns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import moment from "moment";
import TestDetails from "./dashboard/testsDetails";
import AddTest from "./dashboard/addTests";
import AddBranch from "./dashboard/addbranch";

export default function MyLab() {
  const [labtests, setLabTests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [checked, setChecked] = useState();
  const [selectedTests, setSelectedTests] = useState();
  const [selected, setSelected] = useState();
  const [tab, setTab] = useState("Tests");

  const {
    dataUpdatedAt,
    data: userbranches,
    isLoading: branchesLoading,
    isError: branchesError,
  } = useFetchUserBranches();

  useEffect(() => {
    if (selectedTests) {
      setSelected(
        tests?.data?.find((test) => {
          return test.id === selectedTests;
        })
      );
    } else {
      setSelected(null);
    }
  }, [selectedTests]);

  useEffect(() => {
    setChecked(userbranches?.data[0]?.id);
  }, [userbranches?.data]);

  const {
    isError: testError,
    isLoading: testsLoading,
    data: tests,
  } = useFetchLabTests(checked);

  useEffect(() => {
    if (tests?.data) {
      setLabTests(
        tests.data.map((test) => {
          return {
            id: test.id,
            test_code: test.test_code,
            test_name: test.name,
            price: test.price,
            turn_around_time: moment(test.turn_around_time, "HH:mm:ss").format(
              "h [hours] m [minutes]"
            ),
            date_added: test.date_added,
          };
        })
      );
    }
  }, [tests]);

  useEffect(() => {
    if (userbranches?.data) {
      setBranches(
        userbranches?.data.map((branch) => {
          return {
            branch_name: branch.branch_name,
            branch_manager: branch.branch_manager,
            branch_phone: branch.branch_phone,
            branch_email: branch.branch_email,
          };
        })
      );
    }
  }, [userbranches]);

  const index = tests?.data.findIndex((test) => test.id === selected?.id);
  const nextTest = () => {
    if (index < tests?.data.length - 1) {
      setSelectedTests(tests?.data[index + 1]?.id);
    } else {
      setSelectedTests(tests?.data[0]?.id);
    }
  };
  const prevTest = () => {
    if (index < tests?.data.length - 1) {
      setSelectedTests(tests?.data[index + 1]?.id);
    } else {
      setSelectedTests(tests?.data[0]?.id);
    }
  };

  const tabContent = [
    {
      title: "Tests",
      description:
        "All tests run in this laboratory. you can add new test,update existing tests and delete tests. you can also discounts to specific tests",
      data: labtests,
      columnDef: testscolumnDef,
      loading: testsLoading,
      error: testError,
      filter: "test_name",
      setItems: setSelectedTests,
      selected: selectedTests,
    },
    {
      title: "Branches",
      description:
        "All Branches can be managed here you can create,delete and update branches",
      data: branches,
      columnDef: branchcolumnDef,
      loading: branchesLoading,
      error: branchesError,
      filter: "branch_name",
    },
  ];
  return (
    <main className="sm:ml-14 px-2 md:px-10 grid grid-cols-12 gap-x-4 max-sm:mt-2">
      <div
        className={`${selected ? "col-span-12 lg:col-span-8" : "col-span-12"}`}
      >
        <section>
          <Tabs defaultValue="Tests" onValueChange={setTab}>
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="Tests">Tests</TabsTrigger>
                <TabsTrigger value="Branches">Branches</TabsTrigger>
              </TabsList>
              <div>{tab === "Tests" ? <AddTest /> : <AddBranch />}</div>
            </div>
            {tabContent?.map((tab) => (
              <TabsContent value={tab.title} key={tab.title}>
                <div className="grid grid-cols-12">
                  <Card className="col-span-12">
                    <CardHeader className="flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <CardTitle>{tab.title}</CardTitle>
                        <CardDescription>{tab.description}</CardDescription>
                      </div>
                      <div className="flex max-sm:justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex justify-between items-center text-sm px-2 gap-3"
                            >
                              {
                                userbranches?.data?.find(
                                  (branch) => branch.id === checked
                                )?.branch_name
                              }
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {userbranches?.data?.map((branch) => (
                              <DropdownMenuCheckboxItem
                                key={branch.id}
                                checked={checked === branch.id}
                                onCheckedChange={() => setChecked(branch.id)}
                              >
                                {branch.branch_name}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={tab?.data}
                        columnDef={tab.columnDef}
                        loading={tab.loading}
                        error={tab.error}
                        title={tab.title}
                        filter={tab.filter}
                        setSelected={tab.setItems}
                        selected={tab.selected}
                      />
                    </CardContent>
                  </Card>
                  <div></div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
      {selected && (
        <div className="hidden lg:block col-span-4">
          <TestDetails
            selected={selected}
            setSelectedTests={setSelectedTests}
            updatedAt={dataUpdatedAt}
            nextTest={nextTest}
            prevTest={prevTest}
          />
        </div>
      )}
    </main>
  );
}
