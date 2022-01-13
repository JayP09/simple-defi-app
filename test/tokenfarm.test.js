const { expect, assert} = require("chai");
const { ethers, artifacts } = require("hardhat");

require('chai')
  .use(require('chai-as-promised'))
  .should()


describe('TokenFarm',async () => {
    let owner;
    let addr1;
    let addr2;
    let DaiToken;
    let DappToken;
    let TokenFarm;
    let daiTokenContract;
    let dappTokenContract;
    let tokenFarmContract;


    beforeEach(async () => {
        // Load Contracts
        [owner,addr1,addr2] = await ethers.getSigners();

        DaiToken = await ethers.getContractFactory('DaiToken');
        daiTokenContract = await DaiToken.deploy();
        await daiTokenContract.deployed();

        DappToken = await ethers.getContractFactory('DappToken');
        dappTokenContract = await DappToken.deploy();
        await dappTokenContract.deployed();

        TokenFarm =  await ethers.getContractFactory('TokenFarm');
        tokenFarmContract = await TokenFarm.deploy(daiTokenContract.address, dappTokenContract.address);
        await tokenFarmContract.deployed();

        // Transfer all Dapp tokens to from (1 million)
        await dappTokenContract.transfer(tokenFarmContract.address,'1000000000000000000000000');

        await daiTokenContract.transfer(addr1.address,'1000000000000000000');
    });

    describe('Mock Dai deployment',function () {
        it("has a name", async function () {
            assert.equal(await daiTokenContract.name(),'Mock Dai Token')
        });
    });

    describe('Dapp Token deployment',function () {
        it("has a name", async function () {
            assert.equal(await dappTokenContract.name(),'Dapp Token')
        });
    });

    describe('Token Farm deployment',function () {
        it("has a name", async function () {
            assert.equal(await tokenFarmContract.name(),'Token Farm')
        });

        it('Contract has tokens', async () => {
            let balance = await dappTokenContract.balanceOf(tokenFarmContract.address)
            assert.equal(balance.toString(),'1000000000000000000000000')
        });
    });

    describe('Farming tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result;

            // Check investor balance for staking
            result = await daiTokenContract.balanceOf(addr1.address);
            assert.equal(result.toString(),'1000000000000000000','investor Mock Dai balance correct before staking')

            // Stake Mock Dai Tokens
            await daiTokenContract.connect(addr1).approve(tokenFarmContract.address,'1000000000000000000')
            await tokenFarmContract.connect(addr1).stakeToken('1000000000000000000')

            // check investor balance
            result  = await daiTokenContract.balanceOf(addr1.address)
            assert.equal(result.toString(),'0','investor Mock Dai wallet balance correct after staking')

            // check staking balance
            result = await tokenFarmContract.stakingBalance(addr1.address)
            assert.equal(result.toString(),'1000000000000000000')

            // check if investor is staking
            result = await tokenFarmContract.isStaking(addr1.address)
            assert.equal(result.toString(),'true')

            // Issue Dapp Tokens to investor 
            await tokenFarmContract.connect(owner).issueTokens()

            // check investor Dapp balance
            result = await dappTokenContract.balanceOf(addr1.address)
            assert.equal(result.toString(),'1000000000000000000')

            // Ensure that only owner can issue tokens
            await tokenFarmContract.connect(addr1).issueTokens().should.be.rejected;

            // unstake tokens
            await tokenFarmContract.connect(addr1).unstakeTokens('1000000000000000000')

            // # check results after unstaking

            // check daitoken balance of investor
            result = await daiTokenContract.balanceOf(addr1.address);
            assert.equal(result.toString(),'1000000000000000000','investor Mock Dai balance correct after staking')

            // check daiToken balance of farm contract
            result  = await daiTokenContract.balanceOf(tokenFarmContract.address)
            assert.equal(result.toString(),'0','Token farm Mock Dai balance correct after staking')

            result = await tokenFarmContract.stakingBalance(addr1.address)
            assert.equal(result.toString(),'0','investor staking balance correct after staking')

            // check staking status of investor
            result = await tokenFarmContract.isStaking(addr1.address)
            assert.equal(result.toString(),'false','investor staking status correct after staking')
        })
    })
})



