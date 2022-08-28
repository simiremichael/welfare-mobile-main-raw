import React from "react";
import { HStack, Avatar, Text, VStack } from "native-base";

const LogoHeader = () => {
  return (
    <VStack pt="11" space="4" justifyContent="center" alignItems="center">
      <Avatar source={require("../../../assets/natomoras.jpeg")} h="72" w="72">
        LOGO
      </Avatar>
      <Text
        width="86%"
        fontFamily="monstserrat_bold"
        fontSize="lg"
        textAlign="center"
      >
        National Commercial Tricycle Motorcycle Owners And Riders Association Of
        Nigeria
      </Text>
    </VStack>
  );
};

export default LogoHeader;
