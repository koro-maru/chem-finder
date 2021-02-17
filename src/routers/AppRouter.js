import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import HomePage from '../components/HomePage'
import NotFound from '../components/NotFound'


let re = /\*/;
const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route component={NotFound} />
            </Switch>
        </div>
     </BrowserRouter>
);

            //exact checks if route path matches exactly, checks if contains path by default
export default AppRouter; 