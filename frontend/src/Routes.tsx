import { Route } from 'react-router-dom';
import { Home } from './pages/Login';
// import { useState } from 'react'
import './App.css'

function Routes() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
    </Switch>
  )
}

// export default App
