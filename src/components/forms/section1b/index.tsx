import React, { FC, useContext, useEffect, useState, useRef } from "react";
import {
  Avatar,
  Button,
  Icon,
  Input,
  VStack,
  Text,
  FormControl,
  HStack,
  WarningOutlineIcon,
  IconButton,
  ScrollView,
  Select,
  CheckIcon,
  Box,
  useDisclose,
  Divider,
} from "native-base";

import { Formik } from "formik";

import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./style";
import {
  section1bFormType,
  Section1bScreenProps,
  Section1FormType,
  Section1FormTypeForLocalDB,
  Section1ScreenProps,
} from "../../../global/types";
import {
  SECTION_1B_FORM_SCHEMA,
  SECTION_1_FORM_SCHEMA,
} from "../../../global/schemas";
import {
  errorConfig,
  infoConfig,
  States,
  successConfig,
} from "../../../utils/constants";
import {
  DAYS,
  MONTHS,
  natamorasDB,
  NIGERIA_STATES_LOCAL_GOVERNMENT_AREA,
  objectArrayToCSVAndSave,
  RELATIONSHIPS,
  sleep,
  STATE_LOCAL_GOVERMENT_BRANCHES_OPERATOR,
  STATE_LOCAL_GOVERMENT_OPERATOR,
  YEARS,
} from "../../../utils/helpers";
import { showMessage } from "react-native-flash-message";
import { openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";
import { SubmitButton } from "../../common/global";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  saveMember,
  saveMemberToStore,
  setMbrno,
  setMemberTableData,
} from "../../../features/member/memberSlice";
import { Section3Form } from "../section3";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Modal from "react-native-modal";
import {
  ButtonProps,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SQLError, SQLResultSet, SQLTransaction } from "expo-sqlite";

export const Section1bForm: FC<Section1bScreenProps> = ({ navigation }) => {
  const { mbrno } = useAppSelector((state) => state.member);
  const createMemberTable = () => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS member (MBR_NO TEXT, MBR_WELFARE_PKG TEXT, MBRSNAME TEXT, MBRFNAME TEXT, MBR_STATUS TEXT, MBR_DOB TEXT, MBR_GENDER TEXT, MBR_TEL_NO1 TEXT, MBR_TEL_NO2 TEXT, MBR_ADDR_LN1 TEXT, MBR_ADDR_LN2 TEXT, MBR_BRANCH TEXT, MBR_CITY TEXT, MBR_LGA TEXT, MBR_STATE TEXT, MBR_VEHICLE_NO TEXT, MBR_VEHICLE_NO2 TEXT, RIDERS_CARD_NO TEXT, MBR_BENEFIT_PYMT TEXT, MBR_NUM_BEN TEXT, MBR_STATE_OF_ORIGIN TEXT, MBR_HOME_TOWN TEXT, MBR_LGA_OF_ORIGIN TEXT)",
        [],
        (txn, ResultSet) => {
          console.log("member table created successfully");
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const insertIntoMemberTable = (values: Section1FormTypeForLocalDB) => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "INSERT INTO member (MBR_NO, MBR_WELFARE_PKG, MBRSNAME, MBRFNAME, MBR_STATUS, MBR_DOB, MBR_GENDER, MBR_TEL_NO1, MBR_TEL_NO2, MBR_ADDR_LN1, MBR_ADDR_LN2, MBR_BRANCH, MBR_CITY, MBR_LGA, MBR_STATE, MBR_VEHICLE_NO, MBR_VEHICLE_NO2, RIDERS_CARD_NO, MBR_BENEFIT_PYMT, MBR_NUM_BEN, MBR_STATE_OF_ORIGIN, MBR_HOME_TOWN, MBR_LGA_OF_ORIGIN) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
        [
          mbrno,
          values.MBR_WELFARE_PKG,
          values.MBRSNAME,
          values.MBRFNAME,
          values.MBR_STATUS,
          values.MBR_DOB.toString(),
          values.MBR_GENDER,
          values.MBR_TEL_NO1,
          values.MBR_TEL_NO2,
          values.MBR_ADDR_LN1,
          values.MBR_ADDR_LN2,
          values.MBR_BRANCH,
          values.MBR_CITY,
          values.MBR_LGA,
          values.MBR_STATE,
          values.MBR_VEHICLE_NO,
          values.MBR_VEHICLE_NO2,
          values.RIDERS_CARD_NO,
          values.MBR_STATE_OF_ORIGIN,
          values.MBR_HOME_TOWN,
          values.MBR_LGA_OF_ORIGIN,
          values.MBR_BENEFIT_PYMT,
          //values.MBR_NUM_BEN,
        ],
        (txn: SQLTransaction, ResultSet: SQLResultSet) => {
          console.log("member inserted successfully");
        },
        (txn, error) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const getMemberTable = () => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "SELECT * FROM member",
        [],
        (txn: SQLTransaction, { rows }: SQLResultSet) => {
          const rowData = rows._array;
          dispatch(setMemberTableData(rowData));
          console.log("member fetched successfully");
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const [hasPickedImage, setHasPickedImage] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [checkboxState, setCheckboxState] = useState<boolean>(false);
  const [kdppIsChecked, setKdppIsChecked] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);
  const { onToggle, isOpen } = useDisclose();
  const dispatch = useAppDispatch();
  const {
    memberInStore,
    membersGoodToGo,
    saveMemberResponse,
    memberTableData,
  } = useAppSelector((state) => state.member);
  const { appIsOnline, offlineAgent } = useAppSelector((state) => state.auth);
  const [membersFromLocalDB, setMembersFromLocalDB] =
    useState<Section1FormTypeForLocalDB | null>(null);

  const InitialValues: section1bFormType = {
    MBR_ADDR_LN1: "",
    MBR_ADDR_LN2: "",
    MBR_BRANCH: "",
    MBR_CITY: "",
    MBR_LGA: "",
    MBR_STATE: "",
    MBR_VEHICLE_NO: "",
    MBR_VEHICLE_NO2: "",
    RIDERS_CARD_NO: "",
    MBR_STATE_OF_ORIGIN: "",
    MBR_HOME_TOWN: "",
    MBR_LGA_OF_ORIGIN: "",
    MBR_BENEFIT_PYMT: "",
  };

  //* input refs //
  let bouncyCheckboxRef = useRef<BouncyCheckbox>();
  let kdppRef = useRef<BouncyCheckbox>(null);
  const mbrAddrLn1Ref = useRef<TextInput>(null);
  const mbrAddrLn2Ref = useRef<TextInput>(null);
  const mbrBranchRef = useRef<Picker>(null);
  const mbrCityRef = useRef<Picker>(null);
  const mbrLgaRef = useRef<Picker>(null);
  const mbrStateRef = useRef<Picker>(null);
  const mbrVehicleNoRef = useRef<TextInput>(null);
  const mbrVehicleNO2Ref = useRef<TextInput>(null);
  const mbrRidersCardNoRef = useRef<TextInput>(null);
  const mbrBenefitPaymentRef = useRef<Picker>(null);

  //* input refs //
  const [LGA, setLGA] = React.useState([]);
  const [selectedLGA, setSelectedLGA] = React.useState("");
  const [selectedState, setSelectedState] = React.useState("");
  const [selectedBranch, setSelectedBranch] = React.useState("");
  const [branchArray, setBranchArray] = React.useState([]);

  const onSubmitHandler = async (
    values: section1bFormType,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void
  ): Promise<void> => {
    try {
      if (appIsOnline) {
        dispatch(
          saveMemberToStore({
            ...memberInStore,
            MBR_ADDR_LN1: values.MBR_ADDR_LN1.trim(),
            MBR_ADDR_LN2: values.MBR_ADDR_LN2.trim(),
            MBR_BRANCH: values.MBR_BRANCH.trim(),
            MBR_CITY: values.MBR_CITY.trim(),
            MBR_LGA: values.MBR_LGA.substring(0, 3).trim(),
            MBR_STATE: values.MBR_STATE.substring(0, 2).trim(),
            MBR_VEHICLE_NO: values.MBR_VEHICLE_NO.toUpperCase().trim(),
            MBR_VEHICLE_NO2: values.MBR_VEHICLE_NO2.toUpperCase().trim(),
            RIDERS_CARD_NO: values.RIDERS_CARD_NO.toUpperCase().trim(),
            MBR_LGA_OF_ORIGIN: values.MBR_LGA_OF_ORIGIN.substring(0, 3).trim(),
          MBR_STATE_OF_ORIGIN: values.MBR_LGA_OF_ORIGIN.substring(0, 2).trim(),
          MBR_HOME_TOWN: values.MBR_HOME_TOWN.trim(),
            MBR_BENEFIT_PYMT: values.MBR_BENEFIT_PYMT.substring(0, 1).trim(),
            MBR_NUM_BEN: 0,
          })
        );
        await dispatch(saveMember(image)).unwrap();
        navigation.navigate("section-stack", { screen: "section-screen-1c" });
      } else if (!appIsOnline) {
        await sleep(500);
        insertIntoMemberTable({
          MBR_NO: mbrno,
          ...memberInStore,
          MBR_ADDR_LN1: values.MBR_ADDR_LN1.trim(),
          MBR_ADDR_LN2: values.MBR_ADDR_LN2.trim(),
          MBR_BRANCH: values.MBR_BRANCH.trim(),
          MBR_CITY: values.MBR_CITY.trim(),
          MBR_LGA: values.MBR_LGA.substring(0, 3).trim(),
          MBR_STATE: values.MBR_STATE.substring(0, 2).trim(),
          MBR_VEHICLE_NO: values.MBR_VEHICLE_NO.toUpperCase().trim(),
          MBR_VEHICLE_NO2: values.MBR_VEHICLE_NO2.toUpperCase().trim(),
          RIDERS_CARD_NO: values.RIDERS_CARD_NO.toUpperCase().trim(),
          MBR_LGA_OF_ORIGIN: values.MBR_LGA_OF_ORIGIN.substring(0, 3).trim(),
          MBR_STATE_OF_ORIGIN: values.MBR_LGA_OF_ORIGIN.substring(0, 2).trim(),
          MBR_HOME_TOWN: values.MBR_HOME_TOWN.trim(),
          MBR_BENEFIT_PYMT: values.MBR_BENEFIT_PYMT.substring(0, 1).trim(),
          MBR_NUM_BEN: 0,
        });
        showMessage({
          ...infoConfig,
          description: "member data stored locally",
        });
        setSubmitting(false);
        getMemberTable();
        navigation.navigate("section-stack", {
          screen: "section-screen-1c",
        });
        resetForm();
      } else {
        return;
      }
    } catch (error) {}
  };

  const alertBtnHandler = (): void => {
    onToggle();
    if (!checkboxState) {
      bouncyCheckboxRef?.current?.onPress();
    }
    if (!kdppIsChecked) {
      kdppRef?.current?.onPress();
    }
  };

  useEffect(() => {
    var arr = [];
    while (arr.length < 8) {
      var r = Math.floor(Math.random() * 10);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    var finalNumber = arr.join("");
    dispatch(setMbrno(finalNumber));
    console.log("id number array : ", finalNumber);
    mbrAddrLn1Ref?.current?.focus();
    appIsOnline ? null : createMemberTable();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box>
        <Modal
          animationIn="zoomIn"
          animationOut="zoomOut"
          onBackdropPress={onToggle}
          onBackButtonPress={onToggle}
          isVisible={isOpen}
        >
         
        </Modal>
      </Box>
      {/*
      <Section3Form
        image={image}
        setImage={setImage}
        setHasPickedImage={setHasPickedImage}
      />
  */}
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validationSchema={SECTION_1B_FORM_SCHEMA}
        initialValues={InitialValues}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          onSubmitHandler(values, resetForm, setSubmitting);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isSubmitting,
          setSubmitting,
          isValidating,
        }) => (
          <VStack w="86%" space="5" justifyContent="center" alignSelf="center">
            <VStack space="3">
              <FormControl
                isRequired
                isInvalid={
                  touched.MBR_ADDR_LN1 && errors.MBR_ADDR_LN1 ? true : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Address line 1
                  </Text>
                </FormControl.Label>
                <Input
                  autoFocus={true}
                  ref={mbrAddrLn1Ref}
                  returnKeyType="next"
                  onSubmitEditing={() => mbrAddrLn2Ref?.current?.focus()}
                  blurOnSubmit={false}
                  maxLength={35}
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  value={values.MBR_ADDR_LN1}
                  onChangeText={handleChange("MBR_ADDR_LN1")}
                  onBlur={handleBlur("MBR_ADDR_LN1")}
                  placeholder="Enter Address"
                  rounded="0"
                  p="3"
                  borderWidth="2"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_ADDR_LN1}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* //! Address Line 2 */}
              <FormControl
                isInvalid={
                  touched.MBR_ADDR_LN2 && errors.MBR_ADDR_LN2 ? true : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Address line 2
                  </Text>
                </FormControl.Label>
                <Input
                  ref={mbrAddrLn2Ref}
                  returnKeyType="next"
                  onSubmitEditing={() => mbrCityRef?.current?.focus()}
                  blurOnSubmit={false}
                  maxLength={35}
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  value={values.MBR_ADDR_LN2}
                  onChangeText={handleChange("MBR_ADDR_LN2")}
                  onBlur={handleBlur("MBR_ADDR_LN2")}
                  placeholder="Enter Address"
                  rounded="0"
                  p="3"
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  borderWidth="2"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_ADDR_LN2}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* //!city */}
              <FormControl
                isRequired
                isInvalid={touched.MBR_CITY && errors.MBR_CITY ? true : false}
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    City
                  </Text>
                </FormControl.Label>
                <Input
                  returnKeyType="next"
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  value={values.MBR_CITY}
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  onChangeText={handleChange("MBR_CITY")}
                  onBlur={handleBlur("MBR_CITY")}
                  placeholder="Enter City"
                  rounded="0"
                  p="3"
                  borderWidth="2"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_CITY}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* //! State */}
              <FormControl
                isRequired
                isInvalid={errors.MBR_STATE && touched.MBR_STATE ? true : false}
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    State
                  </Text>
                </FormControl.Label>
                <Box
                  borderWidth="2"
                  rounded="0"
                  borderColor={
                    touched.MBR_STATE && errors.MBR_STATE
                      ? "section_main"
                      : "primary_main"
                  }
                >
                  <Picker
                    selectedValue={values.MBR_STATE}
                    onValueChange={(itemValue) => {
                      setLGA(STATE_LOCAL_GOVERMENT_OPERATOR(itemValue));
                      setSelectedState(itemValue);
                      handleChange("MBR_STATE")(itemValue);
                    }}
                  >
                    <Picker.Item label="select State" value="select State" />
                    {States.map((state, index) => (
                      <Picker.Item
                        label={state === "Abuja" ? "FCT Abuja" : state}
                        value={state}
                        key={index}
                      />
                    ))}
                  </Picker>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_STATE}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* //! Local Government Area*/}
              <FormControl
                isRequired
                isInvalid={touched.MBR_LGA && errors.MBR_LGA ? true : false}
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Local Government Area
                  </Text>
                </FormControl.Label>
                <Box
                  borderWidth="2"
                  rounded="0"
                  borderColor={
                    touched.MBR_LGA && errors.MBR_LGA
                      ? "section_main"
                      : "primary_main"
                  }
                >
                  <Picker
                    selectedValue={values.MBR_LGA}
                    onValueChange={(itemValue) => {
                      setSelectedLGA(itemValue);
                      setBranchArray(
                        STATE_LOCAL_GOVERMENT_BRANCHES_OPERATOR(itemValue)
                      );
                      handleChange("MBR_LGA")(itemValue);
                    }}
                  >
                    <Picker.Item
                      label="Select Local Government Area"
                      value="Select Local Government Area"
                    />
                    {LGA.map((lga, index) => (
                      <Picker.Item
                        label={lga.label}
                        value={lga.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_LGA}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* //! Branch */}
              <FormControl
                isRequired
                isInvalid={
                  touched.MBR_BRANCH && errors.MBR_BRANCH ? true : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Branch
                  </Text>
                </FormControl.Label>

                <Box
                  borderWidth="2"
                  rounded="0"
                  borderColor={
                    touched.MBR_BRANCH && errors.MBR_BRANCH
                      ? "section_main"
                      : "primary_main"
                  }
                >
                  <Picker
                    selectedValue={values.MBR_BRANCH}
                    onValueChange={(itemValue) => {
                      setSelectedBranch(itemValue);
                      handleChange("MBR_BRANCH")(itemValue);
                    }}
                  >
                    <Picker.Item label="Select Branch" value="Select Branch" />
                    {branchArray.map((branch, index) => (
                      <Select.Item
                        label={branch.label}
                        value={branch.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_BRANCH}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* //!Vehicle Reg. no */}
              <FormControl
                isRequired
                isInvalid={
                  touched.MBR_VEHICLE_NO && errors.MBR_VEHICLE_NO ? true : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Vehicle Reg. no
                  </Text>
                </FormControl.Label>
                <Input
                  ref={mbrVehicleNoRef}
                  returnKeyType="next"
                  onSubmitEditing={() => mbrVehicleNO2Ref?.current?.focus()}
                  blurOnSubmit={false}
                  maxLength={10}
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  borderWidth="2"
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  value={values.MBR_VEHICLE_NO}
                  onChangeText={handleChange("MBR_VEHICLE_NO")}
                  onBlur={handleBlur("MBR_VEHICLE_NO")}
                  placeholder="Enter Vehicle Reg. no"
                  rounded="0"
                  p="3"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_VEHICLE_NO}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* //!Vehicle Reg. no 2*/}
              <FormControl
                isInvalid={
                  touched.MBR_VEHICLE_NO2 && errors.MBR_VEHICLE_NO2
                    ? true
                    : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Vehicle Reg. no 2
                  </Text>
                </FormControl.Label>
                <Input
                  ref={mbrVehicleNO2Ref}
                  returnKeyType="next"
                  onSubmitEditing={() => mbrRidersCardNoRef?.current?.focus()}
                  blurOnSubmit={false}
                  maxLength={10}
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  borderWidth="2"
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  value={values.MBR_VEHICLE_NO2}
                  onChangeText={handleChange("MBR_VEHICLE_NO2")}
                  onBlur={handleBlur("MBR_VEHICLE_NO2")}
                  placeholder="Enter Vehicle Reg. no"
                  rounded="0"
                  p="3"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_VEHICLE_NO2}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* //!Riders card no 2*/}
              <FormControl
                isInvalid={
                  touched.RIDERS_CARD_NO && errors.RIDERS_CARD_NO ? true : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Riders Card no
                  </Text>
                </FormControl.Label>
                <Input
                  ref={mbrRidersCardNoRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    mbrBenefitPaymentRef?.current?.focus();
                  }}
                  maxLength={15}
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  borderWidth="2"
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  value={values.RIDERS_CARD_NO}
                  onChangeText={handleChange("RIDERS_CARD_NO")}
                  onBlur={handleBlur("RIDERS_CARD_NO")}
                  placeholder="Enter Riders Card. no"
                  rounded="0"
                  p="3"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.RIDERS_CARD_NO}
                </FormControl.ErrorMessage>
              </FormControl>


               {/* //! State of origin */}
               <FormControl
                isRequired
                isInvalid={errors.MBR_STATE_OF_ORIGIN && touched.MBR_STATE_OF_ORIGIN ? true : false}
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    State Of Origin
                  </Text>
                </FormControl.Label>
                <Box
                  borderWidth="2"
                  rounded="0"
                  borderColor={
                    touched.MBR_STATE_OF_ORIGIN && errors.MBR_STATE_OF_ORIGIN
                      ? "section_main"
                      : "primary_main"
                  }
                >
                  <Picker
                    selectedValue={values.MBR_STATE_OF_ORIGIN}
                    onValueChange={(itemValue) => {
                      setLGA(STATE_LOCAL_GOVERMENT_OPERATOR(itemValue));
                      setSelectedState(itemValue);
                      handleChange("MBR_STATE")(itemValue);
                    }}
                  >
                    <Picker.Item label="select State" value="select State" />
                    {States.map((state, index) => (
                      <Picker.Item
                        label={state === "Abuja" ? "FCT Abuja" : state}
                        value={state}
                        key={index}
                      />
                    ))}
                  </Picker>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_STATE_OF_ORIGIN}
                </FormControl.ErrorMessage>
              </FormControl>

               
              {/* //! LGA of origin*/}
              <FormControl
                isRequired
                isInvalid={touched.MBR_LGA_OF_ORIGIN && errors.MBR_LGA_OF_ORIGIN ? true : false}
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    LGA Of Origin
                  </Text>
                </FormControl.Label>
                <Box
                  borderWidth="2"
                  rounded="0"
                  borderColor={
                    touched.MBR_LGA_OF_ORIGIN && errors.MBR_LGA_OF_ORIGIN
                      ? "section_main"
                      : "primary_main"
                  }
                >
                  <Picker
                    selectedValue={values.MBR_LGA_OF_ORIGIN}
                    onValueChange={(itemValue) => {
                      setSelectedLGA(itemValue);
                      setBranchArray(
                        STATE_LOCAL_GOVERMENT_BRANCHES_OPERATOR(itemValue)
                      );
                      handleChange("MBR_LGA_OF_ORIGIN")(itemValue);
                    }}
                  >
                    <Picker.Item
                      label="Select Local Government Area"
                      value="Select Local Government Area"
                    />
                    {LGA.map((lga, index) => (
                      <Picker.Item
                        label={lga.label}
                        value={lga.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_LGA_OF_ORIGIN}
                </FormControl.ErrorMessage>
              </FormControl>
    {/* //!Home town*/}
    <FormControl
                isRequired
                isInvalid={touched.MBR_HOME_TOWN && errors.MBR_HOME_TOWN  ? true : false}
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Home Town
                  </Text>
                </FormControl.Label>
                <Input
                  returnKeyType="next"
                  fontSize="md"
                  fontFamily="monstserrat_medium"
                  value={values.MBR_HOME_TOWN }
                  variant="outline"
                  _focus={{
                    borderColor: "input_secondary",
                    bgColor: "white",
                  }}
                  borderColor="primary_main"
                  onChangeText={handleChange("MBR_HOME_TOWN ")}
                  onBlur={handleBlur("MBR_HOME_TOWN ")}
                  placeholder="Enter City"
                  rounded="0"
                  p="3"
                  borderWidth="2"
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_HOME_TOWN }
                </FormControl.ErrorMessage>
              </FormControl>

                {/* //! Type Of Benefit */}
          {/* <FormControl
                isRequired
                isInvalid={
                  touched.MBR_BENEFIT_PYMT && errors.MBR_BENEFIT_PYMT
                    ? true
                    : false
                }
              >
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Type Of Benefit
                  </Text>
                </FormControl.Label>
                <Box
                  borderWidth="2"
                  rounded="0"
                  borderColor={
                    touched.MBR_BENEFIT_PYMT && errors.MBR_BENEFIT_PYMT
                      ? "section_main"
                      : "primary_main"
                  }
                >
                  <Picker
                    selectedValue={values.MBR_BENEFIT_PYMT}
                    onValueChange={(itemValue) => {
                      handleChange("BEN_BENEFIT_PYMT")(itemValue);
                    }}
                    placeholder="Select Type Of Benefit"
                  >
                    <Picker.Item
                      label="Select Type Of Benefit"
                      value="Select Type Of Benefit"
                    />
                    <Picker.Item
                      label="O - One-time pay-out"
                      value="O - One-time pay-out"
                    />
                    <Picker.Item
                      label="V - Variable pay-out "
                      value="V - Variable pay-out "
                    />
                  </Picker>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.MBR_BENEFIT_PYMT}
                </FormControl.ErrorMessage>
              </FormControl>
                  */}
              </VStack>
            <SubmitButton
              w="35%"
              isLoading={
                saveMemberResponse?.status === "pending" || isSubmitting
                  ? true
                  : false
              }
              alignSelf="center"
              onPress={() => {
                if (!checkboxState) {
                  onToggle();
                } else if (!kdppIsChecked) {
                  onToggle();
                } else if (!hasPickedImage) {
                  showMessage({
                    ...errorConfig,
                    description: "please select an image",
                  });
                } else {
                  handleSubmit();
                }
                // navigation.navigate("section-screen-1c");
              }}
            >
              <HStack justifyContent="center" alignItems="center" space="4">
                <Text color="white" fontSize="md" fontFamily="monstserrat_bold">
                  Next
                </Text>
                <Icon
                  as={MaterialIcons}
                  name="arrow-forward-ios"
                  size="sm"
                  color="white"
                />
              </HStack>
            </SubmitButton>
          </VStack>
        )}
      </Formik>
    </ScrollView>
  );
};
