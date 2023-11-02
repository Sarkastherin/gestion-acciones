/* Declarar variables */
let num = 1;
let btn_save = document.getElementById('saveChanges');
/* Agregar campo para plan de acción */
function addPlanning() {
    let form = document.getElementById('planAccion_form')
    let planHTML = `
    <div class="row mb-2 plan-action-header">
        <div class="col">
            <p class="lead plan-action-title"><strong>Acción Planificada ${num}</strong></p>
        </div>
        <div class="col-auto">
            <button type="button" class="btn btn-danger btn-sm plan_ac_${num} plan-action-btn-del" onclick="removePlan(event)">
                <i class="bi bi-trash-fill plan_ac_${num}"></i>
            </button>
        </div>
    </div>
    <textarea class="form-control mb-2 plan-action-descrip plan-action-item_${num}" id="accion_a_tomar_${num}" rows="2"
        placeholder="Acción a tomar" required></textarea>
    <div class="row g-2">
        <div class="col">
            <select class="form-select mb-2 plan-action-resp plan-action-item_${num}" id="responsable_ac_${num}" required>
                <option selected>Responsable</option>
                <option value="Juan Doe">Juan Doe</option>
                <option value="Jaen Doe">Jaen Doe</option>
            </select>
        </div>
        <div class="col">
            <input type="date" id="fecha_plan${num}" class="form-control plan-action-fplan plan-action-item_${num}">
        </div>
    </div>`
    let div = document.createElement('div');
    div.setAttribute('class', `col num_plan_ac_${num} plan-action`);
    div.innerHTML=planHTML;
    form.appendChild(div)
    num = num + 1
}
/* Eliminar campo para plan de acción */
function removePlan(event) {
    let typeClass;
    let classArr = event.target.classList
    for (item of classArr) {
        if(item.startsWith('plan_ac_')) {
            typeClass = item
        }
    }
    let node = document.querySelector(`.num_${typeClass}`)
    console.log(node)
    node.remove()
}
class Planes {
    constructor(id_accion, accion_plan,responsable_accion_plan,fecha_plan){
        this.id_accion = id_accion;
        this.accion_plan = accion_plan;
        this.responsable_accion_plan = responsable_accion_plan;
        this.fecha_plan = fecha_plan;
    }
}
/* Guardar cambios */
btn_save.addEventListener('click',save);
function save() {
    /* Planes de acción */
    let plan = {descripcion: [], responsable: [], fecha_plan: []};
    let descripcion = document.querySelectorAll('.plan-action-descrip');
    let responsable = document.querySelectorAll('.plan-action-resp');
    let fecha_plan = document.querySelectorAll('.plan-action-fplan');

    // Iterar sobre los elementos y almacenar los valores en el objeto plan
    descripcion.forEach(item => {
        plan.descripcion.push(item.value);
    });
    responsable.forEach(item => {
        plan.responsable.push(item.value);
    });
    fecha_plan.forEach(item => {
        plan.fecha_plan.push(item.value);
    });

    console.log(plan);
}

async function postData(range, data) {
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.append({
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
      console.log(response)
      if (response.status == 200) {
        return true
      }
      else { return false }
    } catch (e) {
      console.log(e)
      let code = e.result.error.code
      error_400(code)
    }
  }