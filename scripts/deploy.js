const hre = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  const DaiToken = await ethers.getContractFactory('DaiToken');
  const daiTokenContract = await DaiToken.deploy();
  await daiTokenContract.deployed();

  const DappToken = await ethers.getContractFactory('DappToken');
  const dappTokenContract = await DappToken.deploy();
  await dappTokenContract.deployed();

  const TokenFarm =  await ethers.getContractFactory('TokenFarm');
  const tokenFarmContract = await TokenFarm.deploy(daiTokenContract.address, dappTokenContract.address);
  await tokenFarmContract.deployed();

  console.log("DaiToken Contract address:",daiTokenContract.address);
  console.log("DappToken Contract address:", dappTokenContract.address);
  console.log("TokenFarm Contract address:",tokenFarmContract.address);

  await dappTokenContract.transfer(tokenFarmContract.address,'1000000000000000000000000');

  await daiTokenContract.transfer("0x026B71480aaa9D97386404057F5C87100377b98E",'100000000000000000000');

  console.log(owner.address)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
