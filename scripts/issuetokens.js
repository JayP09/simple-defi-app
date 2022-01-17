const hre = require("hardhat");

async function main() {
    const TokenFarm =  await ethers.getContractFactory('TokenFarm');
    await TokenFarm.deployed();
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
