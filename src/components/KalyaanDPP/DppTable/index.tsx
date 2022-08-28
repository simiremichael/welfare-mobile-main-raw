import { VStack, Text, Image, HStack, Divider } from "native-base";
import React from "react";
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Col,
} from "react-native-table-component-2";
import { Styles } from "./style";
import { Dimensions } from "react-native";
import { TableRow, TableTitle } from "../TableComps";
import { tableData } from "../../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import { KdppScreenNavigationProps } from "../../../global/types";
const { width } = Dimensions.get("window");
const halfWidth = width / 2;

const DppTable = () => {
  return (
    <VStack space="5">
      <Text fontFamily="monstserrat_medium" fontSize="md" textAlign="center">
        Dated the 1ST June, 2022
      </Text>
      <VStack>
        <Text fontFamily="monstserrat_medium">KALYAAN WELFARE CONSULTING;</Text>
        <Text fontFamily="monstserrat_bold">DATA PROTECTION POLICY</Text>
      </VStack>
      <VStack style={Styles.table} borderWidth="1" borderColor="black">
        <TableRow title="Date" tableContent="1.06.2022" />
        <Divider style={Styles.table} thickness="1" bgColor="black" />
        {tableData &&
          tableData.map((item, index) => (
            <TableRow
              key={index}
              tableContent={item.tableContent}
              title={item.title}
              subTitle={item.subTitle}
            />
          ))}
      </VStack>
    </VStack>
  );
};

export default DppTable;
