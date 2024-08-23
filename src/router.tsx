import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Products, { loader as productsLoader, action as updateAvailabilityAction } from './views/Products'
import NewProduct, { action as newProductAction } from './views/NewProduct' // Las funciones se recomienda crearlas con el nombre de action, pero como no podemos tener varias funcioens llamadas action, le asignamos el alias con as. Para conectar ese action, osea esa función con el Form de NewProduct.tsx, para conectarlos lo hacemos acá en router.tsx.
import EditProduct, { loader as editProductLoader, action as editProductAction } from './views/EditProduct' // Con ese editProductAction heredamos toda la funcionalidad de esas validaciones.
import { action as deleteProductAction } from './components/ProductDetails'

export const router = createBrowserRouter([ // En este router iremos declarando nuestras rutas en un arreglo
    { // Definimos cada ruta en un objeto, y podemos tener rutas dentro de otras que sean hijos, y de esa forma comparten cierto layout.
        path: '/', // Ruta principal
        element: <Layout />, // Tenemos layouts
        children: [ // Para inyectar esos componentes al Layout, se hace en este children, de esa forma lo que esté dentro de children son hijos de ese Layout
            {
                index: true, // Como queremos cargar Products cuándo visitemos la página principal le colocamos index: true, de esa forma se convierte en la página principal.
                element: <Products />, // El elemento que queremos cargar
                loader: productsLoader, // Cuándo cargue este componenten manda a llamar esa función, de esa forma se conecta la página y el loader.
                action: updateAvailabilityAction
            },
            {
                path: 'productos/nuevo', // Creamos la otra ruta
                element: <NewProduct />, // Asignamos ese componente de esa ruta
                action: newProductAction
            },
            {
                path: 'productos/:id/editar', // Ruta para editar el producto, y le pasamos el element o componente que queremos cargar.
                element: <EditProduct />,
                loader: editProductLoader,
                action: editProductAction
            },
            {
                path: 'productos/:id/eliminar', // Cuándo mandemos a llamar esa url sabe que tenemos que eliminar
                action: deleteProductAction
            }
        ]
    }
])