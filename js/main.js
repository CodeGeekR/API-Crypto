// Función para obtener los datos de la API
async function obtenerDatos() {
  try {
    const response = await axios.get('https://api4.binance.com/api/v3/ticker/24hr');
    const symbolsResponse = await axios.get('./data/ticket.json');
    return { data: response.data, symbols: symbolsResponse.data };
  } catch (error) {
    console.error(error);
  }
}

// Función para filtrar los datos
function filtrarDatos(data, symbols) {
  return data.filter(item => symbols.map(s => s.symbol).includes(item.symbol));
}

// Función para ordenar los datos por ID
function ordenarDatos(data, symbols) {
  return data.sort((a, b) => symbols.find(s => s.symbol === a.symbol).id - symbols.find(s => s.symbol === b.symbol).id);
}

// Función para crear una tarjeta con los datos de una criptomoneda
function crearCard(cripto) {
  // Convertir los precios a dos decimales y agregar el símbolo del dólar
  const lastPrice = parseFloat(cripto.lastPrice).toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const priceChangePercent = parseFloat(cripto.priceChangePercent).toFixed(2);
  const priceChange = parseFloat(cripto.priceChange).toFixed(3);
  const volume = parseFloat(cripto.volume).toFixed(2);

  // Determinar el color del lastPrice y priceChangePercent
  const lastPriceColor = priceChange >= 0 ? 'text-success' : 'text-danger';
  const priceChangePercentColor = priceChangePercent >= 0 ? 'text-success' : 'text-danger';

  return `
    <div class="col-md-4 mb-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-uppercase font-weight-bold">${cripto.symbol}</h5>
          <p class="card-text"><span class="font-weight-bold">Último precio:</span> <span class="${lastPriceColor}">$${lastPrice}</span></p>
          <p class="card-text"><span class="font-weight-bold">Cambio de precio porcentual:</span> <span class="${priceChangePercentColor}">${priceChangePercent}%</span></p>
          <p class="card-text"><span class="font-weight-bold">Cambio de precio:</span> $${priceChange}</p>
          <p class="card-text"><span class="font-weight-bold">Volumen:</span> ${volume}</p>
        </div>
      </div>
    </div>
  `;
}

//* codigo para el Loading Bar
// Obtén el elemento de la barra de carga
const loadingBar = document.querySelector('.loading-bar');

// Oculta la barra de carga al inicio
loadingBar.style.display = 'none';

// Modifica el evento click para el botón "Cargar Datos"
document.getElementById("cargarDatos").addEventListener("click", async () => {
  // Muestra la barra de carga
  loadingBar.style.display = 'block';

  // Llama a la función cargarDatos
  await cargarDatos();

  // Oculta la barra de carga cuando los datos se han cargado
  loadingBar.style.display = 'none';
});

// Función principal para cargar los datos y mostrarlos en cards
async function cargarDatos() {
  try {
    let { data, symbols } = await obtenerDatos();
    data = filtrarDatos(data, symbols);
    data = ordenarDatos(data, symbols);
    let cards = "";

    data.forEach((cripto) => {
      cards += crearCard(cripto);
    });

    document.getElementById("cardsContainer").innerHTML = cards;
  } catch (error) {
    console.error(error);
  }
}
