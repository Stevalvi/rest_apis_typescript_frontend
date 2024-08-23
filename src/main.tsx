import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider} from 'react-router-dom'
import { router } from './router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
  </React.StrictMode>,
) // A ese RouterProvider le pasamos el prop de router y le decimos que queremos utilizar ese archivo de router, de esa forma los conectamos.
