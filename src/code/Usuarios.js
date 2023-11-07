var usuariosData;
var dataToUpdate = new Array();
var dataToDelete = new Array()

class Usuario {
    constructor({id, nombre, apellido, alias, rol}) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.alias = alias;
        this.rol = rol
    }
    static async getHeaders() {
        let headers = (await loadedResourses(rangoUsuarios))[0].map(item => item.toLocaleLowerCase());
        return headers
    }
    static async getAllData() {
        let response = await loadedResourses(rangoUsuarios);
        usuariosData = arrayToObject(response);
        return usuariosData
    }
    static async createId() {
        try {
            let response = await loadedResourses(rangoUsuarios);
            response.shift()
            let ids = response.map(item => {
                if(item[0]===undefined){
                    return 0
                }
                else {
                    return Number(item[0])
                }
            })
            let lastId = Math.max(...ids)
            return lastId + 1

        } catch (error) {

        }
    }
    // Función para crear una nueva área
    static async createAndSave(data) {
        try {
            data['id'] = await this.createId();
            const headers = await this.getHeaders()
            const newUsuario = new Usuario(data);
            const newData = objectToArray(newUsuario, headers);
            await postData(rangoUsuarios, newData);
            return newUsuario;
        } catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    // Función para leer (obtener) información de un área
    static async readById(id) {
        try {
            usuariosData = await this.getAllData()            
            let idInformation = usuariosData.find(usuario => usuario.id === id)
            return idInformation
        }
        catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    // Función para actualizar el nombre de un área por su ID
    static async updateById(id, values) {
        try {
            usuariosData = await this.getAllData()
            let row = findIndexById(id,usuariosData) + 2
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: findIndexByKey(item,usuariosData),
                    value: values[item]
                })
            }
            let data = createdDataToUpdate(dataToUpdate, nombreHojaUsuario);
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
    static async deleteById(id) {
        try {
            let usuariosData = await this.getAllData();
            let header = await this.getHeaders();
            dataToDelete.push({
                row: findIndexById(id,usuariosData) + 2,
                lastColumn: header.length,
            })
            let ranges = createdDataToDelete(dataToDelete, nombreHojaUsuario)
            let success = await deleteData(ranges);
            return success
        }
        catch (error) {

        }
    }
}

