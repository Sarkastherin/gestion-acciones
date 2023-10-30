const navbar = document.querySelector('#navbar')
const module = document.getElementsByTagName('body')
const nameIdModule = module[0].attributes.id.nodeValue;
const content = document.querySelector('main');
const rangoDeclaracion = 'DECLARACIÓN & ANÁLISIS!A1:G';
const tableActions = document.getElementById('table_accion') 
function loadNavbar() {
    navbar.innerHTML = `
    <nav class="d-flex justify-content-between">
        <div class="nav-brand d-flex align-items-center">
            <img src="./assets/icons/control-de-calidad.png" alt="logo" class="h-100">
            <a href="./index.html" class="nav-brand-text" id="link_home">Gestión de acciones</a>
        </div>
        <ul class="nav-menu ">
            <li><a href="./crear_ac.html" class="nav-link" id="link_crear_ac">Crear acción</a></li>
            <li><a href="./gestionar_ac.html" class="nav-link" id="link_gestionar_ac">Gestionar acción</a></li>
        </ul>
    </nav>` ;
    let linkActive = document.getElementById(`link_${nameIdModule}`);
    linkActive.classList.add('nav-link-active')
}
async function loadedResourses(range) {
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
      let data = response.result.values
      return data
    } catch (e) {
      let code = e.result.error.code
      error_400(code)
    }
  }
async function loadedWindow() {
    content.removeAttribute('hidden', '');
    let data;
    try {
        data = await loadedResourses(rangoDeclaracion);
        data.shift();

        console.log(data);
    } catch (e) {
        console.log(e)
    }
}