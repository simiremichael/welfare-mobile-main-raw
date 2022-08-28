import { View } from "react-native";
import React, { FC, useContext } from "react";
import { Section2Form } from "../../../components/forms/section2";
import {
  ScrollView,
  VStack,
  Text,
  Button,
  IconButton,
  Icon,
  HStack,
} from "native-base";
import LogoHeader from "../../../components/common/sectionHeders";
import { Section2ScreenProps } from "../../../global/types";
import { MaterialIcons } from "@expo/vector-icons";
import SectionFooter from "../../../components/common/sectionFooter";
import { BottomLeftLogo, BottomLogo } from "../../../components/common/global";
import { UserContext } from "../../../utils/userContext";
export const Section2Screen: FC<Section2ScreenProps> = ({ navigation }) => {
  return (
    <ScrollView>
      <VStack py="10" bgColor="white" safeAreaTop space="6">
        <Section2Form navigation={navigation} />
        <BottomLeftLogo />
        <BottomLogo />
      </VStack>
    </ScrollView>
  );
};
