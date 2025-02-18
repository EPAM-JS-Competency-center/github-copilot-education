import { Express } from 'express';
import UserController from '../controllers/userController';

export function setRoutes(app: Express) {
    const controller = new UserController();
    app.get(['/', '/users'], controller.listUsers.bind(controller));
    app.get('/users/edit/:id?', controller.editUser.bind(controller));
    app.post('/users/edit/:id?', controller.saveUser.bind(controller));
    app.post('/users/remove/:id', controller.removeUser.bind(controller));
}