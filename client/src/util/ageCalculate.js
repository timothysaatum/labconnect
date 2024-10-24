import moment from "moment";

export const calcAge = (dob) => {
  let age = moment().diff(moment(dob), "years");
  if (age < 1) {
    age = moment().diff(moment(dob), "months");
    if (age < 1) {
      age = moment().diff(moment(dob), "days");
      return age > 1 ? age + " Days" : age + " Day";
    }
    return age > 1 ? age + " Months" : age + " Month";
  }
  return age > 1 ? age + " Years" : age + " Year";
};
