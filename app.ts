import logger = require("morgan");
import express = require("express");
import createError = require('http-errors');
import corser = require("corser"); //for cors
import {Request, Response} from "express";
import {connectionPromise} from "./db";
import {Routes} from "./routes/Routes";
import "pug";
import * as path from "path";
import {itemService} from "./routes/ItemRoutes";
import {ItemType} from "./ItemType";
import {Pageable} from "./service/filters/Pageable";

export const appPromise = connectionPromise.then(async connection =>
{
    const app = express();
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(corser.create());
    
    app.use(express.static(process.env.PWD && path.join(process.env.PWD, 'static') || 'static'));
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
                        const p:unknown = request.query.p;
                        const s:unknown = request.query.s;
                        let pageable:Pageable;
                        if(p && typeof p === "object" && p.hasOwnProperty("page") && p.hasOwnProperty("size"))
                        {
                            pageable = p as Pageable;
                            const page = Number(pageable.page);
                            const size = Number(pageable.size);
                            pageable.page = isFinite(page) ? page : 0;
                            pageable.size = isFinite(size) ? size : 10;
                        }
                        else
                        {
                            pageable = {page:0, size: 10, sort:null};
                        }
                        
                        if(!route.pagedById)
                        {
                            routePromise = route.action(pageable, s)
                        }
                        else
                        {
                            routePromise = route.action(request.params.id || 0, pageable)
                        }
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
                // .then(res => {console.log(res); return res})
                .then(res => response.send(res))
                .then(() => next)
                .catch(err => next(err));
        });
    });
    
    app.get("/lammie-html", (req, res, next) =>
    {
        const ids = req.query.ids.split(",").map(idString => parseInt(idString)).filter(idNum => isFinite(idNum) && idNum > 0);
        
        itemService.findByIds(ids)
            .then(items => res.render("lammie-template", {items, ItemType}))
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
        
        console.error(err);
        
        // render the error page
        res.status(err.status || 500);
        res.send(err);
    });
    
    return app;
});
