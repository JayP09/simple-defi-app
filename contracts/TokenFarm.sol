//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./DaiToken.sol";
import "./DappToken.sol";
import "hardhat/console.sol";

contract TokenFarm{
    // STATE VARIBALES
    string public name = "Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    address[] public stakers;


    // MAPPING
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => bool) hasStaked;

    // MODIFIERS
    modifier onlyOwner() {
        require(msg.sender == owner,"Only owner can issue the token");
        _;
    }

    // EVENTS
    event StakeToken(address staker, uint amount);
    event UnstakeToken(address staker, uint amount);
    event IssueDappToken(address issuer, address recipient, uint amount);

    // FUNTIONS
    constructor (DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public{
        // _amount shpuld be greater then zero
        require(_amount > 0,"Amount Should be greater then zero");

        // transfer daiToken from msg.sender to Contract
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update the staking balance
        stakingBalance[msg.sender] += _amount;

        // check is user is already staked or not
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

        emit StakeToken(msg.sender, _amount);
    }

    function unstakeTokens(uint _amount) public{
        require(_amount <= stakingBalance[msg.sender], "Staking balance is lower then amount");
        // transfer DaiToken to msg.sender
        daiToken.transfer(msg.sender, _amount);

        if(stakingBalance[msg.sender]>0){
            issueTokens(_amount);
        }

        // Update staking balance
        stakingBalance[msg.sender] -= _amount;

        if(stakingBalance[msg.sender] == 0) {
            isStaking[msg.sender] = false;
        }
        
        emit UnstakeToken(msg.sender, _amount);
    }

    function issueTokens(uint _amount) public {
        if(stakingBalance[msg.sender] > 0) {
            console.log("Inside IssueToken");
            dappToken.transfer(msg.sender,_amount);
            emit IssueDappToken(owner, msg.sender,_amount);
        }
    }
}