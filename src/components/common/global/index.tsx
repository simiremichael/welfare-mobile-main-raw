import { FC } from "react";
import { SubmitButtonProps } from "../../../global/types";
import { Button, Image } from "native-base";

export const SubmitButton: FC<SubmitButtonProps> = ({
  onPress,
  children,
  isLoading,

  w,
  justifyContent,
  alignSelf,
}) => {
  return (
    <Button
      alignSelf={alignSelf}
      onPress={onPress}
      isLoading={isLoading}
      isLoadingText="loading.."
      rounded="xl"
      justifyContent={justifyContent}
      w={w}
      bgColor="primary_main"
      _text={{
        fontFamily: "monstserrat_bold",
        fontSize: "md",
      }}
    >
      {children}
    </Button>
  );
};

export const BottomLogo = () => {
  return (
    <Image
      alignSelf="flex-end"
      alt="bottom logo"
      h="12"
      w="12"
      right="3"
      bottom="3"
      position="absolute"
      source={require("../../../assets/logo.jpeg")}
    />
  );
};
export const BottomLeftLogo = () => {
  return (
    <Image
      alignSelf="flex-start"
      alt="bottom logo"
      h="16"
      w="16"
      left="3"
      bottom="3"
      position="absolute"
      source={require("../../../assets/natomoras.jpeg")}
    />
  );
};
