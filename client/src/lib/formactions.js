import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { setSampleTypes } from "@/redux/samples/sampleTypeSlice";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

//sending sample from laboratory to another laboratory
export const useSendSample = () => {
  const queryClient = useQueryClient;
  const axiosPrivate = useAxiosPrivate();

  const onSendSample = async (data) => {
    console.log(data);
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
      const formData = new FormData();

      for (const key in newData) {
        formData.append(key, newData[key]);
      }
      await axiosPrivate.post(
        "laboratory/sample/add/",
        formData,

        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      form.reset();
      queryClient.invalidateQueries(["Requests"]);
      toast.success("Sample Sent", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.data);
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
            console.log(errorValues[0]);
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

//adding discounts to tests
export const useAddDiscount = (form, test) => {
  const axiosPrivate = useAxiosPrivate();
  const onAddDiscount = useCallback(
    async (data) => {
      try {
        console.log(data);
        await axiosPrivate.patch(`laboratory/test/update/${test?.id}/`, data);
      } catch (error) {
        console.log(error);
      }
    },
    [form]
  );

  return onAddDiscount;
};

// sending manager invite
export const useAddManager = (form) => {
  const axiosPrivate = useAxiosPrivate();
  const onAddManager = useCallback(
    async (data) => {
      try {
        await axiosPrivate.post("user/invite/branch-manager/", data);
        form.reset();
        toast.success("Invite Sent", {
          position: "top-center",
        });
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
            console.log(errorValues[0]);
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
