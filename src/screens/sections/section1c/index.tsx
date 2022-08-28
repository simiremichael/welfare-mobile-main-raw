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
import { Section1cScreenProps } from "../../../global/types";
import LogoHeader from "../../../components/common/sectionHeders";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "../../../hooks/hooks";
import SectionFooter from "../../../components/common/sectionFooter";
import { BottomLeftLogo, BottomLogo } from "../../../components/common/global";
import { Section3Form } from "../../../components/forms/section3";
import { Section1cForm } from "../../../components/forms/section1c";
import { UserContext } from "../../../utils/userContext";

export const Section1cScreen: FC<Section1cScreenProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack flex="1" pt="10" safeAreaTop bgColor="white">
        <Section1cForm navigation={navigation} />
        <BottomLeftLogo />
        <BottomLogo />
      </VStack>
    </ScrollView>
  );
};
