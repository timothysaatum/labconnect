export const GetCurrentStep = (status) => {
  switch (status) {
    case "Request Made":
      return 1;
    case "Received by delivery":
      return 2;
    case "Received by lab":
      return 3;
    case "Completed":
      return 4;
    default:
      return 0;
  }
};
