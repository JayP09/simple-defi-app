import {
   Spacer ,
   useColorMode, 
   Switch, Flex, 
   Button, 
   IconButton,
   Text,
   Heading,
   Input,
   useColorModeValue,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   Box
  } from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import { ethers } from "ethers";
import daiTokenData from '../../artifacts/contracts/DaiToken.sol/DaiToken.json';
import dappTokenData from '../../artifacts/contracts/DappToken.sol/DappToken.json';
import tokenFarmData from '../../artifacts/contracts/TokenFarm.sol/TokenFarm.json';

export default function Home() {
  // state variable we use to store our user's public wallet address
  const [currentAccount, setCurrentAccount] = useState("");

  const [daiTokenContract, setDaiTokenContract] = useState({});
  const [dappTokenContract, setDappTokenContract] = useState({});
  const [tokenFarmContract, setTokenFarmContract] = useState({});

  const [amount,setAmount] = useState(0);


  const daiTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const dappTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const tokenFarmAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const [stakingBalance, setStakingBalance] = useState(0);
  const [dappTokenBalance, setDappTokenBalance] = useState(0);
  const [daiTokenBalance,setDaiTokenBalance] = useState(0);

  // Theme Toggler 
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const formBackground = useColorModeValue("grey.100","grey.700")

  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
   try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /*
    Check if we are authorized to access the user's wallet
    */

    const accounts = await ethereum.request({method: 'eth_accounts'}); 
    // So, we use that special method eth_accounts to see if we're authorized to access any of the accounts in the user's wallet. One thing to keep in mind is that the user could have multiple accounts in their wallet. In this case, we just grab the first one.

    
    if (accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      loadBlockChainData(ethereum,accounts)
    } else{
      console.log("No authorized account found")
    }
   } catch (error) {
     console.log(error);
   }
  }

  /* 
  LoadblockChain data
  */
  const loadBlockChainData = async (ethereum,accounts) => {
    
    // load daiTokenContract 
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    let daiTokenContract = new ethers.Contract(daiTokenAddress, daiTokenData.abi, signer);
    setDaiTokenContract(daiTokenContract);

    //load DapptokenContract
    let dappTokenContract = new ethers.Contract(dappTokenAddress, dappTokenData.abi, signer);
    setDappTokenContract(dappTokenContract);

    // load TokenFarmContract
    const tokenFarmContract = new ethers.Contract(tokenFarmAddress, tokenFarmData.abi, signer);
    setTokenFarmContract(tokenFarmContract);

    let daiTokenBalance = await daiTokenContract.balanceOf(accounts[0])
    setDaiTokenBalance(ethers.utils.formatEther(daiTokenBalance))

    let stakingBalance = await tokenFarmContract.stakingBalance(accounts[0])
    setStakingBalance(stakingBalance)
  }

  /* 
  Connect wallet method
  */
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;

      if (!ethereum){
        alert("Get metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    
    } catch (error) {
      console.log(error);
    }
  }
  

  const stakeTokens = async() =>{
    let stakeAmount;
    stakeAmount = amount.toString();
    stakeAmount = ethers.utils.parseEther(stakeAmount)
    console.log(stakeAmount)
    let stake;
    stake = await daiTokenContract.approve(tokenFarmAddress,stakeAmount);
    await stake.wait();
    await (await tokenFarmContract.stakeToken(stakeAmount)).wait();
    let stakingBalance = await tokenFarmContract.stakingBalance(currentAccount);
    setStakingBalance(stakingBalance);
    setDaiTokenBalance((daiTokenBalance - amount));
    setAmount(0);
  }

  const unstakeToken = async () =>{
    let unstakeAmount;
    unstakeAmount = amount.toString();
    unstakeAmount = ethers.utils.parseEther(unstakeAmount)
    console.log(unstakeAmount)
    let unstake;
    unstake = await tokenFarmContract.unstakeTokens(unstakeAmount);
    await unstake.wait();
    let stakingBalance = await tokenFarmContract.stakingBalance(currentAccount);
    setStakingBalance(stakingBalance);
    let daiTokenBalance = await daiTokenContract.balanceOf(currentAccount);
    setDaiTokenBalance(ethers.utils.formatEther(daiTokenBalance));
    setAmount(0);
  }


 

  useEffect(() => {
    checkIfWalletIsConnected();
  },[currentAccount])

  return (
    <>
      <Navbar currentAccount={currentAccount}/>
      <Table variant='unstyled'>
        <Thead>
          <Tr>
            <Th fontSize="md" textTransform="none" textAlign="center">Staking Balance</Th>
            <Th fontSize="md" textTransform="none" textAlign="center">Reward Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td isNumeric textAlign="center">{ethers.utils.formatEther(stakingBalance)} mDAI</Td>
            <Td isNumeric textAlign="center">{ethers.utils.formatEther(dappTokenBalance)} DAPP</Td>
          </Tr>
        </Tbody>
      </Table>
      <Flex
      p={50}
      w="full"
      alignItems="center"
      justifyContent="center"
      >
        <Box
          mx="auto"
          rounded="lg"
          shadow="md"
          maxW="2xl"
          borderWidth='1px' borderRadius='lg'
        >
          <Box p={6} >
          <Flex backgroundColor={formBackground} direction="column" p={4} rounded={6}>
            <Flex>
              <Text mb={6} fontSize="xl">StakeToken</Text>
              <Spacer />
              <Text mb={6} fontSize="xl">Balance: {daiTokenBalance}</Text>
            </Flex>
            <Input placeholder={amount} varient="filled" mb={5} type="number" width={"500px"} required onChange={(e) => setAmount(e.target.value)}/>
            <Button colorScheme="teal" mb={3} textTransform="uppercase" onClick={stakeTokens}> 
              Stake!
            </Button>
            {stakingBalance== 0 ? (""):(
            <Button colorScheme="teal" mb={3} textTransform="uppercase" onClick={unstakeToken}> 
              UnStake!
            </Button>)}
            {!currentAccount && (
            <Button onClick={connectWallet}>
              Connect Wallet
            </Button>
            )}
          </Flex>
          </Box>
        </Box>
      </Flex>
    </>
  )
}
