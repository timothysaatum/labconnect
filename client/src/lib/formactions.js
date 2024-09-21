import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { selectActiveBranch } from "@/redux/branches/activeBranchSlice";
import { selectTestMethod } from "@/redux/lab/updatetestmethodSlice";
import { setSampleTypes } from "@/redux/samples/sampleTypeSlice";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//sending sample from laboratory to another laboratory
export const useSendSample = (form) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const onSendSample = async (data) => {
    try {
      const testvalue = data?.tests ? data.tests.map((test) => test.value) : [];
      const newData = {
        ...data,
        patient_age: moment(data.patient_age).format("YYYY-MM-DD"),
        tests: testvalue,
      };

      if (
        newData.attachment instanceof FileList &&
        newData.attachment.length > 0
      ) {
        newData.attachment = newData.attachment[0];
      } else {
        delete newData.attachment;
      }

      const formData = new FormData();

      // Append other fields
      for (const key in newData) {
        if (key === "tests") {
          // Stringify the array before appending
          formData.append(key, JSON.stringify(newData.tests));
        } else {
          formData.append(key, newData[key]);
        }
      }
      console.log(formData);

      await axiosPrivate.post("laboratory/sample/add/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
        toast.success(`New branch - ${data?.branch_name} added`, {
          position: "top-center",
          duration: 5000,
        });
        // form.reset();
        if (!keepOpen) setOpen(false);
      } catch (error) {
        for (const field in error?.response?.data) {
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
        }
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
        const manager = data?.branch_manager
          ? data.branch_manager.map((item) => item.value)
          : [];

        const newData = {
          ...data,
          branch_manager: manager,
        };
        await axiosPrivate.patch(`/laboratory/branch/update/${id}/`, newData);
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
        toast.error("Unable to update branch. try again later", {
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

//create Lab
export const useCreateLab = (form, setStep, fieldToStep) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const onCreateLab = useCallback(
    async (data) => {
      try {
        let newData = {
          ...data,
          website:
            data?.website && !data.website.startsWith("http")
              ? `http://${data.website}`
              : data.website,
        };
        if (newData.logo instanceof FileList && newData.logo.length > 0) {
          newData.logo = newData.logo[0];
        } else {
          delete newData.logo;
        }

        const formData = new FormData();

        for (const key in newData) {
          formData.append(key, newData[key]);
        }
        console.log(newData);
        await axiosPrivate.post(
          "laboratory/create/",
          formData,

          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        form.reset();
        toast.success("Laboratory created successfully", {
          description: "You can now add branches and tests",
        });
        queryClient.invalidateQueries(["Laboratory"]);
        navigate("/dashboard/my-laboratory");
      } catch (error) {
        for (const field in error?.response?.data) {
          if (field === "logo") {
            toast.error(error.response.data[field][0]);
          }
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
          // Look up the step associated with the field and set the current step
          const step = fieldToStep[field];
          if (step !== undefined) {
            setStep(step);
            break; // Exit the loop after finding the first error
          }
        }
      }
    },
    [form]
  );

  return onCreateLab;
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
        if (keepOpen) {
          setOpen(true);
        } else {
          setOpen(false);
        }
        form.reset();
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

// reject sample
export const useRejectSample = (form, id) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const onRejectSample = useCallback(
    async (data) => {
      try {
        await axiosPrivate.patch(`/laboratory/sample/update/${id}/`, data);
        queryClient.invalidateQueries(["userbranches"]);
        toast.success("Sample Rejected");
        form.reset();
      } catch (error) {
        for (const field in error?.response?.data) {
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
        }
        console.log(error);
        toast.error("an error occured", {
          duration: 5000,
        });
      }
    },
    [form]
  );
  return onRejectSample;
};

export const useResultUpload = (form) => {
  const axiosPrivate = useAxiosPrivate();
  const onResultUpload = useCallback(
    async (data) => {
      console.log(data);
      try {
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        await axiosPrivate.post(`/laboratory/test/result/add/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Upload successful");
        form.reset();
      } catch (error) {
        toast.error("Error uploading result. Try again");
      }
    },
    [form]
  );
  return onResultUpload;
};

//hospitals

export const useAddHospital = (form, fieldToStep, setStep) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const from = "/dashboard/overview";
  const navigate = useNavigate();

  const onAddHospital = useCallback(
    async (data) => {
      try {
        await axiosPrivate.post(`/hospital/add/`, data);
        toast.success("Hospical added sucessfully");
        queryClient.invalidateQueries(["Hospital"]);
        form.reset();
        navigate(from);
      } catch (error) {
        for (const field in error?.response?.data) {
          form.setError(field, {
            type: "manual",
            message: error.response.data[field][0],
          });
          // Look up the step associated with the field and set the current step
          const step = fieldToStep[field];
          if (step !== undefined) {
            setStep(step);
            break; // Exit the loop after finding the first error
          }
        }
      }
    },
    [form]
  );
  return onAddHospital;
};

export const useSendHospitalSample = (form) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const onSendHospitalSample = async (data) => {
    try {
      const testvalue = data?.tests ? data.tests.map((test) => test.value) : [];
      const newData = {
        ...data,
        patient_age: moment(data.patient_age).format("YYYY-MM-DD"),
        tests: testvalue,
      };

      if (
        newData.attachment instanceof FileList &&
        newData.attachment.length > 0
      ) {
        newData.attachment = newData.attachment[0];
      } else {
        delete newData.attachment;
      }

      const formData = new FormData();

      // Append other fields
      for (const key in newData) {
        if (key === "tests") {
          // Stringify the array before appending
          formData.append(key, JSON.stringify(newData.tests));
        } else {
          formData.append(key, newData[key]);
        }
      }
      console.log(formData);

      await axiosPrivate.post("hospital/health-worker/add/sample/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      form.reset();
      queryClient.invalidateQueries(["Requests"]);
      toast.success("Sample Sent", {
        position: "top-center",
      });
    } catch (error) {
      for (const field in error?.response?.data) {
        form.setError(field, {
          type: "manual",
          message: error.response.data[field][0],
        });
        // Look up the step associated with the field and set the current step
      }
    }
  };

  return onSendHospitalSample;
};
