// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NFTMetadata
 * @dev Almacena y consulta metadatos de NFTs, sólo el Master puede modificar.
 */
contract NFTMetadata {
    address public immutable master;
    mapping(uint256 => string) private _metadata;

    modifier onlyMaster() {
        require(msg.sender == master, "Solo el contrato maestro");
        _;
    }

    constructor(address _master) {
        require(_master != address(0), "Master requerido");
        master = _master;
    }

    function setMetadata(uint256 tokenId, string calldata data) external onlyMaster {
        _metadata[tokenId] = data;
    }

    function getMetadata(uint256 tokenId) external view returns (string memory) {
        return _metadata[tokenId];
    }
}
