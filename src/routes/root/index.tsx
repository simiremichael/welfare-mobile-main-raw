import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { ROOT_STACK_PARAMS_LIST } from "../../global/types";
import AuthStack from "../auth";
import SectionsStack from "../sections";
import { fetchEmail } from "../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { BackHandler } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { setAppIsOnline } from "../../features/auth/authSlice";
import KalyanDPP from "../../screens/kalyaanDPP";

const Stack = createStackNavigator<ROOT_STACK_PARAMS_LIST>();
const { Navigator, Screen } = Stack;
const ScreenOptions: StackNavigationOptions = {
  headerShown: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const RootStack = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  return (
    <NavigationContainer>
      <Navigator initialRouteName="auth-stack" screenOptions={ScreenOptions}>
        <Screen
          options={{
            headerShown: false,
          }}
          name="auth-stack"
          component={AuthStack}
        />
        <Screen
          options={{
            headerShown: false,
          }}
          name="section-stack"
          component={SectionsStack}
        />
        <Screen
          options={{
            headerShown: false,
          }}
          name="kalyan-dpp"
          component={KalyanDPP}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
