import { useNavigate, Form, ActionFunctionArgs, redirect, useFetcher } from "react-router-dom"
import { Product } from "../types"
import { formatCurrency } from "../utils"
import { deleteProduct } from "../services/ProductService"

type ProductDetailsProps = {
  product: Product
}

export async function action({params} : ActionFunctionArgs) {

  if(params.id !== undefined) {
    await deleteProduct(+params.id) // Ese await para que la siguiente linea no se ejecute hasta que realice esa acción de eliminar el producto.

    return redirect('/') // Luego de ejecutar este action que elimina ese producto, es decir, al presionar en ese botón de eliminar, nos mantenemos en la página principal para que no lo lleve a la url de eliminar.
  }
}

export default function ProductDetails({product} : ProductDetailsProps) { // Este componente es el que muestra la información de nuestros productos

  const fetcher = useFetcher() // Gracias a ese fetcher cuándo demos click en la disponibilidad de cada producto nos va a mandar al action de Products.tsx que se encarga de cambiar dinámicamente esa disponibilidad de Disponible a No disponible y visceversa. Sin tener que redireccionar al usuario, gracias a fetcher. Y para usarlo él tiene su componente, en este caso lo agregamos en el return.

  const navigate = useNavigate()
  
  const isAvailable = product.availability

  return (
    <tr className="border-b ">
        <td className="p-3 text-lg text-gray-800">
          {product.name}
        </td>
        <td className="p-3 text-lg text-gray-800">
          { formatCurrency(product.price) }
        </td>
        <td className="p-3 text-lg text-gray-800">
        
          <fetcher.Form method='POST'>
            <button
              type="submit"
              name="id"
              value={product.id}
              className={`${isAvailable ? 'text-black' : 'text-red-600'} rounded-lg p-2 text-xs uppercase font-bold w-full border border-black-100 hover:cursor-pointer`}
            >
              {isAvailable ? 'Disponible' : 'No disponible'}
          </button>
          </fetcher.Form>
          
        </td>
        <td className="p-3 text-lg text-gray-800 ">
          <div className="flex gap-2 items-center">
          <button onClick={() => navigate(`/productos/${product.id}/editar`)} className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center">
              Editar
          </button>
          
          <Form className="w-full" method='POST' action={`productos/${product.id}/eliminar`} onSubmit={ (e) => {
            if( !confirm('¿Eliminar?')) { // Para confirmar si desea eliminar el producto. Estamos negando esa condición porque si damos en cancelar cuando aparezca esa alerta de confirmación, al darle cancelar estamos preveniendo la acción por default y no se ejecuta el action, en cambio, si damos en aceptar, no se previene la action por default y entonces se ejecuta el action que elimina ese producto.
              e.preventDefault()
            }
          }}>
            <input
              type="submit"
              value='Eliminar'
              className="bg-red-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center"
            />
          </Form>
          </div>
        </td>
    </tr> 
  )
}
