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
import { useTestColumns } from "./columns/testsColumns";
import { branchcolumnDef } from "./columns/branchcolumns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, RotateCw, SlidersHorizontal } from "lucide-react";
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
import BranchDetails from "./dashboard/branchDetails";
import useDebounce from "../hooks/useDebounce";

export function EmptyLab({ title, user }) {
  return (
    <div className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm">
      <div className="flex flex-col items-center py-16 text-center ">
        {title === "Tests" ? (
          <>
            <h3 className="text-xl font-semibold ">
              Active branch has no Tests
            </h3>
            <p className="text-sm text-muted-foreground">
              you can add tests and manage them here.
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
export function EmptyQuery({ title, user, query }) {
  console.log(query);
  return (
    <div className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm">
      <div className="flex flex-col items-center py-16 text-center ">
        <>
          <h3 className="text-xl font-semibold ">{`Active branch has no ${query} tests`}</h3>
          <p className="text-sm text-muted-foreground">
            you can add tests and manage them here.
          </p>
          <div className="mt-4">
            <AddTest />
          </div>
        </>
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
          Verify your internet connection and retry.
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
  const [selectedTests, setSelectedTests] = useState();
  const [selected, setSelected] = useState();
  const user = useSelector(selectCurrentUser);
  const selectedRows = useSelector(selectSelectedRows);
  const [selectedBranch, setSelectedBranch] = useState();
  const QueryOptions = ["All", "Active", "Inactive"];
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedsearchedTerm = useDebounce(searchTerm, 500);
  const [cursorOptions, setCursorOptions] = useState({
    prev: null,
    next: null,
  });
  const [testQuerys, setQuerys] = useState({
    test_status: "Active",
    cursor: undefined,
    search: undefined,
    size: undefined,
  });

  useEffect(() => {
    setQuerys({
      ...testQuerys,
      search: debouncedsearchedTerm,
    });
  }, [debouncedsearchedTerm]);
  const handleFilterChange = (query) => {
    setQuerys((prevQueries) => {
      const newQueries = { ...prevQueries };
      if (newQueries.test_status === query) {
        delete newQueries.test_status;
      } else {
        newQueries.test_status = query;
      }
      return newQueries;
    });
  };

  const testscolumnDef = useTestColumns(setSelectedTests);

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
    setSelectedTests();
  }, [currentTab]);

  console.log(testQuerys);

  useEffect(() => {
    setSelectedBranch();
  }, [currentTab]);

  const {
    error: testError,
    isLoading: testsLoading,
    data: tests,
    refetch: refetchTests,
  } = useFetchLabTests(activeBranch, testQuerys, setQuerys);

  useEffect(() => {
    if (tests?.data?.results) {
      setCursorOptions((prevOptions) => {
        const nextUrl = tests?.data?.next;
        const prevUrl = tests?.data?.prev;
        let nextCursor = null;
        let prevCursor = null;

        if (nextUrl) {
          const nextQueryString = nextUrl.split("?")[1];
          const nextUrlParams = new URLSearchParams(nextQueryString);
          nextCursor = nextUrlParams.get("cursor");
          console.log(nextCursor);
        }

        if (prevUrl) {
          const prevQueryString = prevUrl.split("?")[1];
          const prevUrlParams = new URLSearchParams(prevQueryString);
          prevCursor = prevUrlParams.get("cursor");
        }

        return {
          next: nextCursor,
          prev: prevCursor,
        };
      });
    }
  }, [tests?.data, activeBranch]);

  useEffect(() => {
    if (selectedTests) {
      setSelected(
        tests?.data?.results?.find((test) => {
          return test.id === selectedTests;
        })
      );
    } else if (selectedBranch) {
      setSelected(
        userbranches?.data?.find((branch) => {
          return branch.id === selectedBranch;
        })
      );
    } else {
      setSelected(null);
    }
  }, [selectedTests, selectedBranch, tests, userbranches]);

  useEffect(() => {
    if (tests?.data) {
      setLabTests(
        tests?.data?.results.map((test) => {
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
            branch_name: `${branch.town} Branch`,
            branch_manager: branch.branch_manager,
            branch_phone: branch.phone,
            branch_email: branch.email,
            branch_manager: branch.branch_manager,
          };
        })
      );
    }
  }, [userbranches]);

  const index = tests?.data?.results?.findIndex(
    (test) => test.id === selected?.id
  );
  const nextTest = () => {
    if (selectedTests) {
      if (index < tests?.data.results?.length - 1) {
        setSelectedTests(tests?.data?.results?.[index + 1]?.id);
      } else {
        setSelectedTests(tests?.data?.results[0]?.id);
      }
    } else if (selectedBranch) {
      if (index < userbranches?.data.length - 1) {
        setSelectedTests(userbranches?.data[index + 1]?.id);
      } else {
        setSelectedTests(userbranches?.data[0]?.id);
      }
    } else {
      return;
    }
  };
  const prevTest = () => {
    if (selectedTests) {
      if (index === 0) {
        return;
      } else {
        setSelectedTests(tests?.data?.results[index - 1]?.id);
      }
    } else if (selectedBranch) {
      if (index === 0) {
        return;
      } else {
        setSelectedTests(userbranches?.data[index - 1]?.id);
      }
    } else {
      return;
    }
  };

  const tabContent = [
    {
      title: "Tests",
      description: "Showing Tests for Active Branch",
      data: labtests,
      columnDef: testscolumnDef,
      loading: testsLoading,
      error: testError,
      refetch: refetchTests,
      filter: "test_name",
      setItems: setSelectedTests,
      selected: selectedTests,
      QueryOptions,
      setQuerys: setQuerys,
      querys: testQuerys,
      cursorOptions,
      setSearchTerm,
      searchTerm,
    },
    {
      title: "Branches",
      description: "Viewing branches for this account",
      data: branches,
      columnDef: branchcolumnDef,
      refetch: refreshBranches,
      loading: branchesLoading,
      error: branchesError,
      filter: "branch_name",
      setItems: setSelectedBranch,
      selected: selectedBranch,
    },
  ];
  return (
    <main className="grid grid-cols-12 sm:pl-20 sm:pr-6 max-sm:px-2 gap-x-4 max-sm:mt-2 mt-5 pb-20">
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
                      {tab.title === "Tests" &&
                      tests?.data?.results?.length < 1 &&
                      testQuerys.test_status ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="ml-auto text-xs"
                            >
                              <SlidersHorizontal className="w-4 h-4 mr-2" />
                              {QueryOptions.find(
                                (query) => testQuerys.test_status === query
                              ) ?? "Filter"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {QueryOptions.map((query) => (
                              <DropdownMenuCheckboxItem
                                key={query}
                                checked={QueryOptions.test_status === query}
                                onCheckedChange={() =>
                                  handleFilterChange(query)
                                }
                              >
                                {query}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
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
                    </CardHeader>
                    <CardContent>
                      {tab.title === "Tests" && branchesLoading ? (
                        <TableSkeleton />
                      ) : tab.title === "Tests" && branchesError ? (
                        <ErrorLab refetch={tab.refetch} error={tab.error} />
                      ) : tab.title === "Tests" &&
                        userbranches?.data.length < 1 ? (
                        <EmptyLab title="Branches" user={user} />
                      ) : tab.loading ? (
                        <TableSkeleton />
                      ) : tab.error ? (
                        <ErrorLab refetch={tab.refetch} error={tab.error} />
                      ) : tab.title === "Tests" &&
                        tab.data?.length < 1 &&
                        testQuerys.test_status !== "All" &&
                        !testQuerys.search ? (
                        <EmptyQuery query={testQuerys.test_status} />
                      ) : tab.data?.length < 1 && !testQuerys.search ? (
                        <EmptyLab title={tab.title} user={user} />
                      ) : (
                        <DataTable
                          data={tab?.data}
                          columnDef={tab.columnDef}
                          title={tab.title}
                          filter={tab.filter}
                          setSelected={tab.setItems}
                          selected={tab.selected}
                          QueryOptions={tab.QueryOptions}
                          handleFilterChange={handleFilterChange}
                          setQuerys={tab.setQuerys}
                          querys={tab.querys}
                          cursorOptions={tab.cursorOptions}
                          setSearchTerm={tab.setSearchTerm}
                          searchTerm={tab.searchTerm}
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
          {selectedTests ? (
            <TestDetails
              selected={selected}
              setSelectedTests={setSelected}
              updatedAt={dataUpdatedAt}
              nextTest={nextTest}
              prevTest={prevTest}
            />
          ) : (
            <BranchDetails
              selected={selected}
              setSelected={setSelected}
              nextTest={nextTest}
              prevTest={prevTest}
            />
          )}
        </div>
      )}
    </main>
  );
}
