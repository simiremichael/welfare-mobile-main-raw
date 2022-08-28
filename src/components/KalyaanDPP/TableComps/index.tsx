import React, { FC } from "react";
import { VStack, Text, HStack, Divider } from "native-base";
import { TableRowType, TableTitleType } from "../../../global/types";
import { Styles } from "../DppTable/style";

export const TableTitle: FC<TableTitleType> = ({ title, subTitle }) => {
  return (
    <VStack py="3" pl="2" w="40%" borderRightColor="black" borderRightWidth="1">
      <Text fontFamily="monstserrat_bold">{title}</Text>
      {subTitle && <Text fontFamily="monstserrat_medium">{subTitle}</Text>}
    </VStack>
  );
};

export const TableRow: FC<TableRowType> = ({
  title,
  subTitle,
  tableContent,
}) => {
  return (
    <HStack>
      <TableTitle title={title} subTitle={subTitle} />
      <Text fontFamily="monstserrat_medium" py="3" pl="2" w="59%">
        {tableContent}
      </Text>
    </HStack>
  );
};
