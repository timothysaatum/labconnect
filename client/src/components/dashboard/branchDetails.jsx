import { useFetchUserBranches } from "@/api/queries";
import { useParams } from "react-router-dom";

const BranchDetails = () => {
  const { branch_Id } = useParams();
  const { data } = useFetchUserBranches();
  const branchDetails = data?.data?.find((branch) => branch.id === branch_Id);
  console.log(branchDetails);
  return <div>{branch_Id}</div>;
};

export default BranchDetails;
