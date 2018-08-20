import logger = require("morgan");
import express = require("express");
import {Request, Response} from "express";
import createError = require('http-errors');
import {connectionPromise} from "./db";
import {Routes} from "./routes/routes";
import corser = require("corser");

export class Page<T>
{
    content:T[];
    page:number;
    size:number;
    
    constructor(content:T[], page:number, size:number)
    {
        this.content = content;
        this.page = page;
        this.size = size;
    }
}

export const appPromise = connectionPromise.then(async connection =>
{
    const app = express();
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(corser.create());
    
    // register all application routes
    Routes.forEach(route => {
        const method = route.method;
        app[method](route.path, (request: Request, response: Response, next: Function) => {
            let routePromise;
            
            switch(method)
            {
                case "get":
                {
                    if(route.isPaged)
                    {
                        const page = isFinite(request.query.page) && request.query.page > 0 && request.query.page || 0;
                        const size = isFinite(request.query.size) && request.query.size > 0 && request.query.size || 10;
                        routePromise = route.action(page, size)
                    }
                    else
                    {
                        routePromise = route.action(request.params.id || 0);
                    }
                    break;
                }
                case "post":
                case "put":
                {
                    routePromise = route.action(request.body);
                    break;
                }
                case "delete":
                {
                    routePromise = route.action(request.body.id || 0);
                    break;
                }
                default:
                {
                    throw new Error("Unknown method");
                }
                
            }
            
            routePromise
                .then(res => {console.log(res); return res})
                .then(res => response.send(res))
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
