// import { Card, Table } from "flowbite-react";
// import { motion } from "framer-motion";
// import { MdOutlineDeleteOutline } from "react-icons/md";

// export default function Requests() {

//   return (
//     <motion.div
//       className=" md:m-6"

//     >
//       <div
//         initial="hidden"
//         animate="show"
//         exit="hidden"
//         className="flex justify-around gap-4  border-b-2 border-b-gray-200 dark:border-b-gray-500 pb-10 overflow-x-auto"
//       >
//         <div>
//           <Card className="text-center min-w-52 shadow-sm">
//             <h3 className="text-sm font-semibold text-gray-400">
//               Requests Made Today:
//             </h3>
//             <p className="text-4xl">20</p>
//           </Card>
//         </div>
//         <div>
//           <Card className="text-center  min-w-52 shadow-sm">
//             <h3 className="text-sm font-semibold  text-yellow-400">
//               Pending Results:
//             </h3>
//             <p className="text-4xl">5</p>
//           </Card>
//         </div>
//         <div>
//           <Card className="text-center  min-w-52 shadow-sm">
//             <h3 className="text-sm font-semibold text-green-400">Completed:</h3>
//             <p className="text-4xl">10</p>
//           </Card>
//         </div>
//         <div>
//           <Card className="text-center min-w-52 shadow-sm">
//             <h3 className="text-sm font-semibold text-red-400">Rejected:</h3>
//             <p className="text-4xl">5</p>
//           </Card>
//         </div>
//       </div>
//       <div className="overflow-x-auto mt-2 mx-auto">
//         <Table hoverable striped className="drop-shadow-xl">
//           <Table.Head>
//             <Table.HeadCell>Request Id</Table.HeadCell>
//             <Table.HeadCell> Patient Name</Table.HeadCell>
//             <Table.HeadCell>Laboratory</Table.HeadCell>
//             <Table.HeadCell>Request Time </Table.HeadCell>
//             <Table.HeadCell>Request Status</Table.HeadCell>
//             <Table.HeadCell>
//               <span className="sr-only">Edit</span>
//             </Table.HeadCell>
//             <Table.HeadCell>
//               <span className="sr-only">Cancel Request</span>
//             </Table.HeadCell>
//           </Table.Head>
//           <Table.Body>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-yellow-400">Pending</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-red-400">Rejected</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-green-400">Completed</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-yellow-400">Pending</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-red-400">Rejected</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-green-400">COmpleted</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-yellow-400">Pending</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-red-400">Rejected</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//             <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
//               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                 123dse3
//               </Table.Cell>
//               <Table.Cell>Adda</Table.Cell>
//               <Table.Cell>Lancet</Table.Cell>
//               <Table.Cell>2 hours ago</Table.Cell>
//               <Table.Cell className="text-green-400">COmpleted</Table.Cell>
//               <Table.Cell>
//                 <a
//                   href="#"
//                   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
//                 >
//                   Edit
//                 </a>
//               </Table.Cell>
//               <Table.Cell>
//                 {
//                   <MdOutlineDeleteOutline
//                     className="text-red-500"
//                     size={"1.5em"}
//                   />
//                 }
//               </Table.Cell>
//             </Table.Row>
//           </Table.Body>
//         </Table>
//       </div>
//     </motion.div>
//   );
// }
