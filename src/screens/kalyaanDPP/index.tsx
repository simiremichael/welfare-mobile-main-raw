import React from "react";
import { VStack, Text, ScrollView, Icon } from "native-base";
import DppTable from "../../components/KalyaanDPP/DppTable";
import DppHeader from "../../components/KalyaanDPP/DppHeader";
import { KdppScreenNavigationProps } from "../../global/types";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("screen");
const paddingBottomHeight: number = (10 / 100) * height;
const KalyanDPP = () => {
  const navigation = useNavigation<KdppScreenNavigationProps>();
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingBottom: paddingBottomHeight,
      }}
    >
      <VStack flex="1" pt="10" safeAreaTop alignItems="center" space="9">
        <TouchableOpacity
          style={{
            alignSelf: "flex-start",
            marginLeft: 13,
          }}
          onPress={() => navigation.goBack()}
        >
          <Icon
            as={MaterialIcons}
            name="arrow-back-ios"
            color="#000"
            size="xl"
          />
        </TouchableOpacity>
        <DppHeader />
        <DppTable />
      </VStack>
    </ScrollView>
  );
};

export default KalyanDPP;
