import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const finalWidth = (90 / 100) * width;
export const Styles = StyleSheet.create({
  tableBorder: {
    borderWidth: 1.5,
    borderColor: "#000",
  },
  text: {
    margin: 10,
  },
  table: {
    width: finalWidth,
  },
});
