var areasData;
var dataToUpdate = new Array();
var dataToDelete = new Array();
/* sheetName
   Range */

class Area {
    constructor({id, nombre}) {
        this.id = id;
        this.nombre = nombre
    }
    static async getHeaders() {
        let headers = (await loadedResourses(rangoAreas))[0].map(item => item.toLocaleLowerCase());
        return headers
    }
    static async getAllData() {
        let response = await loadedResourses(rangoAreas);
        areasData = arrayToObject(response);
        return areasData
    }
    static async createId() {
        try {
            let response = await loadedResourses(rangoAreas);
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
    static async readById(id) {
        try {
            areasData = await this.getAllData()            
            let idInformation = areasData.find(area => area.id === id)
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
            areasData = await this.getAllData()
            let row = findIndexById(id,areasData) + 2
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: findIndexByKey(item,areasData),
                    value: values[item]
                })
            }
            let data = createdDataToUpdate(dataToUpdate, nombreHojaArea);
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
            let areasData = await this.getAllData();
            let header = await this.getHeaders();
            dataToDelete.push({
                row: findIndexById(id,areasData) + 2,
                lastColumn: header.length,
            })
            let ranges = createdDataToDelete(dataToDelete, nombreHojaArea)
            let success = await deleteData(ranges);
            return success
        }
        catch (error) {

        }
    }
}