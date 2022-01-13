const hre = require("hardhat");

async function main() {
  const [owner,addr1,addr2] = await ethers.getSigners();
  const DaiToken = await ethers.getContractFactory('DaiToken');
  const daiTokenContract = await DaiToken.deploy();
  await daiTokenContract.deployed();

  const DappToken = await ethers.getContractFactory('DappToken');
  const dappTokenContract = await DappToken.deploy();
  await dappTokenContract.deployed();

  const TokenFarm =  await ethers.getContractFactory('TokenFarm');
  const tokenFarmContract = await TokenFarm.deploy(daiTokenContract.address, dappTokenContract.address);
  await tokenFarmContract.deployed();

  await dappTokenContract.transfer(tokenFarmContract.address,'1000000000000000000000000');

  await daiTokenContract.transfer(addr1.address,'1000000000000000000');
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
