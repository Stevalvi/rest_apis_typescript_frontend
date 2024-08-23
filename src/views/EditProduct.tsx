import { Link, Form, useActionData, ActionFunctionArgs, redirect, LoaderFunctionArgs, useLoaderData } from "react-router-dom" // Este Form es para procesar la entrada de datos en un formulario, y ese Form nos permite el acceso a una propiedad que se llama method para definirle el método. Y en ese Form podemos definir una función que vamos a añadirle a ese router.tsx para que se conecte el formulario a esa action o función.
import ErrorMessage from "../components/ErrorMessage"
import { getProductById, updateProduct } from "../services/ProductService"
import { Product } from "../types"
import ProductForm from "../components/ProductForm"

export async function loader({params} : LoaderFunctionArgs) { // Con ese params obtenemos el id al cuál le estamos dando en editar.
    if(params.id !== undefined) { // Comprobamos que no sea undefined
        const product = await getProductById(+params.id) // Cuándo visitemos esa url, va a hacer la consulta a nuestra api. Convertimos ese params.id en number para que lo reciba de esa forma y no como string, ya que la base de datos lo envía como string.
        if(!product) { // Si no existe ese producto
            return redirect('/')
        }
        return product // Pero si todo sale bien retornamos el producto
    }
}

export async function action({request, params} : ActionFunctionArgs) { // En esta función procesamos todos los datos del formulario. En ese Form podemos definir una función que vamos a añadirle a ese router.tsx, en este caso es esta función de action, para que se conecte esta función con este Form. De esa forma cuándo enviemos ese formulario con sus valores, se manda a llamar esta función. De esa forma se conectan los tres, el componente, la función y nuestro router. Anteriormente para recuperar esos datos enviados desde el formulario se hacía con useState, en la nueva versión de React Router se hace con action y se le pasa el parámetro {request}. Siempre que tengamos un action y ese {request} le pasamos ese type de ActionFunctionArgs. Extraemos esos params que contiene la información de ese producto, de esa forma accedemos a lo que el usuario ingresa en el formulario al actualizarlo.

  const data = Object.fromEntries(await request.formData()) // De esa forma recuperamos esos valores del formulario. Y eso nos retorna el name y el price, esos name los toma del input del formulario, para eso se usan esos name.
  
  let error = ''
  if(Object.values(data).includes('')) { // Si al menos un campo del formulario está vaçio
    error = 'Todos los campos son obligatorios'
  }

  if(error.length) { // Si error tiene algo retornamos ese error, de esa forma al retornarlo lo estamos pasando o permitimos usar este error para mostrarlo en el componente, ya que esta función de action es aparte de nuestro componente NewProduct
    return error
  }

  // Si pasamos la validación mandamos a llamar esta función que se comunica con nuestra api del backend, luego verifica por medio de valibot que se cumpla ese schema de lo que envíamos y lo que esperamos en nuestra REST API, si todo sale bien se hace la petición post en el backend en el archivo server.ts en la parte de cors donde habilitamos el dominio del frontend, y ya se almacena el producto en la base de datos, luego de hacer todo eso, vuelve acá, y se ejecuta ese return redirect('/') para redireccionar al usuario.

  if(params.id !== undefined) { // Si params.id no es undefined ejecutamos esto:
     await updateProduct(data, +params.id) // Le colocamos await porque queremos esperar a que se ejecute esta función y realice todo lo que debe hacer para poder ejecutar ese return de abajo, de esa forma evitamos es error de tener ese return {}. Extraemos ese params con el id que contiene la información de ese producto, de esa forma accedemos a lo que el usuario ingresa en el formulario al actualizarlo.

    return redirect('/') // Los action siempren deben retornar algo, si no sabemos que vamos a retornar, de momento colocamos return {} para evitar errores. En este caso, cuándo se ejecute esa función de addProduct y que creen los productos y se almacenen en la base de datos, queremos redireccionar al usuario a la página principal.
  }
}

const availabilityOptions = [
   { name: 'Disponible', value: true},
   { name: 'No Disponible', value: false}
]

export default function EditProduct() {

    const product = useLoaderData() as Product // Con useLoaderData() obtenemos ese producto y lo mostramos en cada input con ese defaultValue, de esa forma se llena en automático ese formulario con la info el producto

  // En el momento que retornamos algo en nuestras acciones, están disponibles de vuelta en el componente por medio de un hook llamado useActionData
    const error = useActionData() as string // Para que no lo marque como unknown, le asignamos que es un string.
    

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-4xl font-black text-slate-500">Editar producto</h2>
        <Link
          to="/"
          className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
        >
          Volver a productos
        </Link>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form
        className="mt-10"
        method='POST'
      >
      
        <ProductForm
          product={product}
        />

        <div className="mb-4">
          <label
              className="text-gray-800"
              htmlFor="availability"
          >Disponibilidad:</label>
          <select 
              id="availability"
              className="mt-2 block w-full p-3 bg-gray-50"
              name="availability"
              defaultValue={product?.availability.toString()}
          >
              {availabilityOptions.map(option => ( // Iteramos sobre cada disponibilidad y le asignamos el value como string ya que esa disponibilidad era un boolean
                <option key={option.name} value={option.value.toString()}>{option.name}</option>
              ))}
          </select>
        </div>
        <input
          type="submit"
          className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
          value="Guardar cambios"
        />
      </Form>
    </>
  )
}
