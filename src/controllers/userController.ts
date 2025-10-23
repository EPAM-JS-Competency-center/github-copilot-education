import { Request, Response } from "express";
import { User } from "../models/user";
import type { AuthUser } from "../services/authService";

type ParamsWithId = { id: string };
type ParamsWithOptionalId = { id?: string };
interface SaveUserBody { name: string; email: string }

class UserController {
    private users: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
    ];
    private nextId: number = 4;  // Updated to continue after the initial users

    private getAuthUser = (req: Request): AuthUser | null => {
        const r = req as Request & { authUser?: AuthUser };
        return r.authUser || null;
    };

    public listUsers(req: Request, res: Response): void {
        const authUser = this.getAuthUser(req);
        res.render('users/list', { users: this.users, authUser });
    }

    public editUser(req: Request<ParamsWithOptionalId>, res: Response): void {
        const userId = req.params.id ? parseInt(req.params.id, 10) : null;
        if (userId !== null) {
            const user = this.users.find(user => user.id === userId);
            if (!user) {
                res.status(404).render('users/details', { user: null, message: 'User not found' });
                return;
            }
            const authUser = this.getAuthUser(req);
            res.render('users/edit', { user, authUser });
            return;
        }
        const blankUser: User = { id: 0, name: '', email: '' };
        const authUser = this.getAuthUser(req);
        res.render('users/edit', { user: blankUser, authUser });
    }

    public saveUser(req: Request<ParamsWithOptionalId, unknown, SaveUserBody>, res: Response): void {
        const userId = req.params.id ? parseInt(req.params.id, 10) : null;
        const { name, email } = req.body;
        
        if (userId !== null) {
            const userIndex = this.users.findIndex(user => user.id === userId);
            if (userIndex === -1) {
                res.status(404).render('users/details', { user: null, message: 'User not found' });
                return;
            }
            this.users[userIndex] = { id: userId, name, email };
        } else {
            const newUser = { id: this.nextId++, name, email };
            this.users.push(newUser);
        }
        res.redirect('/users');
    }

    public removeUser(req: Request<ParamsWithId>, res: Response): void {
        const userId = parseInt(req.params.id, 10);
        this.users = this.users.filter(user => user.id !== userId);
        res.redirect('/users');
    }

    public viewUser(req: Request<ParamsWithId>, res: Response): void {
        const userId = parseInt(req.params.id, 10);
        if (Number.isNaN(userId)) {
            res.status(404).render('users/details', { user: null, message: 'User not found' });
            return;
        }
        const user = this.users.find(user => user.id === userId) || null;
        if (!user) {
            const authUser = this.getAuthUser(req);
            res.status(404).render('users/details', { user: null, message: 'User not found', authUser });
            return;
        }
        const authUser = this.getAuthUser(req);
        res.render('users/details', { user, message: null, authUser });
    }
}

export default UserController;