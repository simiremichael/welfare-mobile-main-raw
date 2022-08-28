import { Box, Image } from "native-base";
import React, { FC } from "react";
import LoginForm from "../../../components/authentication/forms/login";
import { BottomLogo } from "../../../components/common/global";
import { LoginScreenProps } from "../../../global/types";

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  return (
    <Box flex="1" bgColor="white" safeAreaTop>
      <LoginForm navigation={navigation} />
      <BottomLogo />
    </Box>
  );
};

export default LoginScreen;
