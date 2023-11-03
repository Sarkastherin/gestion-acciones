class Area {
    constructor({id, nombre}) {
        this.id = id;
        this.nombre = nombre;
    }

    // Función para crear una nueva área
    static crearArea(id, nombre) {
        return new Area(id, nombre);
    }

    // Función para leer (obtener) información de un área
    static obtenerAreaPorId(listaAreas, id) {
        return listaAreas.find(area => area.id === id);
    }

    // Función para actualizar el nombre de un área por su ID
    static actualizarNombreDeArea(listaAreas, id, nuevoNombre) {
        const area = listaAreas.find(area => area.id === id);
        if (area) {
            area.nombre = nuevoNombre;
            return area;
        }
        return null; // O puedes manejar el caso donde el área no se encuentra
    }

    // Función para eliminar un área por su ID
    static eliminarAreaPorId(listaAreas, id) {
        const indice = listaAreas.findIndex(area => area.id === id);
        if (indice !== -1) {
            listaAreas.splice(indice, 1);
            return true; // Retorna true si se eliminó el área
        }
        return false; // Retorna false si el área no se encontró
    }
}

  
async function agregarArea(data) {
    let headers;
    try {
        headers = await loadedResourses(rangoAreas);
        headers = headers.shift()
        headers = headers.map(item => item.toLocaleLowerCase())
        let nuevaArea = Area.crearArea(data);
        let nuevaData = transformData(nuevaArea, headers);
        await postData(rangoAreas,nuevaData)
    } catch (e) {

    }
}
function transformData(obj, arr) {
    for (item in obj) {
        if (arr.includes(item)) {
        arr[arr.indexOf(item)] = obj[item]
        }
    }
    return arr
}