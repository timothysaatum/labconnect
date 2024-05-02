import moment from "moment";

export const calcAge = (dob) => {
  let age = moment().diff(moment(dob), "years");
  if (age < 1) {
    age = moment().diff(moment(dob), "months");
    if (age < 1) {
      age = moment().diff(moment(dob), "days");
      return age + " D";
    }
    return age + " M";
  }
  return age + " Y";
};
