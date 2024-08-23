import { ActionFunctionArgs, Link, useLoaderData } from "react-router-dom" // Con ese Link se navega hacia otra ruta
import { getProducts, updateProductAvailability } from "../services/ProductService"
import ProductDetails from "../components/ProductDetails"
import { Product } from "../types"

export async function loader() { // Esta función se va a encargar de hacer lo que hacíamos en los otros proyectos con el useeffect de pasarle esos valores al usestate, los loaders en react router son el reemplazo de lo que hacía ese useeffect y usestate.

  const products = await getProducts() // Mandamos a llamar esa función que obtiene los datos o productos de la base de datos. De esa forma ya los tendremos en este loader.
  
  return products // Retornamos los productos para poder acceder a ellos desde el componente con useLoaderData
}

export async function action({ request }: ActionFunctionArgs) { // Como esta es la página principal queremos que esa acción se ejecute en esta página. Y lo que hace este action es cambiar esa disponibilidad de Disponible a No disponible cuándo demos click.
  const data = Object.fromEntries(await request.formData())
  await updateProductAvailability(+data.id) // De esa forma ya se actualiza y se cambia esa disponibilidad gracias al componente de fetcher.
  return {}
}

// Acá vamos a tener el contenido de los productos, y el contenido de acá se va a inyectar en ese Outlet del componente Layout
export default function Products() {

  const products = useLoaderData() as Product[] // Le decimos que es de type Product como arreglo ya que sin eso ese products aparece como unknown


  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-4xl font-black text-slate-500">Productos</h2>
        <Link
          to="productos/nuevo"
          className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
        >
          Agregar producto
        </Link>
      </div>

      <div className="p-2">
        <table className="w-full mt-5 table-auto">
          <thead className="bg-slate-800 text-white">
              <tr>
                  <th className="p-2">Producto</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Disponibilidad</th>
                  <th className="p-2">Acciones</th>
              </tr>
          </thead>
          <tbody>
            {products.map(product => (  // Iteramos sobre cada producto,, y al componente de ProductDetails es el que va a mostrar cada producto, le pasamos el prop y el key
              <ProductDetails
                key={product.id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
