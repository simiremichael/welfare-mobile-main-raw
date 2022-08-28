import {
  Avatar,
  HStack,
  Icon,
  VStack,
  Text,
  Button,
  Box,
  useDisclose,
} from "native-base";
import React, { FC, useContext, useState, useRef } from "react";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../../../utils/userContext";
import { PermissionsAndroid, Platform, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  saveMember,
  saveMemberToStore,
} from "../../../features/member/memberSlice";
import axios from "axios";
import { fetchMemberId, fetchToken } from "../../../utils/helpers";
import { saveNextOfKin } from "../../../features/NOK/nextOfKinSlice";
import { saveBeneficiary } from "../../../features/beneficiary/beneficiarySlice";
import Modal from "react-native-modal";
import * as ImageManipulator from "expo-image-manipulator";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Svg from "react-native-svg";
import { flexbox } from "native-base/lib/typescript/theme/styled-system";

export const Section3Form: FC<any> = ({ navigation,
  setHasPickedImage,
  setImage,
  image,
}) => {
  const { onToggle, isOpen } = useDisclose();
  const dispatch = useAppDispatch();
  const { memberInStore } = useAppSelector((state) => state.member);
  const { benInStore } = useAppSelector((state) => state.beneficiary);
 const [checkboxState, setCheckboxState] = useState<boolean>(false);
  const [kdppIsChecked, setKdppIsChecked] = useState<boolean>(false);
 const [show, setShow] = useState(false);
  const resizeImage = async (raw_image): Promise<void> => {
    const result = await ImageManipulator.manipulateAsync(
      raw_image.localUri || raw_image.uri,
      [
        {
          resize: {
            width: raw_image.width * 0.5,
            height: raw_image.height * 0.5,
          },
        },
      ],
      { compress: 0, format: ImageManipulator.SaveFormat.JPEG }
    );
    console.log(" result: ", result);
  };

  const pickImage = async (): Promise<void> => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
      setHasPickedImage(true);
    }
  };
  let bouncyCheckboxRef = useRef<BouncyCheckbox>();
  let kdppRef = useRef<BouncyCheckbox>(null);

  const alertBtnHandler = (): void => {
    onToggle();
    if (!checkboxState) {
      bouncyCheckboxRef?.current?.onPress();
    }
    if (!kdppIsChecked) {
      kdppRef?.current?.onPress();
    }
  };
  console.log(image)

  const [more, setMore] = useState(false);

  return (
    <View>
   
    <VStack
      p="2"
      space="5"
      alignSelf="center"
      w="90%"
      rounded="lg"
      borderColor="gray.300"
      borderWidth="1"
    >
      <Text fontFamily="monstserrat_medium">Upload passport</Text>
      <HStack space="3">
        <Avatar
          size="2xl"
          source={
            image === !null 
              ? { uri: image.uri }
              : require("../../../assets/blank_avater.jpg")
          }
        >
          LOGO
        </Avatar>
        <VStack 
          w="50%"
          space="3"
          borderColor="gray.300"
          borderStyle="dashed"
          borderWidth="1"
          rounded="lg"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={Feather} name="camera" size="md" color="primary_main" />
          <Text fontFamily="monstserrat_medium">Tap below</Text>
          <Button
            justifyContent="center"
            alignItems="center"
            onPress={(): Promise<void> => pickImage()}
            bgColor="primary_main"
            alignSelf="center"
            w="90%"
            _text={{
              fontFamily: "monstserrat_medium",
              fontSize: "xs",
            }}
          >
            open camera
          </Button>
        </VStack>
      </HStack>
    </VStack>
          
   
            <HStack style={{marginTop: 30}}
              alignItems="flex-start"
              justifyContent="flex-end"
              alignSelf="flex-end"
              w="82%"
            >
              <BouncyCheckbox
                size={23}
                fillColor="#432344"
                style={{ marginTop: 20 }}
                ref={bouncyCheckboxRef}
                isChecked={checkboxState}
                unfillColor="#FFFFFF"
                onPress={() => {
                  setCheckboxState(!checkboxState);
                }}
              />
              <Text fontFamily="monstserrat_medium">
              I attest to the best of my knowledge and belief, that all the information provided in this data capture form is true and accurate at this point in time, and that the picture contained herein, is a true and accurate representation of my person; I further acknowledge that should any pertinent information contained herein be found to be gravely false, untrue and inaccurate, I will be expelled from the National Commercial Tricycle Motorcycle Owners and Riders Association of Nigeria, all my benefits from the Association's welfare schemes will terminate, and should the situation necessitate, I will be handed over to the relevant vehicle supervisory authorities, the appropriate security agencies or the immigration service of the Federal Republic of Nigeria
              </Text>
            </HStack>
            
            <HStack style={{marginTop: 15, display: 'flex', flexDirection:'column'}}
              alignItems="flex-start"
              justifyContent="flex-end"
              alignSelf="flex-end"
              w="82%"
            >
              <BouncyCheckbox
                size={23}
                fillColor="#432344"
                style={{ marginTop: 20 }}
                ref={bouncyCheckboxRef}
                isChecked={checkboxState}
                unfillColor="#FFFFFF"
                onPress={() => {
                  setCheckboxState(!checkboxState);
                }}
              />
              <Text fontFamily="monstserrat_medium">
              not to be involved in any criminal acts against any individual or acts that are intended or calculated to provoke a state of terror in the general public, a group of persons or particular persons for considerations that are of a political, philosophical, ideological, racial, ethnic, religious or other nature whatsoever; 
         { more && ( <> not to be involved in any acts of terrorism, acts of violence, banditry, brigandry, kidnapping or any acts of violence that threatens or causes death or bodily injury to any person or damage to public or private property or that results or is likely to result in economic loss for any reason whatsoever; 
        not to be involved knowingly or unknowingly in any acts that threatens the dignity and security of human beings anywhere, that endangers or takes innocent lives through links with transnational organised crime, drug trafficking, money-laundering and trafficking in small arms and light weapons and is linked to the consequent commission of serious crimes such as murder, extortion, kidnapping, assault, hostage-taking and robbery; 
       I accept that should I be found to be involved in any of the aforementioned acts, my membership of NATOMORAS will immediately terminate by expulsion from NATOMORAS, my benefits under any and all welfare schemes for myself and my family will immediately terminate and that members of NATOMORAS will forthwith hand me over to the appropriate government security and law enforcement agencies to allow the rule of law take its natural cause.
       </> )}
              </Text>
             
              <Button  style={{backgroundColor: '#432344', alignSelf: 'flex-end', width: 70, padding: 0, height: 40, borderRadius: 10}} onPress={() => setMore(true)}> more </Button>
            </HStack>
            <HStack style={{marginTop: 15}}
              alignItems="flex-start"
              justifyContent="flex-end"
              alignSelf="flex-end"
              w="82%"
            >
              <BouncyCheckbox
                size={23}
                fillColor="#432344"
                style={{ marginTop: 20 }}
                isChecked={kdppIsChecked}
                ref={kdppRef}
                unfillColor="#FFFFFF"
                onPress={() => {
                  setKdppIsChecked(!kdppIsChecked);
                }}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("kalyan-dpp")}
              >
                <Text
                  textDecorationLine="underline"
                  fontFamily="monstserrat_medium"
                  color="blue.400"
                >
                  I accept the kalyaan welfare consulting data protection policy
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
              Accept
            </Button>
              </TouchableOpacity>
            </HStack>
            </View>
  );
};
