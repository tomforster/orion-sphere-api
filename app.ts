import logger = require("morgan");
import express = require("express");
import {Request, Response} from "express";
import createError = require('http-errors');
import {connectionPromise} from "./db";
import {itemService, Routes} from "./routes/routes";
import corser = require("corser");//for cors
import "pug";

export class Page<T>
{
    content:T[];
    number:number;
    size:number;
    first:boolean;
    last:boolean;
    totalPages:number;
    
    constructor(content:T[], number:number, size:number, totalPages:number, first:boolean = false, last:boolean = false)
    {
        this.content = content;
        this.number = number;
        this.totalPages = totalPages;
        this.size = size;
        this.first = first;
        this.last = last;
    }
}

export const appPromise = connectionPromise.then(async connection =>
{
    const app = express();
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(corser.create());
    
    app.use(express.static('static'));
    app.set('view engine', 'pug');
    
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
                        let page = parseInt(request.query.page);
                        page = isFinite(page) && page > 0 && page || 0;
                        let size = parseInt(request.query.size);
                        size = isFinite(size) && size > 0 && size || 10;
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
    
    app.post("/lammies", (req, res, next) =>
    {
        itemService.getRepository().findByIds(req.body)
            .then(items => res.send(items))
            .then(() => next)
            .catch(err => next(err));
    });
    
    app.get("/lammie-html", (req, res, next) =>
    {
        const ids = req.query.ids.split(",").map(idString => parseInt(idString)).filter(idNum => isFinite(idNum) && idNum > 0);
        
        itemService.getRepository().findByIds(ids)
            .then(items => res.render("lammie-template", {items}))
            .then(() => next)
            .catch(err => next(err));
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
