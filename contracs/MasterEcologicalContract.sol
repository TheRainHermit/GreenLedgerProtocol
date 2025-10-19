// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MasterEcologicalContract
 * @dev Contrato maestro que actúa como punto central para interactuar con los
 *      contratos auxiliares de GreenLedger (NFTs, Scores, Metadata, Rewards,
 *      ScoreCalculator). Todas las partes están etiquetadas por sección.
 */
contract MasterEcologicalContract is Ownable {
    // ------------------------------------------------------------------
    // Section: Empresas, Representantes y Subcontratos
    // ------------------------------------------------------------------
    struct Empresa {
        string nombre;
        string sector;
        string pais;
        address wallet;
        uint256 score;
        uint256[] metricasIds;
        address[] representantes;
        bool activa;
    }

    struct Metrica {
        string tipo; // Ej: "carbon_emissions", "energy_consumption"
        uint256 valor;
        string unidad;
        uint256 timestamp;
    }

    mapping(address => Empresa) public empresas;
    address[] public empresasList;
    mapping(address => Metrica[]) public metricasPorEmpresa;

    // Subcontratos: servicioId => subcontrato
    mapping(bytes32 => address) public subcontratos;
    // ------------------------------------------------------------------
    // Section: Eventos para subcontratos
    // ------------------------------------------------------------------
    event SubcontratoRegistrado(bytes32 indexed servicioId, address indexed subcontrato);
    // ------------------------------------------------------------------
    // Section: Registro y resolución de subcontratos
    // ------------------------------------------------------------------
    function registrarSubcontrato(bytes32 servicioId, address subcontrato) external onlyOwner {
        require(subcontrato != address(0), "Dirección inválida");
        subcontratos[servicioId] = subcontrato;
        emit SubcontratoRegistrado(servicioId, subcontrato);
    }

    function resolver(bytes32 servicioId) external view returns (address) {
        return subcontratos[servicioId];
    }
    // ------------------------------------------------------------------
    // Section: Demo / Testing helpers
    // ------------------------------------------------------------------
    // Ejemplo: demo de registro y consulta de empresa
    function demoRegistrarEmpresa(string calldata nombre, string calldata sector, string calldata pais) external {
        registrarEmpresa(nombre, sector, pais);
    }

    function demoConsultarScore(address empresa) external view returns (uint256) {
        return consultarScore(empresa);
    }

    function demoRankingEmpresas() external view returns (address[] memory) {
        return rankingEmpresas();
    }

    function demoResolver(bytes32 servicioId) external view returns (address) {
        return resolver(servicioId);
    }

    // ------------------------------------------------------------------
    // Section: Eventos para empresas
    // ------------------------------------------------------------------
    event EmpresaRegistrada(address indexed wallet, string nombre, string sector, string pais);
    event RepresentanteAgregado(address indexed empresa, address indexed representante);
    event RepresentanteEliminado(address indexed empresa, address indexed representante);
    event MetricaRegistrada(address indexed empresa, string tipo, uint256 valor, string unidad);
    event ScoreActualizado(address indexed empresa, uint256 nuevoScore);

    // ------------------------------------------------------------------
    // Section: Registro autónomo y gestión de empresas
    // ------------------------------------------------------------------
    function registrarEmpresa(string calldata nombre, string calldata sector, string calldata pais) external {
        require(!empresas[msg.sender].activa, "Empresa ya registrada");
        empresas[msg.sender] = Empresa({
            nombre: nombre,
            sector: sector,
            pais: pais,
            wallet: msg.sender,
            score: 0,
            metricasIds: new uint256[](0),
            representantes: new address[](0),
            activa: true
        });
        empresasList.push(msg.sender);
        emit EmpresaRegistrada(msg.sender, nombre, sector, pais);
    }

    function agregarRepresentante(address representante) external {
        require(empresas[msg.sender].activa, "Solo empresas activas");
        empresas[msg.sender].representantes.push(representante);
        emit RepresentanteAgregado(msg.sender, representante);
    }

    function eliminarRepresentante(address representante) external {
        require(empresas[msg.sender].activa, "Solo empresas activas");
        address[] storage reps = empresas[msg.sender].representantes;
        for (uint i = 0; i < reps.length; i++) {
            if (reps[i] == representante) {
                reps[i] = reps[reps.length - 1];
                reps.pop();
                emit RepresentanteEliminado(msg.sender, representante);
                break;
            }
        }
    }

    // ------------------------------------------------------------------
    // Section: Registro de métricas ambientales por empresa
    // ------------------------------------------------------------------
    function registrarMetrica(string calldata tipo, uint256 valor, string calldata unidad) external {
        require(empresas[msg.sender].activa, "Solo empresas activas");
        metricasPorEmpresa[msg.sender].push(Metrica({
            tipo: tipo,
            valor: valor,
            unidad: unidad,
            timestamp: block.timestamp
        }));
        emit MetricaRegistrada(msg.sender, tipo, valor, unidad);
    }

    // ------------------------------------------------------------------
    // Section: Score y ranking empresarial
    // ------------------------------------------------------------------
    function actualizarScoreEmpresa(address empresa, uint256 nuevoScore) external onlyOwner {
        require(empresas[empresa].activa, "Empresa no activa");
        empresas[empresa].score = nuevoScore;
        emit ScoreActualizado(empresa, nuevoScore);
    }

    function consultarScore(address empresa) external view returns (uint256) {
        return empresas[empresa].score;
    }

    function rankingEmpresas() external view returns (address[] memory) {
        return empresasList;
    }

    // ------------------------------------------------------------------
    // Section: Recompensas y NFTs empresariales
    // ------------------------------------------------------------------
    function reclamarRecompensa(uint256 amount) external {
        require(empresas[msg.sender].activa, "Solo empresas activas");
        require(rewardDistributorAddress != address(0), "RewardDistributor not set");
        IRewardDistributor(rewardDistributorAddress).assignReward(msg.sender, amount);
        emit RewardAssigned(msg.sender, amount);
    }

    function mintearNFTReconocimiento(string calldata uri) external {
        require(empresas[msg.sender].activa, "Solo empresas activas");
        require(ecoNftAddress != address(0), "EcoNFT not set");
        uint256 tokenId = IEcoNFT(ecoNftAddress).mint(msg.sender, uri);
        emit EcoNFTMinted(msg.sender, tokenId, uri);
    }

    // ------------------------------------------------------------------
    // Section: Funciones administrativas para el dueño del contrato
    // ------------------------------------------------------------------
    function verEmpresa(address empresa) external view onlyOwner returns (
        string memory nombre,
        string memory sector,
        string memory pais,
        address wallet,
        uint256 score,
        address[] memory representantes,
        bool activa
    ) {
        Empresa storage e = empresas[empresa];
        return (e.nombre, e.sector, e.pais, e.wallet, e.score, e.representantes, e.activa);
    }

    function verMetricasEmpresa(address empresa) external view onlyOwner returns (Metrica[] memory) {
        return metricasPorEmpresa[empresa];
    }

    function verTodasEmpresas() external view onlyOwner returns (address[] memory) {
        return empresasList;
    }

    // ------------------------------------------------------------------
    // Fin de sección empresas
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------
    // Section: Interfaces for child contracts (lightweight)
    // ------------------------------------------------------------------
    interface IEcoNFT {
        function mint(address to, string calldata uri) external returns (uint256);
        function tokensOf(address user) external view returns (uint256[] memory);
        function tokenURI(uint256 tokenId) external view returns (string memory);
    }

    interface IGreenLedgerScore {
        function setScore(address user, uint256 score) external;
        function getScore(address user) external view returns (uint256);
    }

    interface INFTMetadata {
        function setMetadata(uint256 tokenId, string calldata data) external;
        function getMetadata(uint256 tokenId) external view returns (string memory);
    }

    interface IRewardDistributor {
        function assignReward(address user, uint256 amount) external;
        function rewardOf(address user) external view returns (uint256);
    }

    interface IScoreCalculator {
        function calculateScore(uint256 ecoActions, uint256 tokensHeld, uint256 nftsOwned) external view returns (uint256);
    }

    // ------------------------------------------------------------------
    // Section: Storage - addresses of auxiliary contracts
    // ------------------------------------------------------------------
    address public ecoNftAddress;           // EcoNFT contract (see: contracts/EcoNFT.sol)
    address public scoreContractAddress;    // GreenLedgerScore (see: contracts/GreenLedgerScore.sol)
    address public metadataAddress;         // NFTMetadata (see: contracts/NFTMetadata.sol)
    address public rewardDistributorAddress;// RewardDistributor (see: contracts/RewardDistributor.sol)
    address public scoreCalculatorAddress; // ScoreCalculator (see: contracts/ScoreCalculator.sol)

    // ------------------------------------------------------------------
    // Section: Events (tagged per area)
    // ------------------------------------------------------------------
    event EcoNFTMinted(address indexed to, uint256 indexed tokenId, string uri);
    event ScoreUpdated(address indexed user, uint256 newScore);
    event MetadataUpdated(uint256 indexed tokenId, string data);
    event RewardAssigned(address indexed user, uint256 amount);
    event ScoreCalculated(address indexed caller, uint256 score);
    event AuxiliaryContractUpdated(string indexed name, address indexed newAddress);

    // ------------------------------------------------------------------
    // Section: Constructor
    // ------------------------------------------------------------------
    constructor() Ownable() {}

    // ------------------------------------------------------------------
    // Section: Owner-only setters to wire auxiliary contracts
    // (Owner must deploy/point the child contracts and then set their addresses)
    // ------------------------------------------------------------------
    function setEcoNFT(address _addr) external onlyOwner {
        ecoNftAddress = _addr;
        emit AuxiliaryContractUpdated("EcoNFT", _addr);
    }

    function setScoreContract(address _addr) external onlyOwner {
        scoreContractAddress = _addr;
        emit AuxiliaryContractUpdated("GreenLedgerScore", _addr);
    }

    function setMetadataContract(address _addr) external onlyOwner {
        metadataAddress = _addr;
        emit AuxiliaryContractUpdated("NFTMetadata", _addr);
    }

    function setRewardDistributor(address _addr) external onlyOwner {
        rewardDistributorAddress = _addr;
        emit AuxiliaryContractUpdated("RewardDistributor", _addr);
    }

    function setScoreCalculator(address _addr) external onlyOwner {
        scoreCalculatorAddress = _addr;
        emit AuxiliaryContractUpdated("ScoreCalculator", _addr);
    }

    // ------------------------------------------------------------------
    // Section: EcoNFT wrappers (minting & queries)
    // ------------------------------------------------------------------
    /// @notice Mint an EcoNFT to `to`. Requires EcoNFT address to be set.
    function masterMintNFT(address to, string calldata uri) external onlyOwner returns (uint256) {
        require(ecoNftAddress != address(0), "EcoNFT not set");
        uint256 tokenId = IEcoNFT(ecoNftAddress).mint(to, uri);
        emit EcoNFTMinted(to, tokenId, uri);
        return tokenId;
    }

    /// @notice Get token IDs owned by a user (proxy to EcoNFT.tokensOf)
    function masterTokensOf(address user) external view returns (uint256[] memory) {
        require(ecoNftAddress != address(0), "EcoNFT not set");
        return IEcoNFT(ecoNftAddress).tokensOf(user);
    }

    /// @notice Get token URI (proxy to EcoNFT.tokenURI)
    function masterTokenURI(uint256 tokenId) external view returns (string memory) {
        require(ecoNftAddress != address(0), "EcoNFT not set");
        return IEcoNFT(ecoNftAddress).tokenURI(tokenId);
    }

    // ------------------------------------------------------------------
    // Section: Score management wrappers
    // ------------------------------------------------------------------
    /// @notice Set a user's score (only via master to ensure integrity)
    function masterSetScore(address user, uint256 score) external onlyOwner {
        require(scoreContractAddress != address(0), "Score contract not set");
        IGreenLedgerScore(scoreContractAddress).setScore(user, score);
        emit ScoreUpdated(user, score);
    }

    /// @notice Read a user's score
    function masterGetScore(address user) external view returns (uint256) {
        require(scoreContractAddress != address(0), "Score contract not set");
        return IGreenLedgerScore(scoreContractAddress).getScore(user);
    }

    // ------------------------------------------------------------------
    // Section: NFT Metadata wrappers
    // ------------------------------------------------------------------
    function masterSetMetadata(uint256 tokenId, string calldata data) external onlyOwner {
        require(metadataAddress != address(0), "Metadata contract not set");
        INFTMetadata(metadataAddress).setMetadata(tokenId, data);
        emit MetadataUpdated(tokenId, data);
    }

    function masterGetMetadata(uint256 tokenId) external view returns (string memory) {
        require(metadataAddress != address(0), "Metadata contract not set");
        return INFTMetadata(metadataAddress).getMetadata(tokenId);
    }

    // ------------------------------------------------------------------
    // Section: Reward distribution wrappers
    // ------------------------------------------------------------------
    function masterAssignReward(address user, uint256 amount) external onlyOwner {
        require(rewardDistributorAddress != address(0), "RewardDistributor not set");
        IRewardDistributor(rewardDistributorAddress).assignReward(user, amount);
        emit RewardAssigned(user, amount);
    }

    function masterRewardOf(address user) external view returns (uint256) {
        require(rewardDistributorAddress != address(0), "RewardDistributor not set");
        return IRewardDistributor(rewardDistributorAddress).rewardOf(user);
    }

    // ------------------------------------------------------------------
    // Section: ScoreCalculator wrapper
    // ------------------------------------------------------------------
    function masterCalculateScore(uint256 ecoActions, uint256 tokensHeld, uint256 nftsOwned) external view returns (uint256) {
        require(scoreCalculatorAddress != address(0), "ScoreCalculator not set");
        uint256 calculated = IScoreCalculator(scoreCalculatorAddress).calculateScore(ecoActions, tokensHeld, nftsOwned);
        return calculated;
    }

    // ------------------------------------------------------------------
    // Section: Utility / discovery helpers (informational)
    // ------------------------------------------------------------------
    function getAllAuxiliaryAddresses() external view returns (address[5] memory addrs) {
        addrs[0] = ecoNftAddress;
        addrs[1] = scoreContractAddress;
        addrs[2] = metadataAddress;
        addrs[3] = rewardDistributorAddress;
        addrs[4] = scoreCalculatorAddress;
    }

    // ------------------------------------------------------------------
    // End of MasterEcologicalContract
    // ------------------------------------------------------------------
}
