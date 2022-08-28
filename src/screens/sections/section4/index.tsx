import React, { FC, useContext } from "react";
import { Section1Form } from "../../../components/forms/section1";
import {
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import {
  Section4ScreenProps,
  Section1ScreenProps,
} from "../../../global/types";
import LogoHeader from "../../../components/common/sectionHeders";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "../../../hooks/hooks";
import SectionFooter from "../../../components/common/sectionFooter";
import { BottomLeftLogo, BottomLogo } from "../../../components/common/global";
import { Section1bForm } from "../../../components/forms/section1b";
import { UserContext } from "../../../utils/userContext";

export const Section4Screen: FC<Section4ScreenProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack safeAreaTop bgColor="white" space="4" py="10">
        <Section1bForm navigation={navigation} />
        <BottomLeftLogo />
        <BottomLogo />
      </VStack>
    </ScrollView>
  );
};
