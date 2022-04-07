import './css/home.css';
import React from 'react';
import { BrowserRouter, Route,  } from "react-router-dom";
import LogIn from './pages/LogIn';
import Write from './pages/Write';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import MLResult from './pages/MLResult';

const App = () => {

  return (
      <>
      <BrowserRouter>
            <Route path="/" component = {Home} exact></Route>
            <Route path="/login" component = {LogIn}></Route>
            <Route path="/write" component = {Write}></Route>
            <Route path="/signup" component = {SignUp}></Route>
            <Route path="/result" component = {MLResult}></Route>
      </BrowserRouter>
      </>
   );
}

export default App;
