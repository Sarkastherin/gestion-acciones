const navbar = document.querySelector('#navbar')
const module = document.getElementsByTagName('body')
const nameIdModule = module[0].attributes.id.nodeValue;
const content = document.querySelector('main');
const rangoDeclaracion = 'DECLARACIÓN & ANÁLISIS!A1:H';
const rangoUsuarios = 'USUARIOS!A1:E';
const nombreHojaArea = 'AREAS'
const rangoAreas = `${nombreHojaArea}!A1:B`;
const tableActions = document.getElementById('table_accion');
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const footPage = document.getElementById('footPage')
let dataReverse;
let cantPag;
let headersDeclaracion;
let areas;
let idToEdit;
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
async function postData(range, data) {
  try {
    let response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      includeValuesInResponse: true,
      insertDataOption: "INSERT_ROWS",
      responseDateTimeRenderOption: "FORMATTED_STRING",
      responseValueRenderOption: "FORMATTED_VALUE",
      valueInputOption: "USER_ENTERED",
      resource: {
        majorDimension: "ROWS",
        range: "",
        values: [
          data
        ]
      }
    })
  } catch (e) {

  }
}
async function updateData(data) {
  try {
    let response = await gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        data: data,
        includeValuesInResponse: false,
        responseDateTimeRenderOption: "FORMATTED_STRING",
        responseValueRenderOption: "FORMATTED_VALUE",
        valueInputOption: "USER_ENTERED"
      }
    })
    response = response.status
    if (response === 200) {
      return true
    }
    else { return false }
  } catch (e) {
    console.log(e)
  }
}
async function deleteData(ranges) {
  try {
    let response = await gapi.client.sheets.spreadsheets.values.batchClear({
      spreadsheetId: spreadsheetId,
      resource: {
        ranges: ranges
      }
    })
    response = response.status
    if (response === 200) {
      return true
    }
    else { return false }
  } catch (e) {
    console.log(e)
  }
}
const itemsPerPage = 10;
let currentPage = 0;
async function loadedWindow() {
  content.removeAttribute('hidden', '');
  try {
    let data = await loadedResourses(rangoDeclaracion);
    areas = await loadedResourses(rangoAreas)
    headersDeclaracion = data.shift();
    dataReverse = data.reverse();
    tableActions.innerHTML = '';
    loadTablePage(currentPage, dataReverse)
  } catch (e) {
    console.log(e)
  }
}

function loadTablePage(page, data) {
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  tableActions.innerHTML = '';
  for (let i = start; i < end && i < data.length; i++) {
    let area = getArea(data[i][3]);
    area = area[0]
    tableActions.innerHTML += `
      <tr>
        <th class="cell-center" scope="row">${data[i][0]}</th>
        <td class="cell-center">${data[i][1]}</td>
        <td class="">${data[i][2]}</td>
        <td class="">${area[1]}</td>
        <td>${data[i][4]}</td>
        <td class="cell-center">
        <i class="bi bi-pen-fill btn-icon" data-bs-toggle="modal" data-bs-target="#Modal" onclick="editAct(event)" id="${data[i][0]}"></i>
          
        </td>
      </tr>`
  }
  if (page !== 0) {
    prevButton.removeAttribute('disabled', '')
  }
  else {
    prevButton.setAttribute('disabled', '')
  }
  cantPag = Math.ceil(data.length / itemsPerPage)
  footPage.innerText = `Pág ${currentPage + 1} de ${cantPag}`;
}
prevButton.addEventListener('click', async () => {
  let data = dataReverse
  if (currentPage > 0) {
    currentPage--;
    loadTablePage(currentPage, data);
  }
});

nextButton.addEventListener('click', async () => {
  let data = dataReverse
  if (currentPage < Math.ceil(data.length / itemsPerPage) - 1) {
    currentPage++;
    loadTablePage(currentPage, data);
  }
});
/* Filtro */
let search = document.getElementById('search');
search.addEventListener('click', loadTableFilter)
async function loadTableFilter() {
  let filtro = {
    id: document.getElementById('find_by_id').value,
    type_of_action: document.getElementById('find_by_type_of_action').value,
    area: document.getElementById('find_by_area').value,
    key_word: document.getElementById('find_by_key_word').value
  }
  try {
    let data = await loadedResourses(rangoDeclaracion);
    data.shift();
    data = data.filter(item => {
      /* ID | ACCIÓN | ÁREA | KEY */
      if (item[0].includes(filtro.id) &&
        item[2].includes(filtro.type_of_action) &&
        item[3].includes(filtro.area) &&
        item[4].includes(filtro.key_word)) {
        return item
      }
    })
    data = data.reverse()
    dataReverse = data;
    loadTablePage(currentPage, dataReverse)
  } catch (e) {
    console.log(e)
  }
}
async function editAct(event) {
  var id = event.target.id
  var dataFromId;
  try {
    dataFromId = dataReverse.filter(item => {
      return item[0] === id
    })
    dataFromId = dataFromId[0]
    idToEdit = dataFromId[0]
    await load(dataFromId, headersDeclaracion)
  } catch (e) {
  }
}
function createdDataToUpdate(arr, sheet) {
  /* arr = [{row, colum, value}] */
  let data = new Array()
  for (item of arr) {
    data.push({
      majorDimension: "ROWS",
      range: `${sheet}!R${item.row}C${item.column}`,
      values: [
        [item.value]
      ]
    })
  }
  return data
}
function createdDataToDelete(arr, sheet) {
  /* arr = [{row, colum}] */
  let ranges = new Array()
  for (item of arr) {
    ranges.push(`${sheet}!R${item.row}C1:R${item.row}C${item.lastColumn}`)
  }
  return ranges
}
function getArea(id) {
  let dataArea = areas.filter(area => {
    return area[0] == id
  })
  return dataArea
}