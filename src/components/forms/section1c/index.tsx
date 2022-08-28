import React, { FC, useContext, useEffect, useRef, useState } from "react";
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
} from "native-base";

import { Formik } from "formik";

import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./style";
import {
  section1cFormType,
  Section1cScreenProps,
  Section1FormType,
  Section1ScreenProps,
} from "../../../global/types";
import {
  SECTION_1C_FORM_SCHEMA,
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
import { SubmitButton } from "../../common/global";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  saveNextOfKin,
  saveNOKtoStore,
  setNOKTableData,
} from "../../../features/NOK/nextOfKinSlice";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../../../global/globalStyles";
import { UserContext } from "../../../utils/userContext";
import { saveMemberToStore } from "../../../features/member/memberSlice";
import { Keyboard, TextInput } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { SQLError, SQLResultSet, SQLTransaction } from "expo-sqlite";

export const Section1cForm: FC<Section1cScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { saveNextOfKinResponse, NOKGoodToGo, NOKTableData } = useAppSelector(
    (state) => state.nextOfKin
  );
  const { memberTableData, mbrno } = useAppSelector((state) => state.member);
  const { offlineAgent, appIsOnline } = useAppSelector((state) => state.auth);

  const InitialValues: section1cFormType = {
    MBR_NEXT_KIN_SNAME: "",
    MBR_NEXT_KIN_FNAME: "",
    MBR_NEXT_KIN_TEL_NO1: "",
    MBR_NEXT_KIN_TEL_NO2: "",
    MBR_NEXT_KIN_ADDR: "",
    MBR_NEXT_KIN_REL: "",
    MBR_BENEFIT_PYMT: "",
  };

  const createNOKTable = () => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS NOK (id TEXT, MBR_NEXT_KIN_SNAME TEXT, MBR_NEXT_KIN_FNAME TEXT, MBR_NEXT_KIN_TEL_NO1 TEXT, MBR_NEXT_KIN_TEL_NO2 TEXT, MBR_NEXT_KIN_ADDR TEXT, MBR_NEXT_KIN_REL TEXT MBR_BENEFIT_PYMT TEXT);",
        [],
        (txn, ResultSet: SQLResultSet) => {
          console.log("NOK table created successfully");
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const insertIntoNOKTable = (values: section1cFormType & { id: any }) => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "INSERT INTO NOK (id, MBR_NEXT_KIN_SNAME, MBR_NEXT_KIN_FNAME, MBR_NEXT_KIN_TEL_NO1, MBR_NEXT_KIN_TEL_NO2, MBR_NEXT_KIN_ADDR, MBR_NEXT_KIN_REL, MBR_BENEFIT_PYMT,) VALUES (?,?,?,?,?,?,?);",
        [
          mbrno,
          values.MBR_NEXT_KIN_SNAME.trim(),
          values.MBR_NEXT_KIN_FNAME.trim(),
          values.MBR_NEXT_KIN_TEL_NO1.trim(),
          values.MBR_NEXT_KIN_TEL_NO2.trim(),
          values.MBR_NEXT_KIN_ADDR.trim(),
          values.MBR_NEXT_KIN_REL.trim(),
          values.MBR_BENEFIT_PYMT.trim(),
        ],
        (txn: SQLTransaction, ResultSet: SQLResultSet) => {
          console.log("NOK inserted successfully");
        },
        (txn, error) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const getNOKTable = () => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "SELECT * FROM NOK",
        [],
        (txn: SQLTransaction, { rows }: SQLResultSet) => {
          const rowData = rows._array;
          dispatch(setNOKTableData(rowData));
          console.log("NOK fetched successfully");
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const mbrNokSnameRef = useRef<TextInput>(null);
  const mbrNokFnameRef = useRef<TextInput>(null);
  const mbrNokTellNo1Ref = useRef<TextInput>(null);
  const mbrNokTellNo2Ref = useRef<TextInput>(null);
  const mbrNokAddrRef = useRef<TextInput>(null);
  const mbrNokRelRef = useRef<Picker>(null);

  const onSubmitHandler = async (
    values: section1cFormType,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void
  ): Promise<void> => {
    await sleep(500);
    try {
      if (appIsOnline) {
        await dispatch(
          saveNextOfKin({
            MBR_NEXT_KIN_SNAME: values.MBR_NEXT_KIN_SNAME.trim(),
            MBR_NEXT_KIN_FNAME: values.MBR_NEXT_KIN_FNAME.trim(),
            MBR_NEXT_KIN_TEL_NO1: values.MBR_NEXT_KIN_TEL_NO1.trim(),
            MBR_NEXT_KIN_TEL_NO2: values.MBR_NEXT_KIN_TEL_NO2.trim(),
            MBR_NEXT_KIN_ADDR: values.MBR_NEXT_KIN_ADDR.trim(),
            MBR_NEXT_KIN_REL: values.MBR_NEXT_KIN_REL.trim(),
            MBR_BENEFIT_PYMT: values.MBR_BENEFIT_PYMT.substring(0, 1).trim(),
          })
        ).unwrap();
        navigation.navigate("section-screen-2");
      } else if (!appIsOnline) {
        insertIntoNOKTable({
          id: mbrno,
          MBR_NEXT_KIN_SNAME: values.MBR_NEXT_KIN_SNAME.trim(),
          MBR_NEXT_KIN_FNAME: values.MBR_NEXT_KIN_FNAME.trim(),
          MBR_NEXT_KIN_TEL_NO1: values.MBR_NEXT_KIN_TEL_NO1.trim(),
          MBR_NEXT_KIN_TEL_NO2: values.MBR_NEXT_KIN_TEL_NO2.trim(),
          MBR_NEXT_KIN_ADDR: values.MBR_NEXT_KIN_ADDR.trim(),
          MBR_NEXT_KIN_REL: values.MBR_NEXT_KIN_REL.trim(),
          MBR_BENEFIT_PYMT: values.MBR_BENEFIT_PYMT.substring(0, 1).trim(),
        });
        showMessage({
          ...infoConfig,
          description: "NOK data stored locally",
        });
        setSubmitting(false);
        getNOKTable();
        navigation.navigate("section-screen-2");
        resetForm();
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    appIsOnline ? null : createNOKTable();
    return () => clearTimeout(timeoutID);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        validateOnBlur={false}
        validateOnChange={true}
        validationSchema={SECTION_1C_FORM_SCHEMA}
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
          isValid,
          isValidating,
          isSubmitting,
        }) => (
          <VStack mb="32" w="86%" space="3" alignSelf="center">
            <VStack alignItems="center" justifyContent="center" space="2">
              <Text
                fontSize="2xl"
                fontFamily="monstserrat_bold"
                alignSelf="center"
                color="primary_main"
              >
                SECTION 2
              </Text>

              <Text
                fontSize="lg"
                fontFamily="monstserrat_bold"
                alignSelf="center"
                color="primary_main"
              >
                Welfare Scheme
              </Text>
              {/* //! Type Of Benefit */}
              <FormControl
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
                      handleChange("MBR_BENEFIT_PYMT")(itemValue);
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

              <Text style={{marginBottom: -20, marginTop: 10}}
                fontSize="lg"
                fontFamily="monstserrat_bold"
                alignSelf="center"
                color="primary_main"
              >
                Next of Kin
              </Text>
            </VStack>
            {/* //!Next of Kin: Surname */}
            <FormControl
              isRequired
              isInvalid={
                touched.MBR_NEXT_KIN_SNAME && errors.MBR_NEXT_KIN_SNAME
                  ? true
                  : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Surname
                </Text>
              </FormControl.Label>
              <Input
                autoFocus={true}
                ref={mbrNokSnameRef}
                onSubmitEditing={() => mbrNokFnameRef?.current?.focus()}
                blurOnSubmit={false}
                returnKeyType="next"
                maxLength={40}
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.MBR_NEXT_KIN_SNAME}
                onChangeText={handleChange("MBR_NEXT_KIN_SNAME")}
                onBlur={handleBlur("MBR_NEXT_KIN_SNAME")}
                placeholder="Surname"
                rounded="0"
                p="3"
                borderWidth="2"
                fontSize="sm"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_NEXT_KIN_SNAME}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //!Next of Kin: First Name */}
            <FormControl
              isRequired
              isInvalid={
                touched.MBR_NEXT_KIN_FNAME && errors.MBR_NEXT_KIN_FNAME
                  ? true
                  : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  First Name
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrNokFnameRef}
                onSubmitEditing={() => mbrNokTellNo1Ref?.current?.focus()}
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={40}
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.MBR_NEXT_KIN_FNAME}
                onChangeText={handleChange("MBR_NEXT_KIN_FNAME")}
                onBlur={handleBlur("MBR_NEXT_KIN_FNAME")}
                placeholder="First Name"
                rounded="0"
                p="3"
                borderWidth="2"
                fontSize="sm"
                fontFamily="monstserrat_medium"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_NEXT_KIN_FNAME}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! Next of Kin: Phone 1 */}
            <FormControl
              isRequired
              isInvalid={
                touched.MBR_NEXT_KIN_TEL_NO1 && errors.MBR_NEXT_KIN_TEL_NO1
                  ? true
                  : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Phone Number 1
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrNokTellNo1Ref}
                onSubmitEditing={() => mbrNokTellNo2Ref?.current?.focus()}
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={15}
                borderWidth="2"
                borderColor="primary_main"
                keyboardType="numeric"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                value={values.MBR_NEXT_KIN_TEL_NO1}
                onChangeText={handleChange("MBR_NEXT_KIN_TEL_NO1")}
                onBlur={handleBlur("MBR_NEXT_KIN_TEL_NO1")}
                placeholder="0000-000-0000"
                rounded="0"
                p="3"
                fontSize="md"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_NEXT_KIN_TEL_NO1}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //!Next of Kin: Phone 2 */}
            <FormControl
              isInvalid={
                touched.MBR_NEXT_KIN_TEL_NO2 && errors.MBR_NEXT_KIN_TEL_NO2
                  ? true
                  : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Phone Number 2
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrNokTellNo2Ref}
                onSubmitEditing={() => mbrNokAddrRef?.current?.focus()}
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={15}
                borderWidth="2"
                borderColor="primary_main"
                keyboardType="numeric"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                value={values.MBR_NEXT_KIN_TEL_NO2}
                onChangeText={handleChange("MBR_NEXT_KIN_TEL_NO2")}
                onBlur={handleBlur("MBR_NEXT_KIN_TEL_NO2")}
                placeholder="0000-000-0000"
                rounded="0"
                p="3"
                fontSize="sm"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_NEXT_KIN_TEL_NO2}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! Next of Kin Address */}
            <FormControl
              isRequired
              isInvalid={
                touched.MBR_NEXT_KIN_ADDR && errors.MBR_NEXT_KIN_ADDR
                  ? true
                  : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Address
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrNokAddrRef}
                onSubmitEditing={() => mbrNokRelRef?.current?.focus()}
                returnKeyType="next"
                blurOnSubmit={false}
                maxLength={80}
                borderWidth="2"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.MBR_NEXT_KIN_ADDR}
                onChangeText={handleChange("MBR_NEXT_KIN_ADDR")}
                onBlur={handleBlur("MBR_NEXT_KIN_ADDR")}
                placeholder="Enter Address"
                rounded="0"
                p="3"
                fontSize="md"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_NEXT_KIN_ADDR}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! next of kin relationship */}
            <FormControl
              mb="4"
              isRequired
              isInvalid={
                touched.MBR_NEXT_KIN_REL && errors.MBR_NEXT_KIN_REL
                  ? true
                  : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Relationship
                </Text>
              </FormControl.Label>
              <Box
                borderWidth="2"
                rounded="0"
                borderColor={
                  touched.MBR_NEXT_KIN_REL && errors.MBR_NEXT_KIN_REL
                    ? "section_main"
                    : "primary_main"
                }
              >
                <Picker
                  ref={mbrNokRelRef}
                  selectedValue={values.MBR_NEXT_KIN_REL}
                  onValueChange={(itemValue) => {
                    handleChange("MBR_NEXT_KIN_REL")(itemValue);
                    if (isLoaded) {
                      Keyboard.dismiss();
                    }
                  }}
                >
                  {RELATIONSHIPS.map((relationship, index) => (
                    <Picker.Item
                      key={index}
                      label={relationship}
                      value={relationship}
                    />
                  ))}
                </Picker>
              </Box>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_NEXT_KIN_REL}
              </FormControl.ErrorMessage>
            </FormControl>

            

            <SubmitButton
              w="35%"
              isLoading={
                saveNextOfKinResponse.status === "pending" || isSubmitting
                  ? true
                  : false
              }
              alignSelf="center"
              onPress={() => {
                handleSubmit();
              }}
            >
              <HStack justifyContent="center" alignItems="center" space="4">
                <Text color="white" fontSize="lg" fontFamily="monstserrat_bold">
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
