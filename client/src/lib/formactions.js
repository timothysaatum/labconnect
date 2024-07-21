import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import { selectTestMethod } from "@/redux/lab/updatetestmethodSlice";
import { setSampleTypes } from "@/redux/samples/sampleTypeSlice";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

//sending sample from laboratory to another laboratory
export const useSendSample = () => {
  const queryClient = useQueryClient;
  const axiosPrivate = useAxiosPrivate();

  const onSendSample = async (data) => {
    const newData = {
      ...data,
      patient_age: moment(data.patient_age).format("YYYY-MM-DD"),
    };
    if (
      newData.attachment instanceof FileList &&
      newData.attachment.length > 0
    ) {
      newData.attachment = newData.attachment[0];
    }
    try {
      // const formData = new FormData();

      // for (const key in newData) {
      //   formData.append(key, newData[key]);
      // }
      console.log(newData);
      await axiosPrivate.post("laboratory/sample/add/", newData);
      form.reset();
      queryClient.invalidateQueries(["Requests"]);
      toast.success("Sample Sent", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return onSendSample;
};

//adding a branch to a laboratory
export const useBranchAdd = (
  form,
  keepOpen,
  setOpen,
  serverErrors,
  setServerErrors
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const onBranchAdd = useCallback(
    async (data) => {
      try {
        await axiosPrivate.post("/laboratory/create-branch/", data);
        queryClient.invalidateQueries(["userbranches"]);
        toast.success(`New branch - ${data?.name} added`, {
          position: "top-center",
          duration: 5000,
        });
        form.reset();
        if (!keepOpen) setOpen(false);
      } catch (error) {
        for (const field in error?.response?.data) {
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
        }
        console.log(error);
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          const errorValues = [Object.values(error?.response?.data || {})];
          if (errorValues.length > 0) {
            setServerErrors(errorValues[0]);
          }
        } else if (error?.response?.status === 400) {
          setServerErrors("All fields are required");
        } else {
          setServerErrors("Something went wrong, try again");
        }
        toast.error("unable to add branch. try again later", {
          position: "top-center",
          duration: 5000,
        });
      }
    },
    [form]
  );
  return onBranchAdd;
};
//updating a branch
export const useBranchUpdate = (form, setOpen, id) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const onBranchUpdate = useCallback(
    async (data) => {
      try {
        await axiosPrivate.patch(`/laboratory/branch/update/${id}/`, data);
        queryClient.invalidateQueries(["userbranches"]);
        toast.success("Branch updated successfully");
        form.reset();
        setOpen(false);
      } catch (error) {
        for (const field in error?.response?.data) {
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
        }
        console.log(error);
        toast.error("unable to add branch. try again later", {
          position: "top-center",
          duration: 5000,
        });
      }
    },
    [form]
  );
  return onBranchUpdate;
};

//adding discounts to tests
export const useAddDiscount = (form, test, setOpen) => {
  const axiosPrivate = useAxiosPrivate();
  const onAddDiscount = useCallback(
    async (data) => {
      try {
        await axiosPrivate.patch(`laboratory/test/update/${test?.id}/`, data);
        toast.success("Discount added successfully");
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
    },
    [form]
  );

  return onAddDiscount;
};

// sending manager invite
export const useAddManager = (form, setOpen) => {
  const axiosPrivate = useAxiosPrivate();
  const onAddManager = useCallback(
    async (data) => {
      try {
        await axiosPrivate.post("user/invite/branch-manager/", data);
        form.reset();
        toast.success("Invite Sent", {
          position: "top-center",
        });
        setOpen(false);
      } catch (error) {
        console.log(error);
        toast.error("Error Sending Invite try again", {
          position: "top-center",
        });
      }
    },
    [form]
  );

  return onAddManager;
};

//adding a new sample type
export const useAddSampleType = (
  form,
  setOpen,
  SampleTypes,
  serverErrors,
  setServerErrors
) => {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const onAddSampleType = useCallback(
    async (data) => {
      try {
        const response = await axiosPrivate.post(
          "/laboratory/sample-type/add/",
          data
        );
        dispatch(setSampleTypes([...(SampleTypes || []), response.data]));
        form.reset();
        setOpen(false);
        toast.success(`sample type added successfully`, {
          position: "top-center",
          duration: 5000,
        });
      } catch (error) {
        for (const field in error?.response?.data) {
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
        }
        console.log(error);
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          const errorValues = [Object.values(error?.response?.data || {})];
          if (errorValues.length > 0) {
            setServerErrors(errorValues[0]);
          }
        } else if (error?.response?.status === 400) {
          setServerErrors("All fields are required");
        } else {
          setServerErrors("Something went wrong, try again");
        }
        toast.error(serverErrors, {
          position: "top-center",
          duration: 5000,
        });
      }
    },
    [form]
  );

  return onAddSampleType;
};

//adding a new test

export const useAddTest = (keepOpen, setOpen, form) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const onAddTest = useCallback(
    async (data) => {
      const branchvalue = data?.branch
        ? data.branch.map((branch) => branch.value)
        : [];
      const SampleTypevalue = data?.sample_type
        ? data.sample_type.map((sample_type) => sample_type.value)
        : [];

      const turnAroundTimeWithUnit = data?.turn_around_time + " " + data?.unit;

      const finalData = {
        ...data,
        turn_around_time: turnAroundTimeWithUnit,
        branch: branchvalue,
        sample_type: SampleTypevalue,
      };

      // Remove the unit field from the finalData object
      delete finalData.unit;
      try {
        await axiosPrivate.post("/laboratory/test/add/", finalData);
        queryClient.invalidateQueries(["tests", data?.branch]);
        toast.success(
          `New test- ${data?.name} added ${
            data.branch.length < 2
              ? `${data.branch[0].label}`
              : `to ${data.branch.length} branches`
          } successfully`,
          {
            position: "top-center",
          }
        );
        // if (!keepOpen) setOpen(false);
        // form.reset();
      } catch (error) {
        console.error(error);
      }
    },
    [form]
  );

  return onAddTest;
};

//updating a test
export const useUpdateTest = (setOpen, form, id) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const activeBranch = useSelector(selectActiveBranch);
  const testMethod = useSelector(selectTestMethod);

  // updating for all branches
  const onUpdateTestForAll = useCallback(
    async (data) => {
      const branchvalue = data?.branch
        ? data.branch.map((branch) => branch.value)
        : [];
      const SampleTypevalue = data?.sample_type
        ? data.sample_type.map((sample_type) => sample_type.value)
        : [];

      const turnAroundTimeWithUnit = data?.turn_around_time + " " + data?.unit;

      const finalData = {
        ...data,
        turn_around_time: turnAroundTimeWithUnit,
        branch: branchvalue,
        sample_type: SampleTypevalue,
      };

      // Remove the unit field from the finalData object
      delete finalData.unit;
      try {
        await axiosPrivate.patch(`/laboratory/test/update/${id}/`, finalData);
        queryClient.invalidateQueries(["tests"]);
        toast.success(`${data?.name} updated for all branches`, {
          position: "top-center",
        });
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error(error);
      }
    },
    [form]
  );

  //updating for active
  const onUpdateTestForActiveBranch = useCallback(
    async (data) => {
      console.log(data);
      const branchvalue = data?.branch
        ? data.branch.map((branch) => branch.value)
        : [];
      const SampleTypevalue = data?.sample_type
        ? data.sample_type.map((sample_type) => sample_type.value)
        : [];

      const turnAroundTimeWithUnit = data?.turn_around_time + " " + data?.unit;

      const finalData = {
        ...data,
        turn_around_time: turnAroundTimeWithUnit,
        branch: branchvalue,
        sample_type: SampleTypevalue,
      };

      // Remove the unit field from the finalData object
      delete finalData.unit;
      try {
        await axiosPrivate.patch(
          `/laboratory/update/test-for-branch/${activeBranch}/${id}/`,
          finalData
        );
        queryClient.invalidateQueries(["tests", activeBranch]);
        toast.success(`${data?.name} updated for ${activeBranch}`, {
          position: "top-center",
        });
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error(error);
      }
    },
    [form]
  );
  if (testMethod === "all") {
    return onUpdateTestForAll;
  } else {
    return onUpdateTestForActiveBranch;
  }
};
