require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai:{
      url:process.env.STAGING_ALCHEMY_KEY, // YOUR_ALCHEMY_API_URL 
      accounts: [process.env.PRIVATE_KEY], // YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY
    }
  }
}