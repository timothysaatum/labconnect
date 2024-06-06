import {
  Activity,
  ChevronDown,
  CreditCard,
  RefreshCcw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestDialog from "./requestdialog";
import {
  useFetchLabRequests,
  useFetchLabRequestsSent,
  useFetchUserBranches,
} from "@/api/queries";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { useRequestLabColumns } from "../columns/RequestColumn";
import { calcAge } from "@/util/ageCalculate";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function EmptyLab() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        <h3 className="text-xl font-semibold ">
          You have received no samples yet
        </h3>
        <p className="text-sm text-muted-foreground">
          you will see requests made to your lab here{" "}
        </p>
      </div>
    </div>
  );
}
function LoadingLab() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        {/* <h3 className="text-xl font-semibold ">An Error has Occured</h3> */}
        <p className="text-sm text-muted-foreground">loading...</p>
      </div>
    </div>
  );
}
function ErrorLab({ refetch }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center  text-center py-16 ">
        <h3 className="text-xl font-semibold text-destructive ">
          An Error has Occured
        </h3>
        <p className="text-sm text-muted-foreground">
          check your internet connection and try again{" "}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            refetch();
          }}
        >
          Try Again{" "}
          <RefreshCcw className="h-4 w-4 ml-2 text-muted-foreground" />
        </Button>
        <p className="text-muted-foreground text-xs mt-2">
          If error persists{" "}
          <Link className="hover:underline underline-offset-2">Contact us</Link>
        </p>
      </div>
    </div>
  );
}

export default function LaboratoryDashboardOverview() {
  const [requests, setTableRequests] = useState([]);
  const [checked, setChecked] = useState("Sent Samples");
  const requestColumns = useRequestLabColumns();
  const {
    isError,
    data: allrequests,
    isLoading,
    isRefetching,
    refetch,
    isRefetchError,
  } = useFetchLabRequests();
  const {
    isError: sentError,
    data: sentrequests,
    isLoading: sentRequestsLoading,
    refetch: sentRequestsRefetch,
  } = useFetchLabRequestsSent();

  const {
    data: branches,
    isLoading: branchesLoading,
    isError: branchesError,
  } = useFetchUserBranches();
  useEffect(() => {
    setChecked(branches?.data[0]?.id);
  }, [branches?.data]);
  useEffect(() => {
    if (allrequests) {
      setTableRequests(
        allrequests.data.map((request) => {
          return {
            sent_by: request.from_lab,
            Patient: request.name_of_patient,
            Patient_age: calcAge(request.patient_age),
            Sent_by: request.send_by,
            date: request.date_created,
          };
        })
      );
    }
  }, [allrequests]);
  return (
    <main className="px-4 sm:pl-16 ">
      <div className="lg:col-span-3 flex flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 sticky top-2 left-0 ">
          <RequestDialog className="max-md:w-full shadow-sm " />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-medium tracking-wide">
                Samples Received:
              </CardTitle>
              <div className="text-sm font-bold">+2350</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wide">
                Samples Sent:
              </CardTitle>
              <div className="text-sm font-bold">+12,234</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wide">
                proccessed today:
              </CardTitle>
              <div className="text-sm font-bold">+573</div>
            </CardHeader>
          </Card>
        </div>
        <div className="">
          <Tabs defaultValue="Received">
            <TabsList className="max-w-full">
              <TabsTrigger value="Received">Received Samples</TabsTrigger>
              <TabsTrigger value="Sent Samples">Sent Samples</TabsTrigger>
            </TabsList>
            <TabsContent value="Received">
              <Card>
                <CardHeader className="flex flex-row">
                  <div className="flex-1">
                    <CardTitle>Samples</CardTitle>
                    <CardDescription>
                      {checked === "Sent Samples"
                        ? "Samples you have sent to other labs"
                        : "Samples you have received "}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex gap-2">
                        <span className="text-muted-foreground">Viewing:</span>{" "}
                        {
                          branches?.data?.find(
                            (branch) => branch.id === checked
                          )?.branch_name
                        }
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {branches?.data?.map((branch) => (
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
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <LoadingLab />
                  ) : isError ? (
                    <ErrorLab
                      refetch={refetch}
                      isRefetchError={isRefetchError}
                      isRefetching={isRefetching}
                    />
                  ) : allrequests?.data.length < 1 ? (
                    <EmptyLab />
                  ) : (
                    <DataTable
                      data={requests}
                      error={isError}
                      loading={isLoading}
                      columnDef={requestColumns}
                      title={"Requests"}
                      filter={"Patient"}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Sent Samples">
              <Card>
                <CardHeader className="flex flex-row">
                  <div className="flex-1">
                    <CardTitle>Samples</CardTitle>
                    <CardDescription>
                      {checked === "Sent Samples"
                        ? "Samples you have sent to other labs"
                        : "Samples you have received "}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex gap-2">
                        <span className="text-muted-foreground">Viewing:</span>{" "}
                        {
                          branches?.data?.find(
                            (branch) => branch.id === checked
                          )?.branch_name
                        }
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {branches?.data?.map((branch) => (
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
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <LoadingLab />
                  ) : isError ? (
                    <ErrorLab
                      refetch={refetch}
                      isRefetchError={isRefetchError}
                      isRefetching={isRefetching}
                    />
                  ) : allrequests?.data.length < 1 ? (
                    <EmptyLab />
                  ) : (
                    <DataTable
                      data={requests}
                      error={isError}
                      loading={isLoading}
                      columnDef={requestColumns}
                      title={"Requests"}
                      filter={"Patient"}
                    />
                    
                  )}
                  
                </CardContent>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias, quos cumque quas quam illo voluptate expedita sint optio pariatur officia dolorem dolor harum, ad aspernatur ipsa doloremque voluptates voluptatum? Itaque similique eaque odio officiis quo quam odit obcaecati facilis voluptatum expedita quidem molestias, quaerat voluptas aperiam excepturi tempora iusto fuga animi accusamus ipsa corporis ducimus. Earum magnam eligendi esse, voluptatibus commodi eius. Pariatur, eius tenetur! Repellendus mollitia ut delectus repudiandae vero amet aliquid facilis autem magnam adipisci esse aliquam voluptatum dolores est qui praesentium temporibus a numquam, sit soluta debitis quia at. Exercitationem dolorum architecto esse, laudantium debitis quis voluptatum necessitatibus repellendus eos. Odio deserunt voluptatibus dolorum enim, ab eius fugiat, voluptatum consectetur numquam distinctio ipsam dolores? Incidunt sequi vero porro ipsum numquam possimus quasi autem quo natus corporis ad reprehenderit repudiandae sunt corrupti accusantium dolorem, officia dignissimos veniam enim, nobis eum. Minima, vero itaque similique nam cumque eum ipsum quasi quibusdam facere tempora voluptas tempore sequi non voluptatem distinctio nesciunt maxime esse? Provident corrupti vero nisi veniam commodi deserunt a perspiciatis totam eveniet quod? Qui aut quas dolore officiis! Doloremque iusto quisquam iste ratione debitis fugiat nisi dolorum? Ut veritatis odit optio eaque possimus cupiditate. Unde officiis iusto omnis sed est laboriosam atque! Voluptatem facere repellendus voluptate beatae similique dolore, obcaecati molestiae quidem perspiciatis optio dolorum consequuntur odit tempore, rem iusto dignissimos ratione quas modi. Ex animi quam quaerat consequatur repellendus rem qui enim exercitationem explicabo eligendi minima, neque porro possimus, tempora dolorum ducimus incidunt sed reprehenderit odit, laudantium cum tenetur culpa tempore! Voluptates praesentium eveniet similique vel minus impedit sit veritatis odit ducimus aliquid ut repudiandae dolor, omnis optio modi nihil possimus. Aliquid porro perferendis sequi sapiente reiciendis, minima quisquam. Sed amet eos eligendi, ratione illo vitae odit nostrum est magnam aliquam asperiores vero error exercitationem temporibus? Cum excepturi tempora nulla adipisci distinctio beatae saepe quasi reiciendis reprehenderit ipsam modi delectus sed corporis et odit nemo amet molestias libero error, assumenda, quod impedit laudantium. Praesentium voluptatem nesciunt quos exercitationem, vero consequatur illo consequuntur laboriosam eum itaque atque nostrum perspiciatis amet, suscipit id debitis minus nihil deleniti quas, vel accusantium eos distinctio sapiente? Possimus iste praesentium rem nihil aut? Expedita quibusdam numquam voluptatibus repellat inventore? Aut eligendi, dicta ea vero error atque veritatis sit rem animi amet modi facere! Voluptas quis laboriosam minus. Tempora, aspernatur repellat eum voluptas eos necessitatibus dignissimos vitae sed eius suscipit cum aut maxime at non. Iusto, quidem. Inventore tempora obcaecati explicabo eos voluptatum qui animi excepturi suscipit hic assumenda quibusdam molestiae veniam, culpa vel ipsum dolores delectus numquam? Earum, nulla odit ad quos eos voluptates ratione nobis error beatae cum voluptatibus. Neque pariatur officia illum incidunt tenetur repellendus consequatur deserunt magnam dolorem dicta porro, omnis cumque autem, commodi, deleniti earum illo accusamus quae quis dolor tempora obcaecati. Laudantium aperiam inventore tempora temporibus doloremque vel ratione quasi assumenda recusandae exercitationem. Omnis unde corrupti blanditiis aliquam ipsa, repudiandae iusto recusandae. Sit sapiente deserunt distinctio ipsum omnis, reiciendis veritatis dolorem impedit, quaerat temporibus nam expedita deleniti tempore quasi fugit? Minus tenetur iure at quod recusandae officiis non corporis commodi vero consequuntur velit similique laboriosam optio excepturi asperiores deserunt consequatur dolore, quasi sequi eum totam esse nihil corrupti. Laudantium rerum dolore, molestias voluptatem quidem dignissimos, necessitatibus veritatis minima ea expedita culpa. Dolorum architecto a, hic, consectetur, ab et inventore harum deserunt quaerat fuga sapiente placeat itaque possimus. Tempora soluta id labore praesentium atque expedita eius dolorum, reiciendis vel et suscipit esse nam culpa aliquam distinctio! Dolorem error repellat illum optio odit alias, itaque ipsum iure aliquid facilis? Illo placeat assumenda nulla ea quod totam magnam accusamus eligendi saepe voluptatem sint nemo dolore iusto, voluptatibus nisi eaque eos? Aperiam et dignissimos omnis sunt ullam. Nesciunt inventore repudiandae doloribus fugit vero ab! Earum quis, rerum accusantium ab quisquam molestias deleniti atque obcaecati porro, voluptatibus minus magnam harum animi similique. Repellendus iste totam asperiores ratione nihil voluptas suscipit fugiat optio doloremque repellat impedit veritatis, provident, eum culpa ipsum sunt dolorum harum, ullam obcaecati quos qui corrupti! Voluptas dolore, iste vel consectetur aut enim praesentium corrupti ut fugiat iure rerum illo suscipit dolorem sed aliquid aperiam, autem expedita consequuntur nostrum pariatur, placeat asperiores! Eligendi quas repudiandae ut optio placeat nulla ullam fugiat debitis. Aliquid dolorem vitae, voluptates, eaque delectus maiores ducimus, ullam placeat harum rerum saepe sequi magnam vel? Ducimus eaque consequatur minus debitis eos totam veniam dolore quo nisi. Dolore temporibus provident minus consequuntur ex vitae suscipit libero doloremque accusamus sapiente! Cupiditate alias repellendus ut, quaerat, non quod deleniti qui, suscipit accusamus quae rerum soluta repudiandae distinctio facilis? Laboriosam repellat pariatur nam laborum! Ipsam, voluptatem! Fuga perferendis unde recusandae, iure beatae atque fugiat asperiores repellat laboriosam. Vero culpa doloribus quia ullam quisquam quod sapiente, iusto animi tempora quidem ratione! Deserunt, at maxime cum alias voluptatum possimus sint, veniam rerum excepturi porro quaerat sunt laborum nam labore! Sed quidem nam doloribus tempora corporis sint, odit maxime, qui beatae odio consectetur id a totam eveniet, commodi adipisci. Veniam provident expedita blanditiis, fuga magni, nostrum exercitationem accusamus totam rerum dolor reprehenderit molestias cumque libero debitis modi magnam tenetur facilis quisquam praesentium quos! Nulla harum, natus aliquid dolore iusto repellat, repudiandae, aut neque saepe alias perferendis non eos. Minus, soluta? Porro illum eaque obcaecati maiores a necessitatibus quibusdam ullam reprehenderit facilis, ratione at, ab delectus, tenetur non placeat! Quos totam libero quaerat unde amet debitis cupiditate, quas excepturi. Dolor sunt animi beatae cumque laborum tempora enim? Dicta doloremque quo, atque odit dolor expedita, quam qui a vitae doloribus quos tempore inventore molestias hic, cumque at aspernatur explicabo necessitatibus unde delectus nesciunt omnis alias modi. Optio debitis nobis illum voluptatibus soluta ipsum velit numquam quisquam ut, molestias culpa a voluptas officiis dolorem! Explicabo assumenda, laboriosam fugiat quibusdam voluptatibus doloribus nostrum ducimus numquam voluptates eius repellendus nisi. Voluptatibus ab nobis voluptatum ad optio perspiciatis voluptatem aliquam dolorem nisi aliquid repellendus atque, nesciunt iste sapiente deserunt provident saepe aperiam molestiae animi? Dolorum reprehenderit suscipit totam unde, non consectetur deleniti laborum distinctio et? Nulla, obcaecati quod. Earum, tenetur nisi!
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
