import react from "react";
import { VStack, Text, HStack, Icon } from "native-base";
import { Entypo, Feather, Foundation } from "@expo/vector-icons";
import EmailIcon from "../../../assets/icons/email.svg";
const SectionFooter = () => {
  return (
    <VStack
      w="86%"
      space="1"
      alignSelf="center"
      justifyContent="center"
      alignItems="flex-start"
      mt="4"
    >
      <HStack alignItems="center" space="2">
        <Icon as={Entypo} name="location" color="black" size="2xl" />
        <Text fontSize="md" w="72" fontFamily="monstserrat_medium">
          National Secretariat House 8A, 6921A Road, Adkan Estate, Gwarinpa
          Federal Capital Territory
        </Text>
      </HStack>
      <HStack alignItems="center" space="2">
        <Icon as={Feather} name="phone" color="black" size="2xl" />
        <VStack>
          <Text fontSize="md" fontFamily="monstserrat_medium">
            +234 (0) 1 630 4144,{"\n"}+234 (0) 1 630 4145
          </Text>
        </VStack>
      </HStack>
      <HStack space="2" alignItems="center">
        <EmailIcon height={40} width={40} />
        <Text fontSize="md" fontFamily="monstserrat_medium">
          info@kalyaanwelfare.com,
        </Text>
      </HStack>
      <HStack space="2" alignItems="center">
        <Icon as={Foundation} name="web" color="black" size="2xl" />
        <Text fontSize="md" fontFamily="monstserrat_medium">
          www@kalyaanwelfare.com
        </Text>
      </HStack>
    </VStack>
  );
};

export default SectionFooter;
