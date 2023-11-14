/* Abre Tarjeta de Acciones */
let main_id
async function openCard(event) {
    main_id = event.target.id
    usuarios = await Usuario.getAllData();
    try {
        response = await fetch('../src/card-action.html');
        response = await response.text();
        document.querySelector('.modal-body').innerHTML = response;
        let accion = await Accion.readById(main_id)
        let programa = await Programa.readByIdAction(main_id)
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
            let card = document.querySelector('.card-slide-item--active');
            card.classList.remove('new-card')
            card.classList.add('old-card')
            document.getElementById(`id_${id}`).innerText = elem.id
            for (item in elem) {
                if (item.startsWith('fecha')) {
                    elem[item] = dateForInput(elem[item])
                }
                let testData = !!document.getElementById(`${item}_${id}`)
                if (testData) {
                    document.getElementById(`${item}_${id}`).value = elem[item]
                    document.getElementById(`${item}_${id}`).name = elem.id
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
/* Actualizar Acción */
async function updateAction() {
    let action = {}
    let dataForm = {action:{}, programa:[]}
    let formAction = document.getElementById('form-action')
    let formCierre = document.getElementById('form-cierre')
    let form_1 = formAction.querySelectorAll('.change-save');
    let form_2 = formCierre.querySelectorAll('.change-save');
    let inputs = [...form_1, ...form_2]
    inputs.forEach(input => {action[input.id] = input.value});

    let oldCard = document.querySelectorAll('.old-card');
    oldCard.forEach(elem => {
        let inputs = []
        let eachObjet = new Object()
        inputs = elem.querySelectorAll('.change-save');
        inputs.forEach(input => {
            let key = input.id;
            let indice = key.lastIndexOf("_");
            key = key.substring(0,indice)
            eachObjet['id'] = input.name
            eachObjet[key] = input.value
        })
        dataForm.programa.push(eachObjet);
    })
    Accion.updateById(main_id, action)
    for (elem of programa) {
        if(elem.id) {
            console.log(elem)
            Programa.updateById(elem.id, elem)
        }
        //console.log(item)
        //Programa.updateById(item.id,item)
    }
    let programasToCreate = new Array();
    let newCard = document.querySelectorAll('.new-card');
    newCard.forEach(elem => {
        let eachObjet = new Object()
        let inputs = elem.querySelectorAll('.form-select, .form-control');
        inputs.forEach(input => {
            eachObjet[input.id] = input.value
        })
        programasToCreate.push(eachObjet);
    })
    //Programa.createAndSave(programasToCreate)
  }
/* Programas */
/* Agregar programa de acción */
function addActionPlan() {
    /* Inicialza variables */
    let idCardActive;
    let id;
    let cardsItems = document.querySelectorAll('div[class*="card-slide-item"]');
    let quantityCardsItems = cardsItems.length;
    if (quantityCardsItems > 0) {
        let cardActive = document.querySelector('.card-slide-item--active');
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        idCardActive = cardsItems[quantityCardsItems - 1];
        idCardActive = Number(idCardActive.id)
        id = idCardActive + 1
    }
    else { id = 1 }
    const container = document.getElementById('actionProgram')
    let div = document.createElement('div');
    div.setAttribute('class', 'container p-2 mt-3 bg-body-tertiary card-slide-item--active new-card')
    div.setAttribute('id', id)
    let action = `
        <div class="d-flex justify-content-between">
            <h5><span>${id}°</span> Acción [id: <span id="id_${id}"></span>]</h5>
            <button type="button" class="btn btn-danger btn-sm item_${id}" onclick="deleteActionPlan()">
                <i class="bi bi-trash-fill item_${id}"></i>
            </button>
        </div>
        <div class="row g-1" >
            <div class="col-12">
                <label for="propuesta_${id}" class="col-form-label-sm text-secondary">Propuesta</label>
                <textarea class="form-control form-control-sm" rows="2" id="propuesta_${id}" required></textarea>
            </div>
            <div class="col-6">
                <label for="id_responsable_${id}" class="col-form-label-sm text-secondary">Responsable</label>
                <select class="form-select form-select-sm" id="id_responsable_${id}" required>
                    <option selected></option>
                </select>
            </div>
            <div class="col-6">
                <label for="fecha_plan_${id}" class="col-form-label-sm text-secondary">Fecha plan</label>
                <input class="form-control form-control-sm" id="fecha_plan_${id}" type="date">
            </div>
            <div class="col-12">
                <label for="met_verificacion_${id}" class="col-form-label-sm text-secondary">Metodología de Verificación</label>
                <textarea class="form-control form-control-sm" rows="2" id="met_verificacion_${id}" required></textarea>
            </div>
        </div>
        <div class="row g-1" >
            <div class="col-12">
                <label for="acciones_tomadas_${id}" class="col-form-label-sm text-secondary">Acción</label>
                <textarea id="acciones_tomadas_${id}" class="form-control form-control-sm" rows="2" required></textarea>
            </div>
            <div class="col-6">
                <label for="id_ejecuto_${id}" class="col-form-label-sm text-secondary">Quien ejecutó</label>
                <select id="id_ejecuto_${id}" class="form-select form-select-sm" required>
                    <option selected></option>
                </select>
            </div>
            <div class="col-6">
                <label for="fecha_ejecucion_${id}" class="col-form-label-sm text-secondary">Fecha ejecución</label>
                <input id="fecha_ejecucion_${id}" class="form-control form-control-sm" type="date">
            </div>
            <div class="col-12">
                <label for="res_verificacion_${id}" class="col-form-label-sm text-secondary">Resultados de Verificación</label>
                <textarea id="res_verificacion_${id}" class="form-control form-control-sm" rows="2" required></textarea>
            </div>
        </div>
        `;
    div.innerHTML = action;
    container.appendChild(div)
    loadInputsSelect(`id_responsable_${id}`, usuarios);
    loadInputsSelect(`id_ejecuto_${id}`, usuarios);
    let containerEdicion = document.getElementById('containerEdicion');
    listenerChangeEvent(containerEdicion);
    return id
}
/* Eliminar programa de acción */
function deleteActionPlan() {
    let cardActive = document.querySelector('.card-slide-item--active');
    cardActive.remove()
    let cardsItems = document.querySelectorAll('div[class*="card-slide-item"]');
    if (cardsItems.length > 0) {
        cardsItems[0].classList.remove('card-slide-item');
        cardsItems[0].classList.add('card-slide-item--active')
    }
}
/* Funcionalidad de botones para mostrar las acciones */
const previewAction = document.getElementById('previewAction');
const nextAction = document.getElementById('nextAction');
function getIndex() {
    let data = {}
    data['cardsItems'] = document.querySelectorAll('div[class*="card-slide-item"]');
    let quantityCardsItems = data.cardsItems.length
    for (i = 0; i < quantityCardsItems; i++) {
        if (data.cardsItems[i].classList.contains('card-slide-item--active')) {
            data['index'] = i;
        }
    }
    return data
}
function fPreviewAction() {
    let data = getIndex()
    let index = data.index;
    let cardsItems = data.cardsItems
    let cardActive = cardsItems[index]
    if (index + 1 > 1) {
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        let newCardActive = cardsItems[index - 1];
        newCardActive.classList.add('card-slide-item--active');
        newCardActive.classList.remove('card-slide-item');
    }
    else {

    }
}
function fNextAction() {
    let data = getIndex()
    let index = data.index;
    let cardsItems = data.cardsItems
    let cardActive = cardsItems[index]
    if (index + 1 != data.cardsItems.length) {
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        let newCardActive = cardsItems[index + 1]
        newCardActive.classList.add('card-slide-item--active');
        newCardActive.classList.remove('card-slide-item');
    }
}
/* Carga los datos para inputs de tipo select */
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