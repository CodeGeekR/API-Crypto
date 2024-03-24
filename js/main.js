// Función para obtener los datos de la API
async function obtenerDatos() {
  try {
    const response = await axios.get('https://api4.binance.com/api/v3/ticker/24hr');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Función para filtrar los datos
function filtrarDatos(data) {
  const symbols = ['BTCUSDT', 'BTCUSDT', 'AVAXUSDT', 'FILUSDT', 'FETUSDT', 'ADAUSDT', 'STORJUSDT', 'SOLUSDT', 'LTCUSDT', 'OCEANUSDT'];
  return data.filter(item => symbols.includes(item.symbol));
}

// Función para ordenar los datos por volumen
function ordenarDatos(data) {
  return data.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
}

// Función para crear un card con los datos de una criptomoneda
function crearCard(cripto) {
  // Convertir los precios a dos decimales y agregar el símbolo del dólar
  const lastPrice = parseFloat(cripto.lastPrice).toFixed(2);
  const priceChange = parseFloat(cripto.priceChange).toFixed(2);
  const volume = parseFloat(cripto.volume).toFixed(2);

  // Determinar el color del lastPrice
  const lastPriceColor = lastPrice >= 0 ? 'text-success' : 'text-danger';

  return `
    <div class="col-md-4 mb-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-uppercase font-weight-bold">${cripto.symbol}</h5>
          <p class="card-text"><span class="font-weight-bold">Último precio:</span> <span class="${lastPriceColor}">$${lastPrice}</span></p>
          <p class="card-text"><span class="font-weight-bold">Cambio de precio:</span> $${priceChange}</p>
          <p class="card-text"><span class="font-weight-bold">Volumen:</span> $${volume}</p>
        </div>
      </div>
    </div>
  `;
}

// Función principal para cargar los datos y mostrarlos en cards
async function cargarDatos() {
  try {
    let datos = await obtenerDatos();
    datos = filtrarDatos(datos);
    datos = ordenarDatos(datos);
    let cards = "";

    datos.forEach((cripto) => {
      cards += crearCard(cripto);
    });

    document.getElementById("cardsContainer").innerHTML = cards;
  } catch (error) {
    console.error(error);
  }
}

// Evento click para el botón "Cargar Datos"
document.getElementById("cargarDatos").addEventListener("click", cargarDatos);
