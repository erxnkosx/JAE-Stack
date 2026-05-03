import { Request, Response, NextFunction } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect("/login");
    }
}

export function redirectIfLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.redirect("/ontdek");
    } else {
        next();
    }
}