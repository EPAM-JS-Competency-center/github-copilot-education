import { Express } from 'express';
import UserController from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';

export function setRoutes(app: Express) {
    const controller = new UserController();
    app.get(['/', '/users'], controller.listUsers.bind(controller));
    app.get('/users/edit/:id?', requireAuth, controller.editUser.bind(controller));
    app.post('/users/edit/:id?', requireAuth, controller.saveUser.bind(controller));
    app.post('/users/remove/:id', requireAuth, controller.removeUser.bind(controller));
    app.get('/users/:id', controller.viewUser?.bind(controller) || ((req, res) => res.redirect('/users')));
}