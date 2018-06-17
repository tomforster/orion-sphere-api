import logger = require("morgan");
import express = require("express");
import {Request, Response} from "express";
import createError = require('http-errors');
import {connectionPromise} from "./db";
import {Routes} from "./routes/routes";

export const appPromise = connectionPromise.then(async connection =>
{
    const app = express();
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // register all application routes
    Routes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            let routePromise;
            if(route.isPaged)
            {
                request.params.page = isFinite(request.params.page) && request.params.page > 0 && request.params.page || 0;
                request.params.size = isFinite(request.params.size) && request.params.size > 0 && request.params.size || 10;
                routePromise = route.action(request.params);
            }
            else
            {
                routePromise = route.action(request.params);
            }
            
            routePromise.then(res => response.send(res))
                .then(() => next)
                .catch(err => next(err));
        });
    });
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        
        // render the error page
        res.status(err.status || 500);
        res.send(err);
    });
    
    return app;
});
