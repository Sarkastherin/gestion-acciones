class Area {
    constructor({id, nombre}) {
        this.id = id;
        this.nombre = nombre;
    }
    static async getHeaders() {
        let headers = (await loadedResourses(rangoAreas))[0].map(item => item.toLocaleLowerCase());
        return headers
    }
    static async getAllDataAreas() {
        let response = await loadedResourses(rangoAreas);
        let arrArea = arrayToObject(response);
        return arrArea
    }
    // Función para crear una nueva área
    static async createAndSaveArea(data) {
        try {
            const headers = await this.getHeaders()
            const newArea = new Area(data);
            const newData = objectToArray(newArea, headers);
            await postData(rangoAreas, newData);
            return newArea;
        } catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    // Función para leer (obtener) información de un área
    static async readAreaById(id) {
        try {
            let arrArea = await this.getAllDataAreas()            
            let idInformation = arrArea.find(area => area.id === id)
            return idInformation
        }
        catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    // Función para actualizar el nombre de un área por su ID
    static async updateArea(id, newName) {
        let listIdInformation = new Array()
        try {
            let arrArea = await this.getAllDataAreas()
            let idInformation  = arrArea.find(area => area.id === id);
            idInformation.nombre = newName;
            idInformation['row'] = findIndexById(id,arrArea) + 2; //Se suma 2; 1 por el header y otro porque que las filas empiezan desde el num 1
            idInformation['column'] = findIndexByKey('nombre',arrArea);
            /* Cambia el nombre de la key 'nombre' pos 'value' */
            let valorNombre = idInformation.nombre;
            delete idInformation.nombre;
            idInformation.value = valorNombre
            /* Agrega el objeto a una lista para iterarlo en createData() */
            listIdInformation = [idInformation]
            let data = createdDataToUpdate(listIdInformation, nombreHojaArea);
            let success = await updateData(data);
            return success
        }
        catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }

    // Función para eliminar un área por su ID
    static async deleteArea(id) {
        let listIdInformation = new Array()
        try {
            let arrArea = await this.getAllDataAreas();
            let header = await this.getHeaders() 
            let idInformation  = arrArea.find(area => area.id === id);
            idInformation['row'] = findIndexById(id,arrArea) + 2;
            idInformation['lastColumn'] = header.length;
            listIdInformation = [idInformation]
            let ranges = createdDataToDelete(listIdInformation, nombreHojaArea)
            let success = await deleteData(ranges);
            return success
        }
        catch (error) {

        }
    }
    static eliminarAreaPorId(listaAreas, id) {
        const indice = listaAreas.findIndex(area => area.id === id);
        if (indice !== -1) {
            listaAreas.splice(indice, 1);
            return true; // Retorna true si se eliminó el área
        }
        return false; // Retorna false si el área no se encontró
    }
}
function objectToArray(obj, arr) {
    for (item in obj) {
        if (arr.includes(item)) {
        arr[arr.indexOf(item)] = obj[item]
        }
    }
    return arr
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
function findIndexById(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i; // Devuelve el índice donde se encuentra el id
        }
    }
    return -1; // Si no se encuentra el id, retorna -1
}
function findIndexByKey(key, array) {
    let newArray = array[0];
    newArray = Object.keys(newArray)
    return newArray.indexOf(key) + 1
}
