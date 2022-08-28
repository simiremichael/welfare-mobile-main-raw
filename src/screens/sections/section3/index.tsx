import React, { useState, FC, useContext, useEffect } from "react";
import { Section3Form } from "../../../components/forms/section3";
import {
  Text,
  VStack,
  Box,
  HStack,
  Button,
  Image,
  ScrollView,
  IconButton,
  Icon,
  useDisclose,
  Divider,
} from "native-base";
import LogoHeader from "../../../components/common/sectionHeders";
import { MaterialIcons } from "@expo/vector-icons";
import SectionFooter from "../../../components/common/sectionFooter";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Section3ScreenProps } from "../../../global/types";
import { showMessage } from "react-native-flash-message";
import { errorConfig, successConfig } from "../../../utils/constants";
import { BottomLogo } from "../../../components/common/global";
import { UserContext } from "../../../utils/userContext";
import * as SQLite from "expo-sqlite";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  memberNotReady,
  saveMember,
} from "../../../features/member/memberSlice";
import Modal from "react-native-modal";
import { benNotReady } from "../../../features/beneficiary/beneficiarySlice";
import { NOKNotReady } from "../../../features/NOK/nextOfKinSlice";
import { is } from "immer/dist/internal";
export const Section3Screen: FC<Section3ScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { saveMemberResponse, membersGoodToGo } = useAppSelector(
    (state) => state.member
  );
  const { benGoodToGo, saveBeneficiaryResponse } = useAppSelector(
    (state) => state.beneficiary
  );
  const { NOKGoodToGo, saveNextOfKinResponse } = useAppSelector(
    (state) => state.nextOfKin
  );
  const memberStatus: string | undefined = saveMemberResponse?.status;
  const BenStatus: string | undefined = saveBeneficiaryResponse?.status;
  const NOKStatus: string | undefined = saveNextOfKinResponse?.status;
  const [hasPickedImage, setHasPickedImage] = useState(false);
  const [items, setItems] = useState();
  const { isOpen, onToggle } = useDisclose();
  const [finalSubmitError, setFinalSubmitError] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  let bouncyCheckboxRef: BouncyCheckbox | null = null;
  const [checkboxState, setCheckboxState] = useState<boolean>(false);

  const IsLoading = (): boolean => {
    if (memberStatus === "pending" || NOKStatus === "pending") {
      return true;
    } else {
      return false;
    }
  };

  const onSubmitHandler = (): void => {
    console.log({
      benGoodToGo,
      membersGoodToGo,
      NOKGoodToGo,
      isChecked,
      hasPickedImage,
    });
    onToggle();
  };

  const alertBtnHandler = (): void => {
    if (!hasPickedImage && !isChecked) {
      onToggle();
      // postDataLocal();
    } else if (!isChecked && hasPickedImage) {
      onToggle();
      bouncyCheckboxRef.onPress();
    } else if (NOKGoodToGo || membersGoodToGo) {
      dispatch(benNotReady());
      dispatch(memberNotReady());
      dispatch(NOKNotReady());
      onToggle();
      navigation.navigate("section-screen-1");
    } else if (!NOKGoodToGo || !membersGoodToGo) {
      dispatch(benNotReady());
      dispatch(memberNotReady());
      dispatch(NOKNotReady());
      onToggle();
      navigation.navigate("section-screen-1");
    } else if (!hasPickedImage) {
      onToggle();
    }
  };

  return (
    <ScrollView bgColor="white">
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
            justifyContent="space-between"
            alignItems="center"
            bgColor={
              !hasPickedImage && !membersGoodToGo
                ? "#C4E8EF"
                : !NOKGoodToGo || !membersGoodToGo
                ? "#EBCCCF"
                : !isChecked
                ? "#C4E8EF"
                : "#C6DBD2"
            }
            w="64"
            h="72"
            pb="5"
          >
            <VStack p="5" w="100%" justifyContent="center" alignItems="center">
              <Text
                fontFamily="monstserrat_bold"
                fontSize="2xl"
                color={
                  !hasPickedImage && !membersGoodToGo
                    ? "#3F6F79"
                    : !NOKGoodToGo || !membersGoodToGo
                    ? "#96363B"
                    : !isChecked
                    ? "#3F6F79"
                    : "#346C61"
                }
              >
                {!hasPickedImage && !membersGoodToGo
                  ? "Attention"
                  : !NOKGoodToGo || !membersGoodToGo
                  ? "Error!"
                  : !isChecked
                  ? "Attention"
                  : "Success!"}
              </Text>
              <Divider w="32" bgColor="primary_main" thickness="3" />
            </VStack>
            <Text
              fontFamily="monstserrat_medium"
              color={
                !hasPickedImage && !membersGoodToGo
                  ? "#0F5F77"
                  : !NOKGoodToGo || !membersGoodToGo
                  ? "#96363B"
                  : !isChecked
                  ? "#0F5F77"
                  : "#346C61"
              }
              textAlign="center"
              fontSize="lg"
              px="5"
            >
              {!hasPickedImage && !membersGoodToGo
                ? "Please upload a picture to continue"
                : !NOKGoodToGo || !membersGoodToGo
                ? "Registration failed please try again"
                : !isChecked
                ? "Please accept terms and conditions to continue"
                : `Member Registration successful{"\n"}MemberId: ${saveMemberResponse?.success?.mbrno}`}
            </Text>
            <Button
              _text={{
                fontFamily: "monstserrat_bold",
                fontSize: "lg",
              }}
              rounded="lg"
              onPress={alertBtnHandler}
              bgColor="primary_main"
              w="50%"
            >
              {!NOKGoodToGo || !membersGoodToGo
                ? "Retry"
                : !isChecked
                ? "Accept"
                : !hasPickedImage
                ? "close"
                : "Continue"}
            </Button>
          </VStack>
        </Modal>
      </Box>
      <VStack px="5" pb="10" bgColor="white" safeAreaTop space="5">
        <LogoHeader />
        <Text
          fontFamily="monstserrat_bold"
          color="primary_main"
          fontSize="lg"
          textAlign="center"
        >
          SECTION 3
        </Text>
        <Section3Form
          setHasPickedImage={setHasPickedImage}
          navigation={navigation}
        />
        <HStack
          alignItems="flex-start"
          justifyContent="center"
          alignSelf="center"
          w="82%"
        >
           {/*
          <BouncyCheckbox
            size={23}
            fillColor="#432344"
            style={{ marginTop: 20 }}
            ref={(ref: any) => (bouncyCheckboxRef = ref)}
            isChecked={checkboxState}
            unfillColor="#FFFFFF"
            onPress={() => {
              setIsChecked(!isChecked);
            }}
          />
         
          <Text alignSelf="center" fontFamily="monstserrat_medium">
            I attest, to the best of my knowledge and belief, that all
            information provided in this form is true and accurate at this point
            in time and that the picture contained herein is a true and accurate
            representation of my person.
          </Text>
          */}
        </HStack>
        <Button
          justifyContent="center"
          alignItems="center"
          isLoadingText="Loading.."
          isLoading={IsLoading()}
          onPress={onSubmitHandler}
          bgColor="primary_main"
          alignSelf="flex-end"
          mr="3"
          _text={{
            fontFamily: "monstserrat_medium",
          }}
        >
          Submit
        </Button>
        <SectionFooter />
        <BottomLogo />
      </VStack>
    </ScrollView>
  );
};
