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
} from "native-base";

import { Formik } from "formik";
import moment from "moment";

import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./style";
import { Section1FormType, Section1ScreenProps } from "../../../global/types";
import { SECTION_1_FORM_SCHEMA } from "../../../global/schemas";
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
import { UserContext } from "../../../utils/userContext";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import DatePicker from 'react-native-neat-date-picker';
import {
  saveMember,
  saveMemberToStore,
} from "../../../features/member/memberSlice";
import { Picker } from "@react-native-picker/picker";
//import DatePicker from "react-native-date-picker";
import { Keyboard, TextInput, View } from "react-native";
import { SQLError, SQLTransaction } from "expo-sqlite";

export const Section1Form: FC<Section1ScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { appIsOnline } = useAppSelector((state) => state.auth);
  const InitialValues: Section1FormType = {
    MBRSNAME: "",
    MBRFNAME: "",
    middleName: "",
    MBR_DOB: new Date(),
    MBR_GENDER: "",
    MBR_TEL_NO1: "",
    MBR_TEL_NO2: "",
  };

  const mbrSnameRef = useRef<TextInput>(null);
  const mbrFnameRef = useRef<TextInput>(null);
  const mbrMnameRef = useRef<TextInput>(null);
  const mbrGenderRef = useRef<Picker>(null);
  const mbrTell1Ref = useRef<TextInput>(null);
  const mbrTell2Ref = useRef<TextInput>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    mbrSnameRef?.current?.focus();
    const timeoutID = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    return () => clearTimeout(timeoutID);
  }, []);

  const onSubmitHandler = async (
    values: Section1FormType,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void
  ): Promise<void> => {
    await sleep(500);
    dispatch(
      saveMemberToStore({
        MBR_WELFARE_PKG: "s".trim(),
        MBRSNAME: values.MBRSNAME.trim(),
        MBRFNAME: `${values.MBRFNAME} ${values.middleName}`.trim(),
        MBR_STATUS: "alive".trim(),
        MBR_DOB: moment(values.MBR_DOB).format("YYYY-MM-DD").trim(),
        MBR_GENDER: values.MBR_GENDER.trim(),
        MBR_TEL_NO1: values.MBR_TEL_NO1.trim(),
        MBR_TEL_NO2: values.MBR_TEL_NO2.trim(),
      })
    );
    !appIsOnline
      ? showMessage({
          ...infoConfig,
          description: "member data stored locally",
        })
      : null;
    setSubmitting(false);
    navigation.navigate("section-screen-1b");
    resetForm();
  };

  const [open, setOpen] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

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
      <Formik
        validateOnBlur={false}
        validateOnChange={true}
        validationSchema={SECTION_1_FORM_SCHEMA}
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
          setSubmitting,
          isSubmitting,
        }) => (
          <VStack w="86%" space="4" justifyContent="center">
            {/* //! surname */}
            <FormControl
              isRequired
              isInvalid={touched.MBRSNAME && errors.MBRSNAME ? true : false}
            >
              <FormControl.Label>
                <Text fontSize="sm" fontFamily="monstserrat_bold">
                  Surname
                </Text>
              </FormControl.Label>
              <Input
                autoFocus={true}
                ref={mbrSnameRef}
                onSubmitEditing={() => {
                  mbrFnameRef?.current?.focus();
                }}
                blurOnSubmit={false}
                maxLength={40}
                returnKeyType="next"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                variant="outline"
                value={values.MBRSNAME}
                onChangeText={handleChange("MBRSNAME")}
                onBlur={handleBlur("MBRSNAME")}
                placeholder="Enter surname"
                rounded="0"
                p="3"
                fontSize="md"
                borderWidth="2"
                fontFamily="monstserrat_medium"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBRSNAME}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! First Name */}
            <FormControl
              isRequired
              isInvalid={touched.MBRFNAME && errors.MBRFNAME ? true : false}
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  First Name
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrFnameRef}
                returnKeyType="next"
                onSubmitEditing={() => {
                  mbrMnameRef?.current?.focus();
                }}
                blurOnSubmit={false}
                maxLength={40}
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.MBRFNAME}
                onChangeText={handleChange("MBRFNAME")}
                onBlur={handleBlur("MBRFNAME")}
                placeholder="Enter First Name"
                rounded="0"
                p="3"
                fontSize="md"
                fontFamily="monstserrat_medium"
                borderWidth="2"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBRFNAME}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* //! middle Name */}
            <FormControl
              isInvalid={touched.middleName && errors.middleName ? true : false}
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Middle Name
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrMnameRef}
                returnKeyType="next"
                onSubmitEditing={() => mbrGenderRef?.current?.focus()}
                blurOnSubmit={false}
                maxLength={40}
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                value={values.middleName}
                onChangeText={handleChange("middleName")}
                onBlur={handleBlur("middleName")}
                placeholder="Enter First Name"
                rounded="0"
                p="3"
                fontFamily="monstserrat_medium"
                fontSize="md"
                borderWidth="2"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.middleName}
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
                  value={values. MBR_DOB}
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  onChange={() => {
                    handleChange(" MBR_DOB");
                  }}
                   />
                 </View>    
              </VStack>
            </FormControl>
           
            {/* //! Gender */}
            <FormControl
              isRequired
              isInvalid={touched.MBR_GENDER && errors.MBR_GENDER ? true : false}
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Gender
                </Text>
              </FormControl.Label>
              <Box
                borderWidth="2"
                rounded="0"
                borderColor={
                  touched.MBR_GENDER && errors.MBR_GENDER
                    ? "section_main"
                    : "primary_main"
                }
              >
                <Picker
                  ref={mbrGenderRef}
                  selectedValue={values.MBR_GENDER}
                  onValueChange={(itemValue) => {
                    handleChange("MBR_GENDER")(itemValue);

                    if (isLoaded) {
                      mbrTell1Ref?.current?.focus();
                    }
                  }}
                >
                  <Picker.Item label="Select Gender" value="Select Gender" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </Picker>
              </Box>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_GENDER}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                touched.MBR_TEL_NO1 && errors.MBR_TEL_NO1 ? true : false
              }
            >
              <FormControl.Label>
                <Text fontSize="md" fontFamily="monstserrat_bold">
                  Phone Number 1
                </Text>
              </FormControl.Label>
              <Input
                ref={mbrTell1Ref}
                returnKeyType="next"
                onSubmitEditing={() => mbrTell2Ref?.current?.focus()}
                blurOnSubmit={false}
                maxLength={15}
                fontSize="md"
                fontFamily="monstserrat_medium"
                value={values.MBR_TEL_NO1}
                keyboardType="numeric"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                onChangeText={handleChange("MBR_TEL_NO1")}
                onBlur={handleBlur("MBR_TEL_NO1")}
                placeholder="0000-000-0000"
                rounded="0"
                p="3"
                borderWidth="2"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_TEL_NO1}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                touched.MBR_TEL_NO2 && errors.MBR_TEL_NO2 ? true : false
              }
              mb="4"
            >
              <FormControl.Label>
                <HStack space="2">
                  <Text fontSize="md" fontFamily="monstserrat_bold">
                    Phone Number 2
                  </Text>
                  {/* <Text>(Optional)</Text> */}
                </HStack>
              </FormControl.Label>
              <Input
                returnKeyType="done"
                ref={mbrTell2Ref}
                onSubmitEditing={() => Keyboard.dismiss()}
                maxLength={15}
                value={values.MBR_TEL_NO2}
                keyboardType="numeric"
                variant="outline"
                _focus={{
                  borderColor: "input_secondary",
                  bgColor: "white",
                }}
                borderColor="primary_main"
                onChangeText={handleChange("MBR_TEL_NO2")}
                onBlur={handleBlur("MBR_TEL_NO2")}
                placeholder="0000-000-0000"
                rounded="0"
                borderWidth="2"
                p="3"
                fontSize="md"
                fontFamily="monstserrat_medium"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.MBR_TEL_NO2}
              </FormControl.ErrorMessage>
            </FormControl>
            <SubmitButton
              isLoading={isSubmitting}
              w="36%"
              alignSelf="center"
              onPress={() => {
                handleSubmit();
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
