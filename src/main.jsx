import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter ,Routes, Route  } from 'react-router-dom'  

import Groups from './jsx/Groups'
import Dashboard from './jsx/Dashboard'
import GroupList from './jsx/GroupList'
import JoinGroup from './jsx/JoinGroup'
import CreateGroup from './jsx/CreateGroup'
import AddExpense from './jsx/AddExpense'
import Profile from './jsx/Profile'
import Settlement from './jsx/Settlement'
import Login from './jsx/Login'
import Signup from './jsx/Signup'
import Home from './jsx/Home'


createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Groups" element={<Groups />} />
        <Route path="/GroupList" element={<GroupList />} />
        <Route path="/JoinGroup" element={<JoinGroup />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />
        <Route path="/AddExpense" element={<AddExpense />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Settlement" element={<Settlement />} />
        <Route path="/Groups/:groupId" element={<Groups />} />
        <Route path="/AddExpense/:groupId" element={<AddExpense />} />
        <Route path="/Settlement/:groupId/:from/:to" element={<Settlement />}
/>

      </Routes>
    </BrowserRouter>
)
