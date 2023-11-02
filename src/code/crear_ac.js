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
