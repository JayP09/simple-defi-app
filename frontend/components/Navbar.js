import {
  Spacer,
  useColorMode,
  Switch,
  Flex,
  Text
} from "@chakra-ui/react";
import { useState } from "react";

const Navbar = ({ currentAccount }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <>
      <Flex padding={4}>
        <Text fontSize="2xl">DefiApp</Text>
        <Spacer />
        {!currentAccount ? (
          ""
        ) : (
          <Text fontSize="md" alignSelf="center">
            {currentAccount}
          </Text>
        )}
        <Spacer />
        <Switch
          alignSelf="center"
          color="green"
          isChecked={isDark}
          onChange={toggleColorMode}
        />
      </Flex>
    </>
  );
};
export default Navbar;
