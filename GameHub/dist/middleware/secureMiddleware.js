"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureMiddleware = secureMiddleware;
exports.redirectIfLoggedIn = redirectIfLoggedIn;
function secureMiddleware(req, res, next) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    }
    else {
        res.redirect("/login");
    }
}
function redirectIfLoggedIn(req, res, next) {
    if (req.session.user) {
        res.redirect("/ontdek");
    }
    else {
        next();
    }
}
