var programaData;
var dataToUpdate = new Array();
var dataToDelete = new Array();
const nombreHojaPrograma = 'PROGRAMA';
const rangoPrograma = `${nombreHojaPrograma}!A1:K`;

class Programa {
    constructor({ id_accion, id, fecha, acciones_planificadas, id_responsable, fecha_plan, acciones_tomadas, ejecuto_accion, fecha_ejecucion, met_verificacion, res_verificacion }) {
        this.id_accion = id_accion;
        this.id = id;
        this.fecha = fecha;
        this.acciones_planificadas = acciones_planificadas;
        this.id_responsable = id_responsable;
        this.fecha_plan = fecha_plan;
        this.acciones_tomadas = acciones_tomadas;
        this.ejecuto_accion = ejecuto_accion;
        this.fecha_ejecucion = fecha_ejecucion;
        this.met_verificacion = met_verificacion;
        this.res_verificacion = res_verificacion;
    }
    static async getHeaders() {
        let headers = (await loadedResourses(rangoPrograma))[0].map(item => item.toLocaleLowerCase());
        return headers
    }
    static async getAllData() {
        let response = await loadedResourses(rangoPrograma);
        programaData = arrayToObject(response);
        return programaData
    }
    static async createId() {
        try {
            let response = await loadedResourses(rangoPrograma);
            response.shift()
            let ids = response.map(item => {
                if (item[0] === undefined) {
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
            const newDeclaracion = new Programa(data);
            const newData = objectToArray(newDeclaracion, headers);
            await postData(rangoPrograma, newData);
            return newDeclaracion;
        } catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    // Función para leer (obtener) información de un área
    static async readByIdAction(id_accion) {
        try {
            programaData = await this.getAllData()
            let idInformation = programaData.filter(programa => programa.id_accion === id_accion)
            return idInformation
        }
        catch (error) {
            // Manejo de errores
            console.error("Error:", error);
            throw new Error("No se pudo crear y guardar el área.");
        }
    }
    static async readById(id) {
        try {
            programaData = await this.getAllData()
            let idInformation = programaData.find(programa => programa.id === id)
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
            programaData = await this.getAllData()
            let row = findIndexById(id, programaData) + 2
            for (let item in values) {
                dataToUpdate.push({
                    row: row,
                    column: findIndexByKey(item, programaData),
                    value: values[item]
                })
            }
            let data = createdDataToUpdate(dataToUpdate, nombreHojaPrograma);
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
            let programaData = await this.getAllData();
            let header = await this.getHeaders();
            dataToDelete.push({
                row: findIndexById(id, programaData) + 2,
                lastColumn: header.length,
            })
            let ranges = createdDataToDelete(dataToDelete, nombreHojaPrograma)
            let success = await deleteData(ranges);
            return success
        }
        catch (error) {

        }
    }
}