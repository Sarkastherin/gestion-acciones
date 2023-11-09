/* Funcionalidad de botones para mostrar las acciones */
const previewAction = document.getElementById('previewAction');
const nextAction = document.getElementById('nextAction'); 
function getIndex() {
    let data = {}
    let index;
    data['cardItems'] = document.querySelectorAll('div[class*="card-slide-item"]');
    let quantityCardsItems = data.cardItems.length
    for (i = 0 ; i<quantityCardsItems ; i++) {
        if(data.cardItems[i].classList.contains('card-slide-item--active')){
            data['index'] = i;
        }
    }
    return data
}
previewAction.addEventListener('click', () => {
    let data = getIndex()
    let index = data.index;
    let cardItems = data.cardItems
    /* let cardItems = document.querySelectorAll('div[class*="card-slide-item"]');
    let quantityCardsItems = cardItems.length
    for (i = 0 ; i<quantityCardsItems ; i++) {
        if(cardItems[i].classList.contains('card-slide-item--active')){
            index = i;
        }
    } */
    let cardActive = cardItems[index]
    //let numCardActive = Number(cardActive.id);
    if (index + 1 > 1) {
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        let newCardActive = cardItems[index-1];
        newCardActive.classList.add('card-slide-item--active');
        newCardActive.classList.remove('card-slide-item');
    }
    else {

    }
})
nextAction.addEventListener('click', () => {
    let data = getIndex()
    let index = data.index;
    let cardItems = data.cardItems
    /* let cardItems = document.querySelectorAll('div[class*="card-slide-item"]');
    let quantityCardsItems = cardItems.length
    for (i = 0 ; i<quantityCardsItems ; i++) {
        if(cardItems[i].classList.contains('card-slide-item--active')){
            index = i;
        }
    } */
    let cardActive = cardItems[index]
    //let numCardActive = Number(cardActive.id);
    if (index + 1 != quantityCardsItems) {
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        let newCardActive = cardItems[index+1]
        newCardActive.classList.add('card-slide-item--active');
        newCardActive.classList.remove('card-slide-item');
    }
})
/* Agregar acción */
function addActionPlan() {
    let idCardActive;
    let id;
    let cardsItems = document.querySelectorAll('div[class*="card-slide-item"]');
    let quantityCardsItems = cardsItems.length;
    if(quantityCardsItems > 0) {
        let cardActive = document.querySelector('.card-slide-item--active');
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        idCardActive = cardsItems[quantityCardsItems-1];
        console.log(idCardActive)
        idCardActive = Number(idCardActive.id)
        id = idCardActive + 1
    }
    else { id = 1}
    console.log(id)
    const container = document.getElementById('actionProgram')
    let div = document.createElement('div');
    div.setAttribute('class', 'container p-2 mt-3 bg-body-tertiary card-slide-item--active')
    div.setAttribute('id', id)
    let action = `
        <div class="d-flex justify-content-between">
            <h5><span>${id}°</span> Acción [id: ]</h5>
            <button type="button" class="btn btn-danger btn-sm item_${id}" onclick="deleteActionPlan()">
                <i class="bi bi-trash-fill item_${id}"></i>
            </button>
        </div>
        <div class="row g-1" >
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Propuesta</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Responsable</label>
                <select class="form-select form-select-sm" id="id_usuario" required>
                    <option selected></option>
                </select>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Fecha plan</label>
                <input class="form-control form-control-sm" type="date">
            </div>
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Metodología de Verificación</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
        </div>
        <div class="row g-1" >
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Acción</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Quien ejecutó</label>
                <select class="form-select form-select-sm" id="id_usuario" required>
                    <option selected></option>
                </select>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Fecha ejecución</label>
                <input class="form-control form-control-sm" type="date" value="2023-01-12">
            </div>
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Resultados de Verificación</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
        </div>
        `;
    div.innerHTML = action;
    container.appendChild(div)
    /* let cardActive = document.querySelector('.card-slide-item--active');
    console.log(cardActive)
    let idCardActive = cardActive.id
    let cardItems = document.querySelectorAll('div[class*="card-slide-item"]');
    let numCardItems = cardItems.length;
    let id = numCardItems + 1;
    if(id > 1) {
        let cardActive = document.querySelector('.card-slide-item--active');
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
    }
    const container = document.getElementById('actionProgram')
    let div = document.createElement('div');
    div.setAttribute('class', 'container p-2 mt-3 bg-body-tertiary card-slide-item--active')
    div.setAttribute('id', idCardActive + 1)
    let action = `
        <div class="d-flex justify-content-between">
            <h5><span>${id}°</span> Acción [id: ]</h5>
            <button type="button" class="btn btn-danger btn-sm item_${id}" onclick="deleteActionPlan()">
                <i class="bi bi-trash-fill item_${id}"></i>
            </button>
        </div>
        <div class="row g-1" >
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Propuesta</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Responsable</label>
                <select class="form-select form-select-sm" id="id_usuario" required>
                    <option selected></option>
                </select>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Fecha plan</label>
                <input class="form-control form-control-sm" type="date">
            </div>
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Metodología de Verificación</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
        </div>
        <div class="row g-1" >
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Acción</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Quien ejecutó</label>
                <select class="form-select form-select-sm" id="id_usuario" required>
                    <option selected></option>
                </select>
            </div>
            <div class="col-6">
                <label class="col-form-label-sm text-secondary">Fecha ejecución</label>
                <input class="form-control form-control-sm" type="date" value="2023-01-12">
            </div>
            <div class="col-12">
                <label class="col-form-label-sm text-secondary">Resultados de Verificación</label>
                <textarea class="form-control form-control-sm" rows="2" required></textarea>
            </div>
        </div>
        `;
    div.innerHTML = action;
    container.appendChild(div)  */ 
}
 function deleteActionPlan() {
    let cardActive = document.querySelector('.card-slide-item--active');
    cardActive.remove()
    let cardItems = document.querySelectorAll('div[class*="card-slide-item"]');
    if(cardItems.length>0) {
        cardItems[0].classList.remove('card-slide-item');
        cardItems[0].classList.add('card-slide-item--active')
    }
 }