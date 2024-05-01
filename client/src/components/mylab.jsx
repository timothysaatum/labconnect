import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Plus } from "lucide-react";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  useFetchLabDepartments,
  useFetchLabTests,
  useFetchUserLab,
} from "@/api/queries";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { departmentColumnDef } from "./columns/departmentColumns";
import { testscolumnDef } from "./columns/testsColumns";

export default function MyLab() {
  const [labtests, setLabTests] = useState([]);
  const [labDepartments, setLabDepartments] = useState([]);

  const { data: userlab } = useFetchUserLab();
  const {
    isError: testError,
    isLoading: testsLoading,
    data: tests,
  } = useFetchLabTests(userlab?.data[0]?.id);

  const {
    isError: deparmentsError,
    isLoading: deparmentsLoading,
    data: departments,
  } = useFetchLabDepartments();
  useEffect(() => {
    if (tests?.data) {
      setLabTests(
        tests.data.map((test) => {
          return {
            test_name: test.name,
            price: test.price,
            date_added: test.date_added,
            discounted_price: test.discount_price || "--",
            department: departments?.data?.find(
              (department) => department.id === test.department
            )?.department_name,
          };
        })
      );
    }
  }, [tests, labDepartments]);
  useEffect(() => {
    if (departments?.data) {
      setLabDepartments(
        departments.data.map((department) => {
          return {
            department_name: department.department_name,
            head_of_department: department.heard_of_department,
            email: department.email,
            phone_number: department.phone,
            date_added: department.date_added,
          };
        })
      );
    }
  }, [departments]);

  const headerCards = [
    { title: "Branches", footer: "Add New Branch", number: 2 },
    {
      title: "Departments",
      footer: "Add New Department",
      number: labDepartments?.length,
    },
    { title: "Tests", footer: "Add New Test", number: labtests?.length },
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
      title: "Department",
      description:
        "All tests run in this laboratory. you can add new test,update existing tests and delete tests. you can also discounts to specific tests",
      data: labDepartments,
      columnDef: departmentColumnDef,
      loading: deparmentsLoading,
      error: deparmentsError,
      filter: "department_name",
    },
  ];
  return (
    <main className="ml-14 px-10">
      <header className="grid grid-cols-12">
        <Card className="col-span-12 lg:col-span-9 shadow-inner border-none">
          <CardContent className="grid grid-cols-3 gap-10 pt-10">
            {headerCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="border-b-2">
                  <CardTitle className="text-md flex justify-between">
                    {card.title}:{" "}
                    <span className="text-xl">
                      {" "}
                      <CountUp end={card.number} />
                    </span>{" "}
                  </CardTitle>
                </CardHeader>
                <CardFooter className=" hover:cursor-pointer font-semibold flex flex-row justify-center pt-2 gap-2 items-center  hover:bg-muted text-center self-center">
                  <Plus className="w-10 h-10" />
                  {card.footer}
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      </header>
      <section className="mt-10">
        <Tabs defaultValue="Tests">
          <TabsList>
            <TabsTrigger value="Tests">Tests</TabsTrigger>
            <TabsTrigger value="Department">Departments</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          {tabContent?.map((tab) => (
            <TabsContent value={tab.title} key={tab.title}>
              <div className="grid grid-cols-12">
                <Card className="col-span-12 lg:col-span-9">
                  <CardHeader>
                    <CardTitle>{tab.title}</CardTitle>
                    <CardDescription>{tab.description}</CardDescription>
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
