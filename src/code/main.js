const module = document.getElementsByTagName('body')
const nameIdModule = module[0].attributes.id.nodeValue;
const content = document.querySelector('main');

const nombreHojaUsuario = 'USUARIOS'
const rangoUsuarios = `${nombreHojaUsuario}!A1:E`;
const nombreHojaArea = 'AREAS'
const rangoAreas = `${nombreHojaArea}!A1:B`;

const nombreHojaConslusion = 'CONCLUSIONES';
const rangoConslusion = `${nombreHojaConslusion}!A1:D`;
const tableActions = document.getElementById('table_accion');
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const footPage = document.getElementById('footPage');
let usuarios;
let id
let dataReverse;
let cantPag;
let areas;
//let idToEdit;
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
  try {
    areas = await loadedResourses(rangoAreas);
    content.removeAttribute('hidden', '');
    let data = await Accion.getAllData()
    dataReverse = data.reverse();
    loadTablePage(currentPage, dataReverse)
  } catch (e) {

  }
}
function loadTablePage(page, data) {
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  tableActions.innerHTML = '';
  for (let i = start; i < end && i < data.length; i++) {
    let area = getArea(data[i].id_area)[0];
    tableActions.innerHTML += `
      <tr>
        <th class="cell-center" scope="row">${data[i].id}</th>
        <td class="cell-center">${data[i].fecha}</td>
        <td class="">${data[i].tipo_accion}</td>
        <td class="">${area[1]}</td>
        <td>${data[i].descripcion}</td>
        <td class="cell-center">
        <i class="bi bi-pen-fill btn-icon" data-bs-toggle="modal" data-bs-target="#Modal" onclick="readyAction(event)" id="${data[i].id}"></i>
          
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
    let data = await loadedResourses(rangoAccion);
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
/* Leer Tarjeta de Acciones */
async function readyAction(event) {
  id = event.target.id
  usuarios = await Usuario.getAllData();
  try {
    response = await fetch('../src/crear_ac.html');
    response = await response.text();
    document.querySelector('.modal-body').innerHTML = response;
    let accion = await Accion.readById(id)
    let programa = await Programa.readByIdAction(id)
    let areas = await Area.getAllData();
    loadInputsSelect('id_area', areas)
    loadInputsSelect('id_usuario', usuarios);
    loadInputsSelect('id_aprueba', usuarios);
    for (item in accion) {
      if (item.startsWith('fecha')) {
        accion[item] = dateForInput(accion[item])
      }
      let testData = !!document.getElementById(item);
      if (testData) {
        document.getElementById(item).value = accion[item]
      }
    }
    for (elem of programa) {
      let id = addActionPlan();
      document.getElementById(`id_${id}`).innerText = elem.id
      for(item in elem){
        if (item.startsWith('fecha')) {
          elem[item] = dateForInput(elem[item])
        }
        let testData = !!document.getElementById(`${item}_${id}`)
        if(testData) {
          document.getElementById(`${item}_${id}`).value = elem[item]
        }
      }
    }
  } catch (e) {
  } finally {
    let containerEdicion = document.getElementById('containerEdicion');
    listenerChangeEvent(containerEdicion)
    containerEdicion.removeAttribute('hidden')
    
  }
}
function listenerChangeEvent(body) {
  let list = body.querySelectorAll('.form-select, .form-control')
  list.forEach(item => {
    item.addEventListener('change', (event) => {
      console.log(event.target.value)
    })
  })
}
/* Actualizar Acción */
async function updateAction() {
  console.log(id)
}
async function loadInputsSelect(idInput, data) {
  let input = document.getElementById(idInput);
  data.map(item => {
    let option = document.createElement('option');
    let textOption = document.createTextNode(item.nombre);
    option.appendChild(textOption);
    option.setAttribute('value', item.id);
    input.appendChild(option)
  })
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
/* Funciones para el manejo de clases */
function objectToArray(obj, arr) {
  console.log(arr.includes('fecha'))
  for (item in obj) {
    if (arr.includes(item)) {
      arr[arr.indexOf(item)] = obj[item]
    }
  }
  return arr
}
function findIndexById(id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i; // Devuelve el índice donde se encuentra el id
    }
  }
  return -2; // Si no se encuentra el id, retorna -2
}
function findIndexByKey(key, array) {
  let newArray = array[0];
  newArray = Object.keys(newArray)
  return newArray.indexOf(key) + 1
}
function arrayToObject(arr) {
  // Obtenemos los encabezados del array
  var headers = arr[0];
  // Creamos un nuevo array para almacenar los objetos transformados
  var newData = [];
  // Iteramos desde 1 para evitar el primer elemento que son los encabezados
  for (var i = 1; i < arr.length; i++) {
    var obj = {};
    // Iteramos a través de cada elemento del array actual
    for (var j = 0; j < headers.length; j++) {
      // Usamos los encabezados como claves y asignamos los valores correspondientes
      obj[headers[j].toLowerCase()] = arr[i][j];
    }
    newData.push(obj); // Agregamos el objeto al nuevo array
  }
  return newData; // Devolvemos el nuevo array de objetos
}
function getDate() {
  var fecha = new Date(); //Fecha actual
  var mes = fecha.getMonth() + 1; //obteniendo mes
  var dia = fecha.getDate(); //obteniendo dia
  var ano = fecha.getFullYear(); //obteniendo año
  if (dia < 10)
    dia = '0' + dia; //agrega cero si el menor de 10
  if (mes < 10)
    mes = '0' + mes //agrega cero si el menor de 10
  return `${dia}/${mes}/${ano}`
}
function dateForInput(date) {
  let splitDate = date.split('/');
  let newFormatDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  return newFormatDate
}