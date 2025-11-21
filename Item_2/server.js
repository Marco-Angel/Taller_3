const express = require('express');
const app = express();
const PORT = 3000;

let jugadores = [];
let contadorJugadores = 0;

// Página principal
app.get('/', (req, res) => {
  const hostname = process.env.HOSTNAME || 'localhost';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Juego Multijugador K8s</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .container {
                background: rgba(255, 255, 255, 0.95);
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            h1 { 
                color: #667eea; 
                margin-bottom: 10px;
                font-size: 2.5em;
            }
            .pod-info {
                background: #f7fafc;
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
            .pod-name {
                font-weight: bold;
                color: #2d3748;
                font-size: 1.1em;
            }
            .jugadores {
                font-size: 1.2em;
                color: #4a5568;
                margin: 15px 0;
            }
            button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 40px;
                font-size: 1.1em;
                border-radius: 50px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                font-weight: bold;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
            }
            button:active {
                transform: translateY(0);
            }
            #mensaje {
                margin-top: 20px;
                padding: 15px;
                border-radius: 10px;
                font-weight: bold;
            }
            .exito {
                background: #c6f6d5;
                color: #22543d;
            }
            .lista-jugadores {
                margin-top: 20px;
                text-align: left;
                background: #edf2f7;
                padding: 15px;
                border-radius: 10px;
            }
            .jugador-item {
                padding: 8px;
                margin: 5px 0;
                background: white;
                border-radius: 5px;
                border-left: 3px solid #667eea;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎮 Juego Multijugador</h1>
            <div class="pod-info">
                <div class="pod-name">Pod: ${hostname}</div>
            </div>
            <div class="jugadores">
                👥 Jugadores conectados: <strong>${jugadores.length}</strong>
            </div>
            <button onclick="conectarJugador()">
                🚀 Conectar como Jugador
            </button>
            <div id="mensaje"></div>
            <div id="listaJugadores" class="lista-jugadores" style="display:none;">
                <h3>Jugadores en este Pod:</h3>
                <div id="jugadoresContenido"></div>
            </div>
        </div>
        
        <script>
            function conectarJugador() {
                fetch('/conectar')
                    .then(response => response.json())
                    .then(data => {
                        const mensaje = document.getElementById('mensaje');
                        mensaje.className = 'exito';
                        mensaje.innerHTML = '✅ ' + data.mensaje + '<br>Pod: ' + data.pod;
                        
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error al conectar');
                    });
            }
            
            // Actualizar lista de jugadores cada 3 segundos
            setInterval(() => {
                fetch('/jugadores')
                    .then(r => r.json())
                    .then(data => {
                        if(data.jugadores.length > 0) {
                            document.getElementById('listaJugadores').style.display = 'block';
                            const contenido = data.jugadores.map(j => 
                                '<div class="jugador-item">👤 ' + j + '</div>'
                            ).join('');
                            document.getElementById('jugadoresContenido').innerHTML = contenido;
                        }
                    });
            }, 3000);
        </script>
    </body>
    </html>
  `);
});

// Endpoint para conectar un jugador
app.get('/conectar', (req, res) => {
  contadorJugadores++;
  const jugadorId = `Jugador-${contadorJugadores}`;
  jugadores.push(jugadorId);
  
  console.log(`✅ ${jugadorId} conectado al pod ${process.env.HOSTNAME || 'localhost'}`);
  console.log(`📊 Total de jugadores en este pod: ${jugadores.length}`);
  
  res.json({
    mensaje: `¡Bienvenido ${jugadorId}!`,
    pod: process.env.HOSTNAME || 'localhost',
    totalJugadores: jugadores.length
  });
});

// Endpoint para obtener lista de jugadores
app.get('/jugadores', (req, res) => {
  res.json({
    jugadores: jugadores,
    pod: process.env.HOSTNAME || 'localhost'
  });
});

app.listen(PORT, () => {
  console.log(`🎮 Servidor del juego iniciado en puerto ${PORT}`);
  console.log(`🏷️  Pod: ${process.env.HOSTNAME || 'localhost'}`);
});