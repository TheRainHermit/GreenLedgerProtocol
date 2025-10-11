#!/usr/bin/env python3
"""
GreenLedger Protocol - API Server
Simple HTTP server using Python standard library
"""

import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

class GreenLedgerHandler(BaseHTTPRequestHandler):
    """HTTP request handler for GreenLedger API"""
    
    def _set_headers(self, status_code=200, content_type='application/json'):
        """Set response headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def _send_json_response(self, data, status_code=200):
        """Send JSON response"""
        self._set_headers(status_code)
        response = json.dumps(data, indent=2, ensure_ascii=False)
        self.wfile.write(response.encode('utf-8'))
    
    def _send_html_response(self, html, status_code=200):
        """Send HTML response"""
        self._set_headers(status_code, 'text/html; charset=utf-8')
        self.wfile.write(html.encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self._set_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        # Página principal
        if path == '/':
            self._send_html_response(self._get_home_page())
        
        # Health check
        elif path == '/health':
            health_data = {
                "status": "healthy",
                "version": "1.0.0",
                "services": {
                    "lighthouse": "active",
                    "rewards": "active",
                    "notifications": "active",
                    "evvm_relayer": "active"
                },
                "timestamp": datetime.now().isoformat()
            }
            self._send_json_response(health_data)
        
        # Leaderboard
        elif path == '/api/v1/rewards/leaderboard':
            limit = int(query_params.get('limit', [10])[0])
            leaderboard_data = self._get_mock_leaderboard(limit)
            self._send_json_response(leaderboard_data)
        
        # EcoScore de empresa
        elif path.startswith('/api/v1/scores/'):
            company_id = path.split('/')[-1]
            if company_id and company_id != 'scores':
                score_data = self._get_mock_company_score(company_id)
                self._send_json_response(score_data)
            else:
                self._send_json_response({"error": "Company ID requerido"}, 400)
        
        # Data Coins de empresa
        elif path.startswith('/api/v1/datacoins/company/'):
            company_id = path.split('/')[-1]
            if company_id:
                datacoins_data = self._get_mock_company_datacoins(company_id)
                self._send_json_response(datacoins_data)
            else:
                self._send_json_response({"error": "Company ID requerido"}, 400)
        
        # Endpoints informativos
        elif path == '/api/v1/datacoins/metrics/types':
            metrics_data = self._get_metric_types()
            self._send_json_response(metrics_data)
        
        elif path == '/api/v1/rewards/stats':
            stats_data = self._get_rewards_stats()
            self._send_json_response(stats_data)
        
        else:
            self._send_json_response({
                "error": "Endpoint no encontrado",
                "available_endpoints": [
                    "GET /",
                    "GET /health",
                    "GET /api/v1/rewards/leaderboard",
                    "GET /api/v1/scores/{company_id}",
                    "GET /api/v1/datacoins/company/{company_id}",
                    "POST /api/v1/datacoins/upload",
                    "POST /api/v1/rewards/distribute"
                ]
            }, 404)
    
    def do_POST(self):
        """Manejar requests POST"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Leer datos del request
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            post_data = self.rfile.read(content_length)
            try:
                json_data = json.loads(post_data.decode('utf-8'))
            except:
                json_data = {}
        else:
            json_data = {}
        
        # Upload de Data Coin
        if path == '/api/v1/datacoins/upload':
            upload_result = self._upload_datacoin(json_data)
            self._send_json_response(upload_result)
        
        # Distribución de recompensas
        elif path == '/api/v1/rewards/distribute':
            distribution_result = self._distribute_rewards()
            self._send_json_response(distribution_result)
        
        # Cálculo de EcoScore
        elif path.startswith('/api/v1/scores/calculate/'):
            company_id = path.split('/')[-1]
            calculation_result = self._calculate_score(company_id, json_data)
            self._send_json_response(calculation_result)
        
        else:
            self._send_json_response({"error": "Endpoint POST no encontrado"}, 404)
    
    def _get_home_page(self):
        """Página principal HTML"""
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>🌿 GreenLedger Protocol</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; padding: 20px; border-radius: 10px; }
                .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                .method-get { color: #4CAF50; font-weight: bold; }
                .method-post { color: #2196F3; font-weight: bold; }
                .demo-button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px; cursor: pointer; }
                .demo-button:hover { background: #45a049; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌿 GreenLedger Protocol API</h1>
                <p>Sistema de scoring de sostenibilidad con recompensas automatizadas</p>
            </div>
            
            <h2>📊 Endpoints Disponibles</h2>
            
            <div class="endpoint">
                <span class="method-get">GET</span> <strong>/health</strong> - Estado del servidor
                <button class="demo-button" onclick="testEndpoint('/health')">Probar</button>
            </div>
            
            <div class="endpoint">
                <span class="method-get">GET</span> <strong>/api/v1/rewards/leaderboard</strong> - Ranking de empresas
                <button class="demo-button" onclick="testEndpoint('/api/v1/rewards/leaderboard')">Probar</button>
            </div>
            
            <div class="endpoint">
                <span class="method-get">GET</span> <strong>/api/v1/scores/{company_id}</strong> - EcoScore de empresa
                <button class="demo-button" onclick="testEndpoint('/api/v1/scores/empresa_verde_1')">Probar</button>
            </div>
            
            <div class="endpoint">
                <span class="method-get">GET</span> <strong>/api/v1/datacoins/company/{company_id}</strong> - Data Coins de empresa
                <button class="demo-button" onclick="testEndpoint('/api/v1/datacoins/company/empresa_verde_1')">Probar</button>
            </div>
            
            <div class="endpoint">
                <span class="method-post">POST</span> <strong>/api/v1/datacoins/upload</strong> - Subir métricas ambientales
                <button class="demo-button" onclick="uploadDatacoin()">Probar</button>
            </div>
            
            <div class="endpoint">
                <span class="method-post">POST</span> <strong>/api/v1/rewards/distribute</strong> - Distribuir recompensas
                <button class="demo-button" onclick="testEndpoint('/api/v1/rewards/distribute', 'POST')">Probar</button>
            </div>
            
            <h2>🚀 Tecnologías</h2>
            <ul>
                <li><strong>Backend:</strong> Python (servidor HTTP nativo)</li>
                <li><strong>Smart Contracts:</strong> Solidity, Hardhat</li>
                <li><strong>Pagos:</strong> PYUSD, EVVM</li>
                <li><strong>Almacenamiento:</strong> Lighthouse</li>
                <li><strong>Oráculos:</strong> Pyth Network</li>
            </ul>
            
            <div id="result" style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px; display: none;">
                <h3>Resultado:</h3>
                <pre id="result-content"></pre>
            </div>
            
            <script>
                async function testEndpoint(endpoint, method = 'GET') {
                    try {
                        const response = await fetch(endpoint, { method });
                        const data = await response.json();
                        showResult(JSON.stringify(data, null, 2));
                    } catch (error) {
                        showResult('Error: ' + error.message);
                    }
                }
                
                async function uploadDatacoin() {
                    const data = {
                        "company_id": "empresa_verde_1",
                        "metric_type": "carbon_emissions",
                        "value": 1250.5,
                        "unit": "kg_co2",
                        "timestamp": new Date().toISOString()
                    };
                    
                    try {
                        const response = await fetch('/api/v1/datacoins/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        const result = await response.json();
                        showResult(JSON.stringify(result, null, 2));
                    } catch (error) {
                        showResult('Error: ' + error.message);
                    }
                }
                
                function showResult(content) {
                    document.getElementById('result').style.display = 'block';
                    document.getElementById('result-content').textContent = content;
                }
            </script>
        </body>
        </html>
        '''
    
    def _get_mock_leaderboard(self, limit):
        """Mock del leaderboard"""
        companies = [
            {"rank": 1, "company_id": "empresa_verde_1", "company_name": "EcoTech Solutions", "eco_score": 92.5, "total_rewards": 2500.50},
            {"rank": 2, "company_id": "empresa_verde_2", "company_name": "Sustainable Industries", "eco_score": 87.3, "total_rewards": 1800.25},
            {"rank": 3, "company_id": "empresa_verde_3", "company_name": "Green Manufacturing Co", "eco_score": 78.9, "total_rewards": 1200.75},
            {"rank": 4, "company_id": "empresa_verde_4", "company_name": "Clean Energy Corp", "eco_score": 65.2, "total_rewards": 850.00},
        ]
        
        return {
            "success": True,
            "leaderboard": companies[:limit],
            "total_companies": len(companies),
            "generated_at": datetime.now().isoformat()
        }
    
    def _get_mock_company_score(self, company_id):
        """Mock del EcoScore de empresa"""
        return {
            "success": True,
            "company_id": company_id,
            "current_score": 87.3,
            "previous_score": 85.0,
            "score_change": 2.3,
            "ranking_position": 12,
            "total_companies": 156,
            "last_updated": datetime.now().isoformat(),
            "score_breakdown": {
                "carbon_emissions": 25.2,
                "energy_efficiency": 21.8,
                "waste_management": 17.5,
                "water_conservation": 13.1,
                "renewable_energy": 9.7
            }
        }
    
    def _get_mock_company_datacoins(self, company_id):
        """Mock de Data Coins de empresa"""
        datacoins = [
            {
                "lighthouse_hash": "QmExample1234567890abcdef",
                "metric_type": "energy_consumption",
                "value": 5000.0,
                "unit": "kwh",
                "timestamp": "2024-10-10T08:00:00Z"
            },
            {
                "lighthouse_hash": "QmExample0987654321fedcba",
                "metric_type": "carbon_emissions", 
                "value": 1250.5,
                "unit": "kg_co2",
                "timestamp": "2024-10-11T10:30:00Z"
            }
        ]
        
        return {
            "success": True,
            "company_id": company_id,
            "total_datacoins": len(datacoins),
            "datacoins": datacoins
        }
    
    def _upload_datacoin(self, data):
        """Mock de upload de Data Coin"""
        return {
            "success": True,
            "lighthouse_hash": "QmMockHash1234567890abcdef",
            "ipfs_url": f"https://gateway.lighthouse.storage/ipfs/QmMockHash1234567890abcdef",
            "company_id": data.get("company_id"),
            "metric_type": data.get("metric_type"),
            "uploaded_at": datetime.now().isoformat()
        }
    
    def _distribute_rewards(self):
        """Mock de distribución de recompensas"""
        return {
            "success": True,
            "distribution_date": datetime.now().isoformat(),
            "total_distributed": 4,
            "total_amount": 5350.50,
            "distributions": [
                {"company_id": "empresa_verde_1", "amount": 2500.50, "eco_score": 92.5},
                {"company_id": "empresa_verde_2", "amount": 1800.25, "eco_score": 87.3},
                {"company_id": "empresa_verde_3", "amount": 1200.75, "eco_score": 78.9},
                {"company_id": "empresa_verde_4", "amount": 850.00, "eco_score": 65.2}
            ]
        }
    
    def _calculate_score(self, company_id, data):
        """Mock de cálculo de EcoScore"""
        return {
            "success": True,
            "company_id": company_id,
            "calculated_score": 89.2,
            "previous_score": 87.3,
            "score_change": 1.9,
            "datacoins_processed": len(data.get("datacoins", [])),
            "calculated_at": datetime.now().isoformat()
        }
    
    def _get_metric_types(self):
        """Tipos de métricas soportadas"""
        return {
            "success": True,
            "metric_types": [
                {"type": "energy_consumption", "name": "Consumo de Energía", "units": ["kwh", "mwh"]},
                {"type": "carbon_emissions", "name": "Emisiones de Carbono", "units": ["kg_co2", "tons_co2"]},
                {"type": "water_usage", "name": "Uso de Agua", "units": ["liters", "m3"]},
                {"type": "waste_generation", "name": "Generación de Residuos", "units": ["kg", "tons"]},
                {"type": "renewable_energy_percentage", "name": "% Energía Renovable", "units": ["percentage"]},
                {"type": "recycling_rate", "name": "Tasa de Reciclaje", "units": ["percentage"]}
            ]
        }
    
    def _get_rewards_stats(self):
        """Estadísticas de recompensas"""
        return {
            "success": True,
            "stats": {
                "total_distributed_ever": 147500.75,
                "current_month_distributed": 10000.0,
                "total_recipients": 156,
                "active_recipients_this_month": 42,
                "average_reward": 238.09,
                "next_distribution_date": "2024-11-01T00:00:00Z",
                "currency": "PYUSD",
                "last_updated": datetime.now().isoformat()
            }
        }

def run_server():
    """Start the server"""
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    
    server_address = (host, port)
    httpd = HTTPServer(server_address, GreenLedgerHandler)
    
    print("Starting GreenLedger Protocol Backend...")
    print(f"Server: http://{host}:{port}")
    print(f"Documentation: http://{host}:{port}/")
    print("Press Ctrl+C to stop")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()