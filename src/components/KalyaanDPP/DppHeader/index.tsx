import React from "react";
import { VStack, Text, Image } from "native-base";

const DppHeader = () => {
  return (
    <VStack alignItems="center" space="12">
      <Text textAlign="center" fontSize="md" fontFamily="monstserrat_medium">
        KALYAAN WELFARE CONSULTING LIMITED
      </Text>
      <Text textAlign="center" fontSize="md" fontFamily="monstserrat_bold">
        DATA PROTECTION POLICY
      </Text>
      <Image
        alt="kalyaan-logo"
        size="48"
        source={require("../../../assets/icons/kalyan-logo-with-title.png")}
      />
    </VStack>
  );
};

export default DppHeader;
