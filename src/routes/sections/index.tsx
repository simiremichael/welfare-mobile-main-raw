import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { SECTION_STACK_PARAMS_LIST } from "../../global/types";
import { Section1Screen } from "../../screens/sections/section1";
import { Section3Screen } from "../../screens/sections/section3";
import { Section2Screen } from "../../screens/sections/section2";
import { Section1bScreen } from "../../screens/sections/section1b";
import { Section1cScreen } from "../../screens/sections/section1c";

const Stack = createStackNavigator<SECTION_STACK_PARAMS_LIST>();
const { Navigator, Screen } = Stack;

const ScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const SectionsStack = () => {
  return (
    <Navigator
      screenOptions={ScreenOptions}
      initialRouteName="section-screen-1"
    >
      <Screen name="section-screen-1" component={Section1Screen} />
      <Screen name="section-screen-1b" component={Section1bScreen} />
      <Screen name="section-screen-1c" component={Section1cScreen} />
      <Screen name="section-screen-2" component={Section2Screen} />
    </Navigator>
  );
};

export default SectionsStack;
