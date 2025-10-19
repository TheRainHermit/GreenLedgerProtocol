// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ScoreCalculator
 * @dev Calcula puntajes ambientales, sólo el Master puede invocar el cálculo.
 */
contract ScoreCalculator {
    address public immutable master;

    modifier onlyMaster() {
        require(msg.sender == master, "Solo el contrato maestro");
        _;
    }

    constructor(address _master) {
        require(_master != address(0), "Master requerido");
        master = _master;
    }

    // Ejemplo de cálculo: suma ponderada de factores
    function calculateScore(uint256 ecoActions, uint256 tokensHeld, uint256 nftsOwned) external view onlyMaster returns (uint256) {
        // Puedes ajustar los pesos según la lógica de negocio
        uint256 score = ecoActions * 5 + tokensHeld * 2 + nftsOwned * 10;
        return score;
    }
}
