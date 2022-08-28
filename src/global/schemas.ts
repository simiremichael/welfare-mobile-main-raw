import * as yup from "yup";

export const LOGIN_SCHEMA = yup.object({
  username: yup.string().required("An Entry is required"),
  password: yup.string().required("An Entry is required"),
});
const DATE_OF_BIRTH = yup.object({
  day: yup.string().required("An Entry is required"),
  month: yup.string().required("An Entry is required"),
  year: yup.string().required("An Entry is required"),
});

export const SECTION_1_FORM_SCHEMA = yup.object({
  MBRSNAME: yup
    .string()
    .required("An Entry is required")
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  MBRFNAME: yup
    .string()
    .required("An Entry is required")
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  middleName: yup.string().matches(/^[aA-zZ-\s]+$/, "only alphabets allowed"),
  MBR_DOB: yup.date(),
  MBR_GENDER: yup
    .string()
    .required("An Entry is required")
    .max(6, "cannot exceed 6 characters")
    .min(3, "minimum of 4 characters"),
  MBR_TEL_NO1: yup
    .string()
    .required("An Entry is required")
    .matches(/^[0-9]+$/, "only numbers allowed")
    .max(15, "cannot exceed 15 characters")
    .test(
      "NonZero",
      `number must start with a "0"`,
      (val) => !isNaN(val) && val[0] === "0"
    )
    .min(11, "minimum of 11 characters"),

  MBR_TEL_NO2: yup
    .string()
    .test(
      "NonZero",
      `number must start with a "0"`,
      (val) =>
        (!isNaN(val) && val[0] === "0") ||
        val === null ||
        val === "" ||
        val === undefined
    )
    .matches(/^[0-9]+$/, "only numbers allowed")
    .min(11, "minimum of 11 characters")
    .max(15, "cannot exceed 15 characters"),
});

export const SECTION_1B_FORM_SCHEMA = yup.object({
  MBR_ADDR_LN1: yup
    .string()
    .required("An Entry is required")
    .matches(/^([a-zA-Z0-9_-\s]+)$/, "invalid entry format")
    .min(5, "minimum of 5 characters")
    .max(35, "cannot exceed 35 characters"),
  MBR_ADDR_LN2: yup
    .string()
    .matches(/^([a-zA-Z0-9 _-\s]+)$/, "invalid entry format")
    .min(5, "minimum of 5 characters")
    .max(35, "cannot exceed 35 characters"),
  MBR_BRANCH: yup.string().required("An Entry is required"),
  MBR_CITY: yup.string(),
  MBR_LGA: yup.string().required("An Entry is required"),
  MBR_STATE: yup.string().required("An Entry is required"),
  MBR_VEHICLE_NO: yup
    .string()
    .required("An Entry is required")
    .max(10, "cannot exceed 10 characters"),
  MBR_VEHICLE_NO2: yup.string().max(10, "cannot exceed 10 characters"),
  RIDERS_CARD_NO: yup.string().max(15, "cannot exceed 15 characters"),
  MBR_STATE_OF_ORIGIN: yup.string().required("An Entry is required"),
  MBR_LGA_OF_ORIGIN: yup.string().required("An Entry is required"),
  MBR_HOME_TOWN: yup.string().required("An Entry is required"),
  MBR_BENEFIT_PYMT: yup.string().required("An Entry is required"),
});

export const SECTION_1C_FORM_SCHEMA = yup.object({
  MBR_NEXT_KIN_SNAME: yup
    .string()
    .required("An Entry is required")
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  MBR_NEXT_KIN_FNAME: yup
    .string()
    .required("An Entry is required")
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  MBR_NEXT_KIN_TEL_NO1: yup
    .string()
    .required("An Entry is required")
    .test(
      "NonZero",
      `number must start with a "0"`,
      (val) => !isNaN(val) && val[0] === "0"
    )
    .matches(/^[0-9]+$/, "only numbers allowed")
    .min(11, "minimum of 11 characters")
    .max(15, "cannot exceed 15 characters"),
  MBR_NEXT_KIN_TEL_NO2: yup
    .string()
    .test(
      "NonZero",
      `number must start with a "0"`,
      (val) =>
        (!isNaN(val) && val[0] === "0") ||
        val === null ||
        val === "" ||
        val === undefined
    )
    .matches(/^[0-9]+$/, "only numbers allowed")
    .min(11, "minimum of 11 characters")
    .max(15, "cannot exceed 15 characters"),

  MBR_NEXT_KIN_ADDR: yup
    .string()
    .required("An Entry is required")
    .matches(/^([a-zA-Z0-9 _-\s]+)$/, "invalid entry format")
    .max(80, "cannot exceed 80 characters")
    .min(3, "minimum of 3 characters"),
  MBR_NEXT_KIN_REL: yup
    .string()
    .required("An Entry is required")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
    MBR_BENEFIT_PYMT: yup.string().required("An Entry is required"),
});

export const SECTION_2_FORM_SCHEMA = yup.object({
  BEN_SNAME: yup
    .string()
    .required("An Entry is required")
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  BEN_FNAME: yup
    .string()
    .required("An Entry is required")
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  BEN_MNAME: yup
    .string()
    .matches(/^[aA-zZ-\s]+$/, "only alphabets allowed")
    .max(40, "cannot exceed 40 characters")
    .min(3, "minimum of 3 characters"),
  BEN_GENDER: yup
    .string()
    .required("An Entry is required")
    .max(6, "cannot exceed 6 characters")
    .min(4, "minimum of 4 characters"),
  BEN_DOB: yup.date(),
  BEN_REL: yup
    .string()
    .required("An Entry is required")
    .max(20, "cannot exceed 20 characters")
    .min(3, "minimum of 3 characters"),
  BEN_TEL_NO1: yup
    .string()
    .test(
      "NonZero",
      `number must start with a "0"`,
      (val) => !isNaN(val) && val[0] === "0"
    )
    .required("An Entry is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .max(15, "cannot exceed 15 characters")
    .min(11, "minimum of 11 characters"),
  BEN_TEL_NO2: yup
    .string()
    .test(
      "NonZero",
      `number must start with a "0"`,
      (val) =>
        (!isNaN(val) && val[0] === "0") ||
        val === null ||
        val === "" ||
        val === undefined
    )
    .matches(/^[0-9]+$/, "Must be only digits")
    .max(15, "cannot exceed 15 characters")
    .min(11, "minimum of 11 characters"),
    BEN_BENEFIT_PYMT: yup.string().required("An Entry is required"),
});
