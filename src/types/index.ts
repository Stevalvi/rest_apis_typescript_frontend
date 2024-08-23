import { object, string, number, boolean, InferOutput, array } from "valibot"

export const DraftProductSchema = object({  // Son los únicos dos valores que necesitamos comprobar, ya que el id y la disponibilidad lo genera la base de datos.
    name: string(),
    price: number()
})

export const ProductSchema = object({
    id: number(),
    name: string(),
    price: number(),
    availability: boolean()
})

export const ProductsSchema = array(ProductSchema) // array para que nos genere un schema de arreglo con esos objetos, ya que ese data retorna un arreglo con objetos que contienen la información de cada producto de la base de datos.

export type Product = InferOutput<typeof ProductSchema> // Ese output toma el schema y lo convierte en type