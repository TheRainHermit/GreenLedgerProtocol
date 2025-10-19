// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GreenLedgerScore
 * @dev Score ambiental por usuario, sólo el Master puede modificar y consultar scores.
 */
contract GreenLedgerScore {
    address public immutable master;
    mapping(address => uint256) private _scores;

    modifier onlyMaster() {
        require(msg.sender == master, "Solo el contrato maestro");
        _;
    }

    constructor(address _master) {
        require(_master != address(0), "Master requerido");
        master = _master;
    }

    function setScore(address user, uint256 score) external onlyMaster {
        _scores[user] = score;
    }

    function getScore(address user) external view returns (uint256) {
        return _scores[user];
    }
}
