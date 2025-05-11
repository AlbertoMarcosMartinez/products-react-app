import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Products from './components/products'

function App() {


  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products/>} />        
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
