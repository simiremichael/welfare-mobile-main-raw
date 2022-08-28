import React, { FC } from "react";
import { Section1Form } from "../../../components/forms/section1";
import {
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { Section1ScreenProps } from "../../../global/types";
import LogoHeader from "../../../components/common/sectionHeders";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useAppDispatch } from "../../../hooks/hooks";
import SectionFooter from "../../../components/common/sectionFooter";
import { BottomLeftLogo, BottomLogo } from "../../../components/common/global";
import { TouchableOpacity } from "react-native";
import { clearAsyncStorage } from "../../../utils/helpers";

export const Section1Screen: FC<Section1ScreenProps> = ({ navigation }) => {
  const logOut = async (): Promise<void> => {
    try {
      await clearAsyncStorage();
      navigation.goBack();
    } catch (error) {}
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
      }}
    >
      <VStack pb="32" space="1.5" safeAreaTop pt="2">
        <TouchableOpacity
          style={{
            marginTop: 30,
          }}
          onPress={logOut}
        >
          <HStack
            w="24"
            rounded="sm"
            justifyContent="center"
            alignItems="center"
            borderColor="primary_main"
            borderWidth="2"
            p="1.5"
            space="2"
            ml="6"
          >
            <Text fontFamily="monstserrat_bold" color="primary_main">
              Logout
            </Text>
            <Icon
              as={FontAwesome5}
              name="door-open"
              size="sm"
              color="primary_main"
            />
          </HStack>
        </TouchableOpacity>
        <VStack alignSelf="center" width="40" space="2" alignItems="center">
          <Text
            color="primary_main"
            fontFamily="monstserrat_bold"
            fontSize="xl"
          >
            SECTION 1
          </Text>
          <Text
            fontFamily="monstserrat_bold"
            fontSize="lg"
            color="primary_main"
          >
            Personal Data
          </Text>
        </VStack>
        <Section1Form navigation={navigation} />
      </VStack>
      <BottomLeftLogo />
      <BottomLogo />
    </ScrollView>
  );
};
