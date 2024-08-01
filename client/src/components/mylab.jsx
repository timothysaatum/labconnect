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
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, RotateCw } from "lucide-react";
import TestDetails from "./dashboard/testsDetails";
import AddTest from "./dashboard/addTests";
import AddBranch from "./dashboard/addbranch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/auth/authSlice";
import { Link } from "react-router-dom";
import { selectSelectedRows } from "@/redux/dataTable/selectedrowsSlice";
import { changeTab, selectCurrentTab } from "@/redux/mylabtab/mylabtabSlice";
import {
  changeBranch,
  selectActiveBranch,
} from "@/redux/branches/activeBranchSlice";
import TableSkeleton from "./dashboard/tableskeleton";

function EmptyLab({ title, user }) {
  return (
    <div className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm">
      <div className="flex flex-col items-center py-16 text-center ">
        {title === "Tests" ? (
          <>
            <h3 className="text-xl font-semibold ">This Branch has no Tests</h3>
            <p className="text-sm text-muted-foreground">
              you will see tests added to branches here
            </p>
            <div className="mt-4">
              <AddTest />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold ">
              There are no branches with this user
            </h3>
            <p className="text-sm text-muted-foreground">
              Authorized branches with this user will be here
            </p>
            {user.is_admin && (
              <div className="mt-4">
                <AddBranch />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
function LoadingLab() {
  return (
    <div className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm">
      <div className="flex flex-col items-center py-16 text-center ">
        <p className="text-sm text-muted-foreground">loading...</p>
      </div>
    </div>
  );
}
function ErrorLab({ refetch, error }) {
  console.log(error);
  return (
    <div className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm">
      <div className="flex flex-col items-center py-16 text-center ">
        <h3 className="text-xl font-semibold  font-sans">
          {error.name === "CanceledError"
            ? "We're having trouble connecting"
            : "oops something went wrong"}
        </h3>
        <p className="text-sm text-destructive">
          verify your internet connection and retry.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => {
            refetch();
          }}
        >
          Try Again <RotateCw className="w-4 h-4 ml-2 text-muted-foreground" />
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          If error persists{" "}
          <Link className="hover:underline underline-offset-2 text-des">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function MyLab() {
  const [labtests, setLabTests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [checked, setChecked] = useState();
  const [selectedTests, setSelectedTests] = useState();
  const [selected, setSelected] = useState();
  const user = useSelector(selectCurrentUser);
  const selectedRows = useSelector(selectSelectedRows);
  const [action, setAction] = useState("Perform Action");

  const activeBranch = useSelector(selectActiveBranch);

  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTab); // get the current tab from the Redux state

  const handleTabChange = (newTab) => {
    dispatch(changeTab(newTab)); // dispatch the changeTab action when the tab changes
  };
  const {
    dataUpdatedAt,
    data: userbranches,
    isLoading: branchesLoading,
    isError: branchesError,
    refetch: refreshBranches,
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

  const {
    error: testError,
    isPending: testsLoading,
    data: tests,
    refetch: refetchTests,
  } = useFetchLabTests(activeBranch);

  useEffect(() => {
    if (tests?.data) {
      setLabTests(
        tests.data.map((test) => {
          return {
            id: test?.id,
            test_code: test?.test_code,
            test_name: test?.name,
            price: test?.price,
            turn_around_time: test?.turn_around_time,
            date_added: test?.date_added,
            discount_price: test?.discount_price,
            patient_preparation: test?.patient_preparation,
            sample_type: test?.sample_type,
            branch: test?.branch,
            test_status: test?.test_status,
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
            id: branch.id,
            branch_name: branch.name,
            branch_manager: branch.branch_manager,
            branch_phone: branch.phone,
            branch_email: branch.email,
            branch_manager: branch.branch_manager,
          };
        })
      );
    }
  }, [userbranches]);

  const index = tests?.data?.findIndex((test) => test.id === selected?.id);
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
      refetch: refetchTests,
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
      refetch: refreshBranches,
      loading: branchesLoading,
      error: branchesError,
      filter: "branch_name",
    },
  ];
  return (
    <main className="grid grid-cols-12 sm:pl-20 sm:pr-6 max-sm:px-2 gap-x-4 max-sm:mt-2 mt-5">
      <div
        className={`${selected ? "col-span-12 lg:col-span-8" : "col-span-12"}`}
      >
        <section>
          <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="Tests">Tests</TabsTrigger>
                <TabsTrigger value="Branches">Branches</TabsTrigger>
              </TabsList>
              <div>
                {currentTab === "Tests" ? (
                  <AddTest />
                ) : user.is_admin ? (
                  <AddBranch />
                ) : null}
              </div>
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
                      {selectedRows?.length > 0 && currentTab === "Branches" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex items-center justify-between gap-3 px-2 text-sm"
                            >
                              {action}

                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {selectedRows.length === 1 && (
                              <DropdownMenuItem>View Selected</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              Delete Selected
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        ""
                      )}
                      {currentTab === "Tests" ? (
                        <div className="flex max-sm:justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                disabled={branchesLoading || branchesError}
                                variant="outline"
                                className="flex items-center justify-between gap-3 px-2 text-sm max-sm:w-full"
                              >
                                {branchesError
                                  ? "Error loading branches"
                                  : userbranches?.data?.find(
                                      (branch) => branch.id === activeBranch
                                    )?.name}

                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {userbranches?.data?.map((branch) => (
                                <DropdownMenuCheckboxItem
                                  key={branch.id}
                                  checked={activeBranch === branch.id}
                                  onCheckedChange={() =>
                                    dispatch(changeBranch(branch.id))
                                  }
                                >
                                  {branch.name}
                                </DropdownMenuCheckboxItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : null}
                    </CardHeader>
                    <CardContent>
                      {tab.loading ? (
                        <TableSkeleton />
                      ) : tab.error ? (
                        <ErrorLab refetch={tab.refetch} error={tab.error} />
                      ) : tab.data?.length < 1 ? (
                        <EmptyLab title={tab.title} user={user} />
                      ) : (
                        <DataTable
                          data={tab?.data}
                          columnDef={tab.columnDef}
                          title={tab.title}
                          filter={tab.filter}
                          setSelected={tab.setItems}
                          selected={tab.selected}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
      {selected && (
        <div className="hidden col-span-4 lg:block">
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
