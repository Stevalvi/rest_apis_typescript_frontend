import { safeParse, number, parse, pipe, string, transform } from 'valibot';// Instalamos valibot con npm i valibot para validar que los datos que estemos enviando desde el formulario cumplan con lo requerido de nuestra api, para poder enviarlo a la REST API.
import axios from "axios";
import { DraftProductSchema, ProductsSchema, Product, ProductSchema } from "../types"
import { toBoolean } from '../utils';

type ProductData = {
    [k: string]: FormDataEntryValue;
}
// Los services son los que interactúan con nuestra api del backend.
export async function addProduct(data : ProductData) {// Con eso obtenemos los valores que se envíen desde el formulario
    try {
        const result = safeParse(DraftProductSchema, { // Son los únicos dos valores que necesitamos comprobar, ya que el id y la disponibilidad lo genera la base de datos. safeParse es para validar y comparar esos valores.
            name: data.name,
            price: +data.price // Convertimos ese price en number
        })
        if(result.success) {
            const url = `${import.meta.env.VITE_API_URL}/api/products` // Asignamos nuestra variable de entorno que contiene la url
            
            // Hacemos peticiones de tipo post con axios.
            await axios.post(url, { // Este await va a esperar a que se realice la petición
                name: result.output.name,
                price: result.output.price
            }) // El primer parámetro es la url, el segundo son los datos que queremos enviar y el tercero es la configuración.
        } else {
            throw new Error('Datos no válidos')
        }
    } catch (error) {
        console.log(error)
    }
}

// Tiene que ser asíncrona porque va a interactuar con nuestra api.
export async function getProducts() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products` // Asignamos nuestra variable de entorno que contiene la url
        const { data } = await axios(url) // Hacemos el llamado para obtener esos datos y por defecto el método es get, por eso no lo especificamos.
        const result = safeParse(ProductsSchema, data.data) // Verificamos que ese data.data cumpla con lo que tenemos en el schema.
        if(result.success) {
            return result.output // Valibot lo coloca en este objeto
        } else {
            throw new Error('Hubo un error...')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getProductById(id : Product['id']) { // Obtener producto por su id
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}` // Asignamos nuestra variable de entorno que contiene la url
        const { data } = await axios(url) // Hacemos el llamado para obtener esos datos y por defecto el método es get, por eso no lo especificamos.
        const result = safeParse(ProductSchema, data.data) // Verificamos que ese data.data cumpla con lo que tenemos en el schema.
        if(result.success) {
            return result.output // Valibot lo coloca en este objeto
        } else {
            throw new Error('Hubo un error...')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updateProduct(data : ProductData, id: Product['id']) {// Toma data que es lo que el usuario ingresa en el formulario y también toma el id porque necesita saber que es lo que debe actualizar.
    
    // Validamos la actualización con ZOD antes de enviar esa actualización a la api
    try {
        const NumberSchema = pipe(string(), transform(Number), number()) // Esto lo que va a hacer es forzar a que entre un dato y lo convierta a número. Este coerce funciona bien con strings, fechas y numbers pero no con booleans.

        const result = safeParse(ProductSchema, {
            id,
            name: data.name,
            price: parse(NumberSchema, data.price), // parse es una función de valibot, le pasamos el schema que definimos y lo que queremos convertir a Number
            availability: toBoolean(data.availability.toString()) // Para que lo convierta en string
        })

        if (result.success) {
            const url = `${import.meta.env.VITE_API_URL}/api/products/${id}` // Asignamos nuestra variable de entorno que contiene la url
            await axios.put(url, result.output) // De esa forma ya van a estar limpios esos datos con valibot, de esa forma ya se actualizan correctamente esos datos y se reflejan los cambios.
        }
    } catch (error) {
        console.log(error)
    }   
}

export async function deleteProduct(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.delete(url)
    } catch (error) {
        console.log(error)
    }
}

export async function updateProductAvailability(id : Product['id']) {
    try {
         const url = `${import.meta.env.VITE_API_URL}/api/products/${id}`
        await axios.patch(url) // Put es para actualizar todos los elementos, patch es para actualizar algo específico de forma parcial, es decir, queremos actualizar únicamente la disponibilidad, que lo hacemos en la base de datos con los valores que ya tenemos. No lo hacemos con algo que nosotros enviemos.
    } catch (error) {
        console.log(error)
    }
}