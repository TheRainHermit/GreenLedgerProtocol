```markdown
# 🌿 GreenLedger Protocol

*Sustainability Scoring System with Automated Rewards*

## 🎯 What is GreenLedger?

GreenLedger is a modular protocol that allows companies to measure, verify, and be rewarded for their sustainable practices through:

- **📊 Dynamic EcoScore**: Scoring system (0-100) based on environmental metrics
- **🎁 PYUSD Rewards**: Automatic incentives for good practices
- **🔒 Verified Data**: Encrypted storage with Lighthouse
- **🤖 Automation**: Automatic execution with EVVM Relayer
- **📈 Real-Time Dashboard**: Analytics with Envio + Blockscout

## 🚀 Quick Start

### Backend API (Python)

```bash
cd backend
python3 simple_server.py
```

**🌐 Open**: http://localhost:8000

### Available Endpoints

- `GET /health` - Server status
- `GET /api/v1/rewards/leaderboard` - Companies ranking
- `GET /api/v1/scores/{company_id}` - Company EcoScore
- `POST /api/v1/datacoins/upload` - Upload environmental metrics
- `POST /api/v1/rewards/distribute` - Distribute PYUSD rewards

## 🏗️ Tech Stack

| Technology Layer | Stack |
|------------------|-------|
| **Smart Contracts** | Solidity, Hardhat |
| **Payments** | PYUSD, EVVM |
| **Data Storage** | Lighthouse, Envio |
| **Backend** | Python HTTP Server |
| **Frontend** | Next.js, Blockscout SDK |
| **Oracles** | Pyth Network |

## 📈 System Flow

1. **Company uploads environmental metrics** → Lighthouse Data Coins
2. **Protocol calculates EcoScore (0-100)** → Smart Contract
3. **System distributes PYUSD rewards** → EVVM Automation
4. **Dashboard shows results** → Envio + Blockscout
5. **Dynamic NFT updates certification** → On-chain metadata

## 🎯 Use Cases

- **Companies**: Measure and improve sustainability + receive rewards
- **Consumers**: Verify brands' environmental commitment
- **Investors**: Identify certified sustainable companies
- **Governments**: Green economy incentive program

## 📊 Live Demo

The backend server includes a live demo with:

✅ **Interactive Web Interface**  
✅ **RESTful API Endpoints**  
✅ **Mock Environmental Data**  
✅ **Rewards Calculation**  
✅ **Company Leaderboard**  
✅ **EcoScore Analytics**  

### Test Commands

```bash
# Health check
curl http://localhost:8000/health

# Get leaderboard
curl http://localhost:8000/api/v1/rewards/leaderboard

# Upload environmental data
curl -X POST http://localhost:8000/api/v1/datacoins/upload \
  -H "Content-Type: application/json" \
  -d '{"company_id": "test_company", "metric_type": "carbon_emissions", "value": 1250.5, "unit": "kg_co2", "timestamp": "2024-10-11T12:00:00Z"}'
```

## 🗂️ Project Structure

```
GreenLedgerProtocol/
├── backend/                    # ✅ Python API Server (FUNCTIONAL)
│   ├── simple_server.py        # Main HTTP server
│   ├── api/routes/             # FastAPI routes (advanced)
│   ├── services/               # Business logic services
│   ├── start.sh               # Quick start script
│   └── README.md              # Backend documentation
├── contracts/                  # Smart contracts
├── frontend/                   # Next.js frontend
├── scripts/                    # Deployment scripts
└── docs/                      # Documentation
```

---

*Built for ETHGlobal Online Hackathon*

```
