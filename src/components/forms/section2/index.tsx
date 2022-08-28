import { ErrorMessage, Field, FieldArray, Formik, FormikHelpers } from "formik";
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Select,
  VStack,
  WarningOutlineIcon,
  Text,
  CloseIcon,
  IconButton,
  Divider,
  View,
  Icon,
  useDisclose,
} from "native-base";
import React, { useState, FC, useRef, useContext, useEffect } from "react";
import { Keyboard, TextInput, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";
import { SECTION_2_FORM_SCHEMA } from "../../../global/schemas";
import {
  BeneficiaryFormType,
  BeneficiaryTableData,
  Section2FormType,
  Section2ScreenProps,
} from "../../../global/types";
import {
  errorConfig,
  infoConfig,
  successConfig,
} from "../../../utils/constants";
import {
  clearMemberId,
  DAYS,
  MONTHS,
  natamorasDB,
  objectArrayToCSVAndSave,
  RELATIONSHIPS,
  sleep,
  YEARS,
} from "../../../utils/helpers";
import { SubmitButton } from "../../common/global";
import styles from "./style";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  addToBenCount,
  resetBen,
  saveBeneficiary,
  saveBenToStore,
  setBeneficiaryTableData,
} from "../../../features/beneficiary/beneficiarySlice";
import { UserContext } from "../../../utils/userContext";
import Modal from "react-native-modal";
//import DatePicker from "react-native-date-picker";
import moment from "moment";
import { SQLError, SQLResultSet, SQLTransaction } from "expo-sqlite";
import DatePicker from 'react-native-neat-date-picker';
import { getArchtype } from "immer/dist/internal";

export const Section2Form: FC<Section2ScreenProps> = ({ navigation }) => {
  const { isOpen, onToggle } = useDisclose();
  const dispatch = useAppDispatch();
  const { saveBeneficiaryResponse, beneficiaryCount, beneficiaryTableData } =
    useAppSelector((state) => state.beneficiary);
  const { memberTableData, mbrno } = useAppSelector((state) => state.member);
  const { offlineAgent, appIsOnline } = useAppSelector((state) => state.auth);
  const { NOKTableData } = useAppSelector((state) => state.nextOfKin);
  const { status } = saveBeneficiaryResponse;

  const InitialValues: Section2FormType = {
    BEN_SNAME: "",
    BEN_FNAME: "",
    BEN_MNAME: "",
    BEN_GENDER: "",
    BEN_DOB: new Date(),
    BEN_REL: "",
    BEN_TEL_NO1: "",
    BEN_TEL_NO2: "",
    BEN_BENEFIT_PYMT: ""
  };

  const onDismissHandler = (): void => {
    onToggle();
    clearMemberId();
    dispatch(resetBen());
    navigation.navigate("section-screen-1");
  };

  const onSubmitHandler = async (
    values: any,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void
  ): Promise<void> => {
    try {
      if (appIsOnline) {
        await dispatch(
          saveBeneficiary({
            BEN_SNAME: values.BEN_SNAME.trim(),
            BEN_FNAME: `${values.BEN_FNAME} ${values.BEN_MNAME}`.trim(),
            BEN_DOB: moment(values.BEN_DOB).format("YYYY-MM-DD").trim(),
            BEN_GENDER: values.BEN_GENDER.trim(),
            BEN_REL: values.BEN_REL.trim(),
            BEN_TEL_NO1: values.BEN_TEL_NO1.trim(),
            BEN_TEL_NO2: values.BEN_TEL_NO2.trim(),
            BEN_STATUS: "alive".trim(),
            BEN_BENEFIT_PYMT: values.BEN_BENEFIT_PYMT.trim(),
          })
        ).unwrap();
        resetForm();
      } else if (!appIsOnline) {
        await sleep(500);
        insertIntoBeneficiaryTable({
          id: mbrno,
          BEN_SNAME: values.BEN_SNAME.trim(),
          BEN_FNAME: `${values.BEN_FNAME} ${values.BEN_MNAME}`.trim(),
          BEN_DOB: moment(values.BEN_DOB).format("YYYY-MM-DD").trim(),
          BEN_GENDER: values.BEN_GENDER.trim(),
          BEN_REL: values.BEN_REL.trim(),
          BEN_TEL_NO1: values.BEN_TEL_NO1.trim(),
          BEN_TEL_NO2: values.BEN_TEL_NO2.trim(),
          BEN_STATUS: "alive".trim(),
          BEN_BENEFIT_PYMT: values.BEN_BENEFIT_PYMT.trim(),
        });
        resetForm();
        showMessage({
          ...infoConfig,
          description: "beneficiary data stored locally",
        });
        setSubmitting(false);
        getBeneficiaryTable();
      }
    } catch (error) {}
  };

  const benSnameRef = useRef<TextInput>(null);
  const benFnameRef = useRef<TextInput>(null);
  const benMnameRef = useRef<TextInput>(null);
  const benGenderRef = useRef<Picker>(null);
  const benRelRef = useRef<Picker>(null);
  const benTelNo1Ref = useRef<TextInput>(null);
  const benTelNo2Ref = useRef<TextInput>(null);
  const benBenefitPymtRef = useRef<TextInput>(null);

  const emptyBen: BeneficiaryTableData[] = [
    {
      BEN_SNAME: "",
      BEN_FNAME: "",
      BEN_GENDER: "",
      BEN_DOB: "",
      BEN_REL: "",
      BEN_TEL_NO1: "",
      BEN_TEL_NO2: "",
      BEN_BENEFIT_PYMT: "",
    },
  ];

  const nextPressHandler = () => {
    if (appIsOnline) {
      onToggle();
    } else if (!appIsOnline) {
      dispatch(resetBen());
      objectArrayToCSVAndSave(
        offlineAgent,
        memberTableData,
        NOKTableData,
        beneficiaryTableData.length <= 0 ? emptyBen : beneficiaryTableData,
        ["agent", "member", "NOK", "beneficiary"],
        navigation,
        `${mbrno}`
      );
    } else {
      return;
    }
  };
  const continuePressHandler = (): void => {
    if (appIsOnline) {
      onToggle();
      navigation.navigate("section-screen-1");
    } else if (!appIsOnline) {
      objectArrayToCSVAndSave(
        offlineAgent,
        memberTableData,
        NOKTableData,
        beneficiaryTableData,
        ["agent", "member", "NOK", "beneficiary"],
        navigation,
        `${mbrno}`
      );
    } else {
      return;
    }
  };

  const createBeneficiaryTable = () => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS beneficiary (id TEXT, BEN_SNAME TEXT,BEN_FNAME TEXT, BEN_DOB TEXT, BEN_GENDER TEXT, BEN_REL TEXT, BEN_TEL_NO1 TEXT, BEN_TEL_NO2 TEXT, BEN_STATUS TEXT BEN_BENEFIT_PYMT TEXT);",
        [],
        (txn: SQLTransaction, ResultSet: SQLResultSet) => {
          console.log("beneficiary table created successfully");
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const insertIntoBeneficiaryTable = (
    values: BeneficiaryFormType & { id: any }
  ) => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "INSERT INTO beneficiary ( id, BEN_SNAME, BEN_FNAME, BEN_DOB, BEN_GENDER, BEN_REL, BEN_TEL_NO1, BEN_TEL_NO2, BEN_STATUS, BEN_BENEFIT_PYMT) VALUES (?,?,?,?,?,?,?,?,?);",
        [
          mbrno,
          values.BEN_SNAME,
          values.BEN_FNAME,
          values.BEN_DOB,
          values.BEN_GENDER,
          values.BEN_REL,
          values.BEN_TEL_NO1,
          values.BEN_TEL_NO2,
          values.BEN_STATUS,
          values.BEN_BENEFIT_PYMT,
        ],
        (txn: SQLTransaction, ResultSet: SQLResultSet) => {
          console.log("beneficiary inserted successfully");
          dispatch(addToBenCount());
        },
        (txn, error) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const getBeneficiaryTable = () => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        "SELECT * FROM beneficiary",
        [],
        (txn: SQLTransaction, { rows }: SQLResultSet) => {
          const rowData = rows._array;
          dispatch(setBeneficiaryTableData(rowData));
          console.log("beneficiary fetched successfully");
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const [isLoaded, setIsLoaded] = useState<boolean>();

  useEffect(() => {
    benSnameRef?.current?.focus();
    const timeoutID = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    !appIsOnline ? createBeneficiaryTable() : null;
    return () => clearTimeout(timeoutID);
  }, []);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  const onCancel = () => {
    // You should close the modal in here
    setShowDatePicker(false);
  };
  const onConfirm = output => {
    // You should close the modal in here
    setShowDatePicker(false);
    // The parameter 'output' is an object containing date and dateString (for single mode).
    // For range mode, the output contains startDate, startDateString, endDate, and EndDateString
    console.log(output.date);
    console.log(output.dateString);
  };


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
          <VStack
            rounded="2xl"
            alignSelf="center"
            justifyContent="center"
            alignItems="center"
            space="5"
            bgColor={beneficiaryCount <= 0 ? "#C4E8EF" : "#CBE1CE"}
            w="72"
            h="72"
            pb="5"
          >
            <VStack pt="5" w="100%" justifyContent="center" alignItems="center">
              <Text
                fontFamily="monstserrat_bold"
                fontSize="2xl"
                color="#3F6F79"
              >
                {beneficiaryCount <= 0 ? "Attention!" : "Success!"}
              </Text>
              <Divider w="32" bgColor="primary_main" thickness="3" />
            </VStack>
            <Text
              fontFamily="monstserrat_medium"
              color="#0F5F77"
              textAlign="center"
              fontSize="lg"
              px="5"
            >
              {beneficiaryCount <= 0
                ? "You have not added a beneficiary"
                : "Member Registration completed successfully"}
            </Text>
            {beneficiaryCount <= 0 ? (
              <HStack space="2">
                <Button
                  _text={{
                    fontFamily: "monstserrat_bold",
                    fontSize: "sm",
                    color: "section_main",
                  }}
                  onPress={continuePressHandler}
                  bgColor="white"
                  w="32"
                >
                  submit
                </Button>
                <Button
                  _text={{
                    fontFamily: "monstserrat_bold",
                    fontSize: "xs",
                  }}
                  onPress={onToggle}
                  bgColor="primary_main"
                  w="32"
                >
                  Add Beneficiary
                </Button>
              </HStack>
            ) : (
              <Button
                _text={{
                  fontFamily: "monstserrat_bold",
                  fontSize: "xs",
                }}
                onPress={onDismissHandler}
                bgColor="primary_main"
                w="32"
              >
                Dismiss
              </Button>
            )}
          </VStack>
        </Modal>
      </Box>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validationSchema={SECTION_2_FORM_SCHEMA}
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
        }) => (
          <VStack
            px="6"
            w="100%"
            space="3"
            justifyContent="center"
            alignSelf="center"
          >
            <VStack alignItems="center" space="2" justifyContent="center">
              <Text
                fontFamily="monstserrat_bold"
                color="primary_main"
                fontSize="2xl"
                textAlign="center"
              >
                SECTION 3
              </Text>
              <Text
                fontFamily="monstserrat_bold"
                fontSize="lg"
                color="primary_main"
              >
                Beneficiary
              </Text>
            </VStack>
            {/* //!Beneficiary Surname */}
            <FormControl
              isRequired
              isInvalid={errors.BEN_SNAME && touched.BEN_SNAME ? true : false}
            >
              <FormControl.Label>
                <Text fontFamily="monstserrat_bold" fontSize="md">
                  Beneficiary Surname
                </Text>
              </FormControl.Label>
              <Input
                autoFocus={true}
                ref={benSnameRef}
                returnKeyType="next"
                onSubmitEditing={() => benFnameRef?.current?.focus()}
                blurOnSubmit={false}
                maxLength={40}
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderWidth="2"
                borderColor="primary_main"
                value={values.BEN_SNAME}
                onChangeText={handleChange(`BEN_SNAME`)}
                onBlur={handleBlur(`BEN_SNAME`)}
                placeholder="Enter surname"
                rounded="0"
                p="3"
                fontSize="md"
                fontFamily="monstserrat_medium"
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.BEN_SNAME}
              </FormControl.ErrorMessage>
            </FormControl>

            {/* //! Beneficiary First Name */}
            <FormControl
              isRequired
              isInvalid={errors.BEN_FNAME && touched.BEN_FNAME ? true : false}
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Beneficiary First Name
                </Text>
              </FormControl.Label>
              <Input
                ref={benFnameRef}
                returnKeyType="next"
                onSubmitEditing={() => benMnameRef?.current?.focus()}
                blurOnSubmit={false}
                maxLength={40}
                variant="outline"
                borderWidth="2"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                rounded="0"
                value={values.BEN_FNAME}
                onChangeText={handleChange(`BEN_FNAME`)}
                onBlur={handleBlur(`BEN_FNAME`)}
                placeholder="Enter First Name"
                p="3"
                fontSize="md"
                fontFamily="monstserrat_medium"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.BEN_FNAME}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! Beneficiary Middle Name */}
            <FormControl
              isInvalid={errors.BEN_MNAME && touched.BEN_MNAME ? true : false}
            >
              <FormControl.Label>
                <Text fontFamily="monstserrat_bold" fontSize="md">
                  Beneficiary Middle Name
                </Text>
              </FormControl.Label>
              <Input
                ref={benMnameRef}
                returnKeyType="next"
                onSubmitEditing={() => benGenderRef?.current?.focus()}
                blurOnSubmit={false}
                maxLength={40}
                borderWidth="2"
                fontFamily="monstserrat_medium"
                fontSize="md"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.BEN_MNAME}
                onChangeText={handleChange(`BEN_MNAME`)}
                onBlur={handleBlur(`BEN_MNAME`)}
                placeholder="Enter Middle Name"
                rounded="0"
                p="3"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.BEN_MNAME}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //!Beneficiary Gender */}
            <FormControl
              isRequired
              isInvalid={errors.BEN_GENDER && touched.BEN_GENDER ? true : false}
            >
              <FormControl.Label>
                <Text fontSize="sm" fontFamily="monstserrat_bold">
                  Beneficiary Gender
                </Text>
              </FormControl.Label>
              <Box
                borderWidth="2"
                borderColor={
                  errors.BEN_GENDER && touched.BEN_GENDER
                    ? "section_main"
                    : "primary_main"
                }
              >
                <Picker
                  ref={benGenderRef}
                  selectedValue={values.BEN_GENDER}
                  onValueChange={(itemValue) => {
                    handleChange(`BEN_GENDER`)(itemValue);
                  }}
                >
                  <Picker.Item
                    label="Select Beneficiary Gender "
                    value="Select Beneficiary Gender"
                  />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </Box>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.BEN_GENDER}
              </FormControl.ErrorMessage>
            </FormControl>

            {/* //! date of birth from picker  */}
            <FormControl isRequired>
              <VStack>
                <FormControl.Label>
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Date of Birth
                  </Text>
                </FormControl.Label>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', }}>
                <Button title={'open'} style={{backgroundColor: '#432344', borderRadius: 10}} onPress={openDatePicker}>Pick a date</Button>
                 <DatePicker
                  isVisible={showDatePicker}
                  mode={'single'}
                  value={values.BEN_DOB}
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  onChange={() => {
                    handleChange("BEN_DOB");
                  }}
                   />
                 </View>    
              </VStack>
            </FormControl>
            {/* //! Beneficiary Relationship */}
            <FormControl
              isRequired
              isInvalid={errors.BEN_REL && touched.BEN_REL ? true : false}
            >
              <FormControl.Label>
                <Text fontFamily="monstserrat_bold" fontSize="md">
                  Beneficiary Relationship
                </Text>
              </FormControl.Label>
              <Box
                borderColor={
                  errors.BEN_REL && touched.BEN_REL
                    ? "section_main"
                    : "primary_main"
                }
                borderWidth="2"
              >
                <Picker
                  ref={benRelRef}
                  placeholder="Select Relationship"
                  selectedValue={values.BEN_REL}
                  onValueChange={(itemValue) => {
                    handleChange(`BEN_REL`)(itemValue);
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
                {errors.BEN_REL}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! Beneficiary: Phone 1 */}
            <FormControl
              isRequired
              isInvalid={
                errors.BEN_TEL_NO1 && touched.BEN_TEL_NO1 ? true : false
              }
            >
              <FormControl.Label>
                <Text fontFamily="monstserrat_bold" fontSize="md">
                  Beneficiary: Phone 1
                </Text>
              </FormControl.Label>
              <Input
                ref={benTelNo1Ref}
                returnKeyType="next"
                onSubmitEditing={() => benTelNo2Ref?.current?.focus()}
                blurOnSubmit={false}
                maxLength={15}
                fontFamily="monstserrat_medium"
                fontSize="md"
                borderWidth="2"
                keyboardType="numeric"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.BEN_TEL_NO1}
                onChangeText={handleChange(`BEN_TEL_NO1`)}
                onBlur={handleBlur(`BEN_TEL_NO1`)}
                placeholder="0000-000-0000"
                rounded="0"
                p="3"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.BEN_TEL_NO1}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! Beneficiary: Phone 2 */}
            <FormControl
              isInvalid={
                errors.BEN_TEL_NO2 && touched.BEN_TEL_NO2 ? true : false
              }
            >
              <FormControl.Label>
                <Text fontFamily="monstserrat_bold" fontSize="md">
                  Beneficiary: Phone 2
                </Text>
              </FormControl.Label>
              <Input
                ref={benTelNo2Ref}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
                maxLength={15}
                borderWidth="2"
                fontFamily="monstserrat_medium"
                keyboardType="numeric"
                variant="outline"
                _focus={{
                  borderColor: "section_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.BEN_TEL_NO2}
                onChangeText={handleChange(`BEN_TEL_NO2`)}
                onBlur={handleBlur(`BEN_TEL_NO2`)}
                placeholder="0000-000-0000"
                rounded="0"
                p="3"
                fontSize="md"
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.BEN_TEL_NO2}
              </FormControl.ErrorMessage>
            </FormControl>
            <Box justifyContent="center" alignItems="flex-end">
              <TouchableOpacity
                style={styles.addBeneficiaryContainer}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text
                  fontSize="md"
                  fontFamily="monstserrat_bold"
                  color="section_main"
                >
                  Add Beneficiary ({beneficiaryCount})
                </Text>
              </TouchableOpacity>
            </Box>

            <Box justifyContent="center" alignItems="center">
              <SubmitButton
                isLoading={
                  saveBeneficiaryResponse.status === "pending" || isSubmitting
                    ? true
                    : false
                }
                w={!appIsOnline ? "38%" : "35%"}
                alignSelf="center"
                onPress={nextPressHandler}
              >
                <HStack justifyContent="center" alignItems="center" space="4">
                  <Text
                    color="white"
                    fontSize="md"
                    fontFamily="monstserrat_bold"
                    textAlign="center"
                  >
                    {!appIsOnline ? "Export CSV" : "submit"}
                  </Text>
                </HStack>
              </SubmitButton>
            </Box>
          </VStack>
        )}
      </Formik>
    </ScrollView>
  );
};
