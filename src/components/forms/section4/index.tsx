import React, { FC, useRef, useState } from 'react';
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
  View,
  Select,
  FlatList,
  CheckIcon,
  Box,
  useDisclose,
  Divider,
} from "native-base";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  ButtonProps,
  Keyboard,
  ListRenderItemInfo,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SQLError, SQLResultSet, SQLTransaction } from "expo-sqlite";

import { Formik } from "formik";
import { useAppSelector } from '../../../hooks/hooks';
import { natamorasDB } from '../../../utils/helpers';
import { Section4ScreenProps } from '../../../global/types';

export const Section4Form: FC<Section4ScreenProps> = (navigation: any ) => {

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [checkboxState, setCheckboxState] = useState<boolean>(false);
  const [kdppIsChecked, setKdppIsChecked] = useState<boolean>(false);
  
  const { onToggle, isOpen } = useDisclose();

  let bouncyCheckboxRef = useRef<BouncyCheckbox>();
  let kdppRef = useRef<BouncyCheckbox>(null);

    const { mbrno } = useAppSelector((state) => state.member);
    const createMemberTable = () => {
      natamorasDB.transaction((txn: SQLTransaction) => {
        txn.executeSql(
          "CREATE TABLE IF NOT EXISTS member (MBR_NO TEXT, MBR_WELFARE_PKG TEXT, MBRSNAME TEXT, MBRFNAME TEXT, MBR_STATUS TEXT, MBR_DOB TEXT, MBR_GENDER TEXT, MBR_TEL_NO1 TEXT, MBR_TEL_NO2 TEXT, MBR_ADDR_LN1 TEXT, MBR_ADDR_LN2 TEXT, MBR_BRANCH TEXT, MBR_CITY TEXT, MBR_LGA TEXT, MBR_STATE TEXT, MBR_VEHICLE_NO TEXT, MBR_VEHICLE_NO2 TEXT, RIDERS_CARD_NO TEXT, MBR_BENEFIT_PYMT TEXT, MBR_NUM_BEN TEXT, MBR_STATE_OF_ORIGIN, TEXT, MBR_ORIGIN_LGA, TEXT, MBR_ORIGIN_TOWN)",
          [],
          (txn, ResultSet) => {
            console.log("member table created successfully");
          },
          (txn: SQLTransaction, error: SQLError) => {
            console.log(error);
            return true;
          }
        );
        })
      }
  
  const alertBtnHandler = (): void => {
    onToggle();
    if (!checkboxState) {
      bouncyCheckboxRef?.current?.onPress();
    }
    if (!kdppIsChecked) {
      kdppRef?.current?.onPress();
    }
  };


  return (
    <View style={{flex: 1}}>index
    <ScrollView>
            <HStack
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
                I attest, to the best of my knowledge and belief, that all
                information provided in this form is true and accurate at this
                point in time and that the picture contained herein is a true
                and accurate representation of my person.
              </Text>
            </HStack>
            <HStack
              alignItems="flex-start"
              justifyContent="flex-end"
              alignSelf="flex-end"
              w="82%"
            >
             

            <HStack
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
            I hereby with or without reason, undertake as follows
            not to be involved in any criminal acts against any individual or acts that are intended or calculated to provoke a state of terror in the general public, a group of persons or particular persons for considerations that are of a political, philosophical, ideological, racial, ethnic, religious or other nature whatsoever; 
            not to be involved in any acts of terrorism, acts of violence, banditry, brigandry, kidnapping or any acts of violence that threatens or causes death or bodily injury to any person or damage to public or private property or that results or is likely to result in economic loss for any reason whatsoever; 
            not to be involved knowingly or unknowingly in any acts that threatens the dignity and security of human beings anywhere, that endangers or takes innocent lives through links with transnational organised crime, drug trafficking, money-laundering and trafficking in small arms and light weapons and is linked to the consequent commission of serious crimes such as murder, extortion, kidnapping, assault, hostage-taking and robbery; 
            I accept that should I be found to be involved in any of the aforementioned acts, my membership of NATOMORAS will immediately terminate by expulsion from NATOMORAS, my benefits under any and all welfare schemes for myself and my family will immediately terminate and that members of NATOMORAS will forthwith hand me over to the appropriate government security and law enforcement agencies to allow the rule of law take its natural cause.
            </Text>
          </HStack>
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
              </TouchableOpacity>
            </HStack>
    </ScrollView>
    </View>
  )
}

//export default Section4