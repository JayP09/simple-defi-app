import {
   Spacer ,
   useColorMode, 
   Switch, Flex, 
   Button, 
   IconButton,
   Text,
   Heading,
   Input,
   useColorModeValue
  } from '@chakra-ui/react'
import {useState} from 'react'

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const formBackground = useColorModeValue("grey.100","grey.700")

  return (
    <>
      <Flex
        padding={4}
      >
        <Text fontSize='2xl'>DefiApp</Text>
        <Spacer/>
        <Switch
          alignSelf='center'
          color='green'
          isChecked={isDark}
          onChange={toggleColorMode}
        />
      </Flex>
      <Flex 
        height="90vh" 
        alignItems="center" 
        justifyContent="center"
        backgroundColor={formBackground}  
      >
        <Flex 
        backgroundColor={formBackground}
        direction="column"
        p={12}
        rounded={6}
        >
          <Heading mb={6}>Log In</Heading>
          <Input 
              placeholder="amount"
              varient="filled"
              mb={3}
              type="email"
          />
          <Input
            placeholder= "********"
            varient="filled"
            mb={5}
            type="password" />
          <Button
          colorScheme="teal"
          >Log In</Button>
        </Flex>
      </Flex>
    </>
  )
}
