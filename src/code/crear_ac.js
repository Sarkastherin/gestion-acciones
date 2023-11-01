
let num = 1;
async function load(data,headers) {
    let response;
    let obj = new Object();
    try {
        response = await fetch('../src/crear_ac.html');
        response = await response.text();
        document.querySelector('.modal-body').innerHTML = response;
        let inputUsers = document.getElementById('id_usuario')
        let inputAreas = document.getElementById('id_area')
        await loadUsers(inputUsers);
        await loadArea(inputAreas)        
    } catch (error) {
        // Captura cualquier error que ocurra en el bloque try
        console.error('Error:', error);
        // Puedes mostrar un mensaje de error o realizar acciones adicionales aquí
    }
    headers = headers.map(item => { return item.toLowerCase() });
    for (i = 0; i < data.length; i++) {
        obj[headers[i]] = data[i]
    }
    let inputs = document.querySelectorAll('.getInput');
    for(let input of inputs) {
        if(obj.hasOwnProperty(input.id)){
            input.value = obj[input.id]
        }
    }
}
async function loadUsers(input) {
    try {
        let usuarios = await loadedResourses(rangoUsuarios);
        usuarios.shift();
        usuarios.map(user => {
            let node = document.createElement("option");
            let textnode = document.createTextNode(user[1] + ' ' + user[2]);
            node.setAttribute('value', user[0]);
            input.appendChild(node);
            node.appendChild(textnode)
        })
    }
    catch (e) {
        input.innerHTML = '<option selected>⚠️ No se ha podido cargar los datos ⚠️</option>'
    }
}
async function loadArea(input) {
    try {
        let areas = await loadedResourses(rangoAreas);
        areas.shift();
        areas.map(user => {
            let node = document.createElement("option");
            let textnode = document.createTextNode(user[1]);
            node.setAttribute('value', user[0]);
            input.appendChild(node);
            node.appendChild(textnode)
        })
    }
    catch (e) {
        input.innerHTML = '<option selected>⚠️ No se ha podido cargar los datos ⚠️</option>'
    }
}
async function findElementById(range, id) {
    let response
    try {
        response = await loadedResourses(range) //Data
        response = response.filter(item => { //Filtar por id
            return item[0] == id
        })
        response = response[0];
        return response //retorna toda la info del id
    } catch (e) {
        console.log(e)
    }
}
function addPlanning() {
    let form = document.getElementById('form_plan')
    let planHTML = `
        <div class="row mb-2">
            <div class="col">
                <p class="lead"><strong>Acción Planificada ${num}</strong></p>
            </div>
            <div class="col-auto">
            <button type="button" class="btn btn-danger btn-sm">
                <i class="bi bi-trash-fill"></i>
            </button>
            </div>
        </div>
        <textarea class="form-control mb-2" id="accion_a_tomar_${num}" rows="2"
            placeholder="Acción a tomar" required></textarea>
        <select class="form-select mb-2" id="responsable_ac_${num}" required>
            <option selected>Responsable</option>
        </select>`
    let div = document.createElement('div');
    div.setAttribute('class','col');
    div.innerHTML=planHTML;
    form.appendChild(div)
    num = num + 1
}