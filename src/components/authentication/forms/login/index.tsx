import React, {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Button,
  Icon,
  Input,
  VStack,
  Text,
  FormControl,
  WarningOutlineIcon,
  ScrollView,
  Box,
  useDisclose,
  HStack,
  IPinInputFieldProps,
  IInputProps,
} from "native-base";
import { Octicons, Feather } from "@expo/vector-icons";
import {
  AuthCredentials,
  LoginFormType,
  LoginScreenProps,
  RootNavigatorParamsList,
} from "../../../../global/types";
import { styles } from "./style";
import { Keyboard, Linking, TextInput, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { LOGIN_SCHEMA } from "../../../../global/schemas";
import NetInfo from "@react-native-community/netinfo";
import {
  authenticate,
  setAppIsOnline,
  setOfflineAgent,
  setOnlineAgent,
  setRememberMe,
} from "../../../../features/auth/authSlice";
import Modal from "react-native-modal";
import { SubmitButton } from "../../../common/global";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { UserContext } from "../../../../utils/userContext";
import { StringSchema } from "yup";
import { useFocusEffect } from "@react-navigation/native";
import {
  SQLError,
  SQLResultSet,
  SQLTransaction,
  WebSQLDatabase,
} from "expo-sqlite";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";
import {
  errorConfig,
  infoConfig,
  successConfig,
} from "../../../../utils/constants";
import { natamorasDB, sleep } from "../../../../utils/helpers";
import _ from "lodash";

const LoginForm: FC<LoginScreenProps> = ({ navigation }) => {
  const {
    rememberMe,
    authenticateResponse,
    appIsOnline,
    onlineAgent,
    offlineAgent,
  } = useAppSelector((state) => state.auth);
  const { status } = authenticateResponse;
  const dispatch = useAppDispatch();
  const { isOpen, onToggle } = useDisclose();
  const [show, setShow] = React.useState<boolean>(false);
  const [showNetStatModal, setShowNetStatModal] =
    React.useState<boolean>(false);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const createAgentTable = (table_name: string) => {
    natamorasDB.transaction((txn) => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS ${table_name} (id INTEGER PRIMARY KEY,username TEXT,password TEXT);`,
        [],
        (txn: SQLTransaction, ResultSet: SQLResultSet) => {
          console.log(`${table_name} table created successfully`);
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error.message);
          return true;
        }
      );
    });
  };

  const insertIntoAgentTable = (
    values: LoginFormType,
    table_name: string
  ): void => {
    natamorasDB.transaction((txn: SQLTransaction) => {
      txn.executeSql(
        `INSERT OR REPLACE INTO ${table_name} (id, username, password) VALUES (1,?,?);`,
        [values.username, values.password],
        (txn: SQLTransaction, ResultSet: SQLResultSet) => {
          console.log(`inserted into ${table_name} successfully`);
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const authCheck = (): void => {
    if (onlineAgent === undefined) {
      showMessage({
        ...errorConfig,
        description: "login at least once with internet access",
        position: "center",
      });
      console.log("is the same agent : ", _.isEqual(onlineAgent, offlineAgent));
    } else if (_.isEqual(onlineAgent, offlineAgent)) {
      console.log("is the same agent : ", _.isEqual(onlineAgent, offlineAgent));
      showMessage({
        ...infoConfig,
        description: "Offline : Login successful",
      });
      navigation.navigate("section-stack", {
        screen: "section-screen-1",
      });
    } else {
      return;
    }
  };

  const getAgentTable = (table_name: string): void => {
    natamorasDB.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM ${table_name};`,
        [],
        (txn: SQLTransaction, { rows }: SQLResultSet) => {
          const rowData = rows._array;
          console.log(`${table_name} fetched successfully`);
          if (table_name === "online_agent") {
            dispatch(setOnlineAgent(rowData));
          } else if (table_name === "offline_agent") {
            dispatch(setOfflineAgent(rowData));
            authCheck();
          } else {
            return;
          }
        },
        (txn: SQLTransaction, error: SQLError) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const onSubmitHandler = async (
    values: LoginFormType,
    setSubmitting: (isSubmitting: boolean) => void
  ): Promise<void> => {
    try {
      if (appIsOnline) {
        await dispatch(
          authenticate({
            username: values.username.trim(),
            password: values.password.trim(),
          })
        ).unwrap();
        insertIntoAgentTable(
          {
            username: values.username.trim(),
            password: values.password.trim(),
          },
          "online_agent"
        );
        getAgentTable("online_agent");
        navigation.navigate("section-stack", {
          screen: "section-screen-1",
        });
      } else if (!appIsOnline) {
        await sleep(500);
        insertIntoAgentTable(
          {
            username: values.username.trim(),
            password: values.password.trim(),
          },
          "offline_agent"
        );
        getAgentTable("offline_agent");

        setSubmitting(false);
      } else {
        return;
      }
    } catch (error) {}
  };

  const InitialValues: LoginFormType = {
    username: "",
    password: "",
  };

  //7yX637392XXjuw0Q1 password

  const onSendMailHandler = (): void => {
    Linking.openURL("mailto:admin@Kalyaanwelfare.com?subject=Forgot Password");
  };

  useFocusEffect(
    useCallback(() => {
      NetInfo.fetch()
        .then((state) => {
          console.log({
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
          });
          dispatch(setAppIsOnline(state.isConnected));
          if (state.isConnected) {
            setShowNetStatModal(false);
            createAgentTable("online_agent");
          } else if (state.isConnected === false) {
            setShowNetStatModal(true);
            createAgentTable("offline_agent");
            getAgentTable("online_agent");
          } else {
            return;
          }
        })
        .catch((error) => console.log(error.message));
    }, [])
  );

  return (
    <Fragment>
      <Box>
        <Modal
          animationIn="zoomInUp"
          animationOut="zoomOutDown"
          isVisible={showNetStatModal}
        >
          <VStack
            space="3"
            p="3"
            bgColor="white"
            alignSelf="center"
            justifyContent="center"
            alignItems="center"
            w="56"
            rounded="lg"
          >
            <Box size="32">
              <LottieView
                style={{
                  height: "100%",
                  width: "100%",
                }}
                autoPlay={true}
                loop={true}
                source={require("../../../../assets/animations/no_internet.json")}
              />
            </Box>
            <Text fontFamily="monstserrat_bold" fontSize="lg">
              Offline
            </Text>
            <Text
              textAlign="center"
              fontFamily="monstserrat_medium"
              fontSize="md"
            >
              Switching to offline module
            </Text>
            <Button
              onPress={() => {
                setShowNetStatModal(false);
                usernameRef?.current?.focus();
              }}
              _text={{
                fontFamily: "monstserrat_bold",
              }}
              bgColor="primary_main"
            >
              Continue
            </Button>
          </VStack>
        </Modal>
      </Box>
      <Box>
        <Modal
          isVisible={isOpen}
          onBackdropPress={onToggle}
          onBackButtonPress={onToggle}
          animationIn="zoomInUp"
          animationOut="zoomOutDown"
          backdropTransitionOutTiming={800}
        >
          <VStack
            p="4"
            space="5"
            justifyContent="center"
            alignItems="center"
            bgColor="white"
            rounded="lg"
          >
            <Text fontFamily="monstserrat_bold" fontSize="lg">
              Contact Admin
            </Text>
            <VStack justifyContent="center" alignItems="center" space="2">
              <Text fontFamily="monstserrat_bold">Email:</Text>
              <Text fontFamily="monstserrat_medium">
                admin@Kalyaanwelfare.com
              </Text>
            </VStack>
            <HStack space="4">
              <Button onPress={onSendMailHandler} bgColor="primary_main">
                send email
              </Button>
              <Button onPress={onToggle} bgColor="red.500">
                cancel
              </Button>
            </HStack>
          </VStack>
        </Modal>
      </Box>
      <Formik
        validateOnMount={true}
        validateOnChange={true}
        validationSchema={LOGIN_SCHEMA}
        validateOnBlur={false}
        initialValues={InitialValues}
        onSubmit={(values, { setSubmitting }) =>
          onSubmitHandler(values, setSubmitting)
        }
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          errors,
          values,
          isSubmitting,
        }) => (
          <ScrollView contentContainerStyle={styles.container}>
            <VStack
              w="100%"
              space="4"
              flex="1"
              alignItems="center"
              pt="2"
              safeAreaTop
              bgColor="white"
            >
              <VStack space="5">
                <Avatar
                  source={require("../../../../assets/natomoras.jpeg")}
                  h="64"
                  w="64"
                >
                  LOGO
                </Avatar>
                <VStack justifyContent="center" alignItems="center">
                  <Text fontFamily="monstserrat_bold" fontSize="xl">
                    AGENT LOGIN
                  </Text>
                  <Text fontFamily="monstserrat_medium" fontSize="xl">
                    Data Capture Form
                  </Text>
                </VStack>
              </VStack>
              <VStack space="5">
                {/* //! email */}
                <FormControl
                  isInvalid={touched.username && errors.username ? true : false}
                >
                  <Input
                    ref={usernameRef}
                    onSubmitEditing={() => passwordRef?.current?.focus()}
                    autoFocus={true}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    _focus={{
                      borderColor: "input_secondary",
                      bgColor: "white",
                    }}
                    rounded="0"
                    bgColor="white"
                    borderColor="muted.400"
                    borderWidth="2"
                    variant="filled"
                    fontFamily="monstserrat_medium"
                    fontSize="md"
                    w={{
                      base: "75%",
                      md: "25%",
                    }}
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    InputLeftElement={
                      <Icon
                        as={Octicons}
                        name="person"
                        size={6}
                        ml="2"
                        color="muted.400"
                      />
                    }
                    placeholder="username"
                  />

                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.username}
                  </FormControl.ErrorMessage>
                  {/* //! password */}
                </FormControl>
                <FormControl
                  isInvalid={touched.password && errors.password ? true : false}
                >
                  <Input
                    ref={passwordRef}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                      handleSubmit();
                    }}
                    _focus={{
                      borderColor: "input_secondary",
                      bgColor: "white",
                    }}
                    rounded="0"
                    bgColor="white"
                    borderColor="muted.400"
                    borderWidth="2"
                    value={values.password}
                    onBlur={handleBlur("password")}
                    onChangeText={handleChange("password")}
                    variant="filled"
                    fontFamily="monstserrat_medium"
                    fontSize="md"
                    w={{
                      base: "75%",
                      md: "25%",
                    }}
                    type={show ? "text" : "password"}
                    InputRightElement={
                      <Icon
                        as={Feather}
                        name={show ? "eye" : "eye-off"}
                        size={5}
                        mr="2"
                        color="muted.400"
                        onPress={() => setShow(!show)}
                      />
                    }
                    placeholder="Password"
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.password}
                  </FormControl.ErrorMessage>
                </FormControl>
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" justifyContent="center">
                    <BouncyCheckbox
                      size={23}
                      fillColor="#432344"
                      iconStyle={{
                        borderWidth: 1,
                        borderRadius: 0,
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        marginRight: -8,
                      }}
                      isChecked={rememberMe}
                      unfillColor="#D9D9D9"
                      onPress={() => {
                        dispatch(setRememberMe(!rememberMe));
                      }}
                    />
                    <Text
                      fontSize="xs"
                      alignSelf="center"
                      fontFamily="monstserrat_bold"
                    >
                      Remember me
                    </Text>
                  </HStack>

                  <TouchableOpacity
                    onPress={onToggle}
                    style={styles.forgotPasswordContainer}
                  >
                    <Text
                      color="primary_main"
                      fontSize="xs"
                      fontFamily="monstserrat_bold"
                    >
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
              <SubmitButton
                w="75%"
                isLoading={status === "pending" || isSubmitting ? true : false}
                onPress={handleSubmit}
              >
                Login
              </SubmitButton>
            </VStack>
          </ScrollView>
        )}
      </Formik>
    </Fragment>
  );
};

export default LoginForm;
