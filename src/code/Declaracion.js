var declaracionData;
var dataToUpdate = new Array();
var dataToDelete = new Array();
/* sheetName
   range */

class Declaracion {
    constructor({id, fecha, tipo_accion, id_area, descripcion, causa_raiz, impacto_cliente_sgc, id_usuario}) {
        this.id = id;
        this.fecha = fecha;
        this.tipo_accion = tipo_accion;
        this.id_area = id_area;
        this.descripcion = descripcion;
        this.causa_raiz = causa_raiz;
        this.impacto_cliente_sgc = impacto_cliente_sgc;
        this.id_usuario = id_usuario;
    }
    static async getHeaders() {
        let headers = (await loadedResourses(rangoDeclaracion))[0].map(item => item.toLocaleLowerCase());
        return headers
    }
    static async getAllData() {
        let response = await loadedResourses(rangoDeclaracion);
        declaracionData = arrayToObject(response);
        return declaracionData
    }
    static async createId() {
        try {
            let response = await loadedResourses(rangoDeclaracion);
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
            data['fecha'] = getDate()
            data['id'] = await this.createId();
            const headers = await this.getHeaders()
            const newDeclaracion = new Declaracion(data);
            const newData = objectToArray(newDeclaracion, headers);
            await postData(rangoDeclaracion, newData);
            return newDeclaracion;
        } catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    // Función para leer (obtener) información de un área
    static async readById(id) {
        try {
            declaracionData = await this.getAllData()            
            let idInformation = declaracionData.find(area => area.id === id)
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
            declaracionData = await this.getAllData()
            let row = findIndexById(id,declaracionData) + 2
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: findIndexByKey(item,declaracionData),
                    value: values[item]
                })
            }
            let data = createdDataToUpdate(dataToUpdate, nombreHojaDeclaracion);
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
            let declaracionData = await this.getAllData();
            let header = await this.getHeaders();
            dataToDelete.push({
                row: findIndexById(id,declaracionData) + 2,
                lastColumn: header.length,
            })
            let ranges = createdDataToDelete(dataToDelete, nombreHojaDeclaracion)
            let success = await deleteData(ranges);
            return success
        }
        catch (error) {

        }
    }
}