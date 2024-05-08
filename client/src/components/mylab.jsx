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
import { useFetchLabTests, useFetchUserLab } from "@/api/queries";
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
import { ChevronDown } from "lucide-react";

export default function MyLab() {
  const [labtests, setLabTests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [checked, setChecked] = useState();

  const {
    data: userlab,
    isLoading: labsLoading,
    isError: labsError,
  } = useFetchUserLab();

  useEffect(() => {
    setChecked(userlab?.data[0]?.id);
  }, [userlab?.data]);


  const {
    isError: testError,
    isLoading: testsLoading,
    data: tests,
  } = useFetchLabTests(userlab?.data[0]?.id);

  useEffect(() => {
    if (tests?.data) {
      setLabTests(
        tests.data.map((test) => {
          return {
            test_name: test.name.split("|")[0],
            price: test.price,
            date_added: test.date_added,
            discounted_price: test.discount_price || "--",
          };
        })
      );
    }
  }, [tests]);
  
  
  useEffect(() => {
    if (userlab?.data) {
      setBranches(
        userlab?.data.map((branch) => {
          return {
            branch_name: branch.branch_name,
            branch_manager: branch.branch_manager,
            branch_phone: branch.branch_phone,
            branch_email: branch.branch_email,
          };
        })
      );
    }
  }, [userlab]);

  const headerCards = [
    { title: "Tests", footer: "Add New Test", number: labtests?.length },
    {
      title: "Branches",
      footer: "Add New Branch",
      number: userlab?.data.length,
    },
  ];
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
    },
    {
      title: "Branches",
      description:
        "All Branches can be managed here you can create,delete and update branches",
      data: branches,
      columnDef: branchcolumnDef,
      loading: labsLoading,
      error: labsError,
      filter: "branch_name",
    },
  ];
  return (
    <main className="ml-14 px-10">
      {/* <header>
        <Card className="shadow-inner border-none">
          <CardContent className="grid grid-cols-12 gap-10 pt-10">
            {headerCards.map((card) => (
              <Card key={card.title} className="col-span-4">
                <CardHeader>
                  <CardTitle className="text-md flex justify-between">
                    {card.title}:{" "}
                    <span className="text-xl">
                      {" "}
                      <CountUp end={card.number} />
                    </span>{" "}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
            <Card className="col-span-4">
              <CardHeader className="flex-row justify-between">
                <CardTitle className="text-md">Viewing:</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {userlab?.data[0]?.branch_name.split("|")[1]}
                    </Button>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </header> */}
      <section>
        <Tabs defaultValue="Tests">
          <TabsList>
            <TabsTrigger value="Tests">Tests</TabsTrigger>
            <TabsTrigger value="Branches">Branches</TabsTrigger>
          </TabsList>
          {tabContent?.map((tab) => (
            <TabsContent value={tab.title} key={tab.title}>
              <div className="grid grid-cols-12">
                <Card className="col-span-12">
                  <CardHeader className="flex-row justify-between">
                    <div>
                      <CardTitle>{tab.title}</CardTitle>
                      <CardDescription>{tab.description}</CardDescription>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex justify-between items-center text-sm px-2 gap-3"
                          >
                            {
                              userlab?.data?.find(
                                (branch) => branch.id === checked
                              )?.branch_name.split("|")[1]
                            }
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {userlab?.data?.map((branch) => (
                            <DropdownMenuCheckboxItem
                              key={branch.id}
                              checked={checked === branch.id}
                              onCheckedChange={() => setChecked(branch.id)}
                            >
                              {branch.branch_name.split("|")[1]}
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
                    />
                  </CardContent>
                </Card>
                <div></div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </main>
  );
}
