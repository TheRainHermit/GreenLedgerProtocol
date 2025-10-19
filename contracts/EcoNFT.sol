// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EcoNFT
 * @dev NFT ecológico, sólo el Master puede mintear y consultar NFTs de usuarios.
 */
contract EcoNFT is ERC721, Ownable {
    address public immutable master;
    uint256 public nextTokenId;
    mapping(uint256 => string) private _tokenURIs;

    modifier onlyMaster() {
        require(msg.sender == master, "Solo el contrato maestro");
        _;
    }

    constructor(address _master) ERC721("EcoNFT", "ECO") {
        require(_master != address(0), "Master requerido");
        master = _master;
    }

    function mint(address to, string calldata uri) external onlyMaster returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        return tokenId;
    }


    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // ownerOf revertirá si el token no existe
        ownerOf(tokenId);
        return _tokenURIs[tokenId];
    }

    function tokensOf(address user) external view returns (uint256[] memory) {
        uint256 count = balanceOf(user);
        uint256[] memory ids = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < nextTokenId; i++) {
            // ownerOf revertirá si el token no existe, así que usamos try/catch
            try this.ownerOf(i) returns (address owner) {
                if (owner == user) {
                    ids[idx++] = i;
                }
            } catch {}
        }
        return ids;
    }
}
