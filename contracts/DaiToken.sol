//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract DaiToken {

    // STATE VARIABLES
    string public name = "Mock Dai Token";
    string public symbol = "mDai";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million token
    uint8 public decimals = 18;
    address public owner;

    // EVENTS
    event Transfer(
        address indexed _from, 
        address indexed _to, 
        uint _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    event Burn(
        address indexed _burner,
        address indexed _burnAddress,
        uint _value
    );

    // MAPPINGS
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) allowance;


    // FUNCTIONS
    constructor () {
        balanceOf[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address _to, uint _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public returns(bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

     function burn(uint _amount) public {
        balanceOf[msg.sender] -= _amount;
        balanceOf[address(0)] += _amount;
        emit Burn(msg.sender,address(0), _amount);
    }
}