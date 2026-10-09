import React from 'react'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import DashboardLayout from './Components/DashboardLayout'
import Dashboard from './Pages/Dashboard'
import Users from './Pages/Users'
import Supplier from './Pages/Supplier'
import Subscription from './Pages/Subscription'
import Login from './Pages/Login'
const App = () => {
  return (
   <Router>
    <Routes>

<Route path='/' element={<Login/>}/>
<Route path='/dashboard' element={<Dashboard/>}/>
<Route path='/dashboardlayout' element={<DashboardLayout/>}/>


<Route path='/user' element={<Users/>}/>
<Route path='/supplier' element={<Supplier/>}/>
<Route path='/subscription' element={<Subscription/>}/>

    </Routes>
   </Router>
  )
}

export default App