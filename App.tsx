import "react-native-gesture-handler";
import "expo-dev-client";
import React, { useState, useEffect, useCallback } from "react";
import { extendTheme, NativeBaseProvider } from "native-base";
import RootStack from "./src/routes/root";
import { COLORS } from "./src/global/types";
import { Provider } from "react-redux";
import store from "./src/store";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import FlashMessage from "react-native-flash-message";
import { BackHandler, LogBox, StatusBar } from "react-native";
import { Section1Screen } from "./src/screens/sections/section1";
import { Section1bScreen } from "./src/screens/sections/section1b";
import { Section1cScreen } from "./src/screens/sections/section1c";
import { Section2Screen } from "./src/screens/sections/section2";
import { Section3Screen } from "./src/screens/sections/section3";

const colors: COLORS = {
  primary_main: "#432344",
  section_main: "#ff2525",
  input_secondary: "#ffc03d",
};

const theme = extendTheme({
  colors,
});

type themeType = typeof theme;

declare module "native-base" {
  interface ICustomTheme extends themeType {}
}
const App = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const fontConfig = {
    monstserrat_medium: require("./src/assets/fonts/Montserrat-Medium.ttf"),
    monstserrat_bold: require("./src/assets/fonts/Montserrat-Bold.ttf"),
  };

  const prepareApp = async (): Promise<void> => {
    try {
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync(fontConfig);
    } catch (error) {
      console.warn(error);
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs(["ViewPropTypes will be removed"]);
    prepareApp();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Section3Screen  />
      </NativeBaseProvider>
      <FlashMessage position="top" />
    </Provider>
  );
};

export default App;
