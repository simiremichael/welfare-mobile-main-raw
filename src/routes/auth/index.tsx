import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import LoginScreen from "../../screens/authentication/login";

import { AUTH_STACK_PARAMS_LIST } from "../../global/types";
import SplashScreen from "../../screens/authentication/splash";

const Stack = createStackNavigator<AUTH_STACK_PARAMS_LIST>();
const { Navigator, Screen } = Stack;
const ScreenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
const AuthStack = () => {
  return (
    <Navigator screenOptions={ScreenOptions}>
      <Screen name="login" component={LoginScreen} />
    </Navigator>
  );
};

export default AuthStack;
