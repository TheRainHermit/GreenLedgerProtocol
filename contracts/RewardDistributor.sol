// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RewardDistributor
 * @dev Distribuye recompensas a usuarios, sólo el Master puede asignar y consultar.
 */
contract RewardDistributor {
    address public immutable master;
    mapping(address => uint256) private _rewards;

    modifier onlyMaster() {
        require(msg.sender == master, "Solo el contrato maestro");
        _;
    }

    constructor(address _master) {
        require(_master != address(0), "Master requerido");
        master = _master;
    }

    function assignReward(address user, uint256 amount) external onlyMaster {
        _rewards[user] += amount;
    }

    function claimReward() external {
        uint256 amount = _rewards[msg.sender];
        require(amount > 0, "Sin recompensa");
        _rewards[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function rewardOf(address user) external view returns (uint256) {
        return _rewards[user];
    }

    // Permite recibir ETH para recompensas
    receive() external payable {}
}
