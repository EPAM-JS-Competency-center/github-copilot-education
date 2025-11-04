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
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
        { id: 4, name: 'Emily Brown', email: 'emily@example.com' },
        { id: 5, name: 'David Lee', email: 'david@example.com' },
        { id: 6, name: 'Sarah Wilson', email: 'sarah@example.com' },
        { id: 7, name: 'Robert Martinez', email: 'robert@example.com' },
        { id: 8, name: 'Olivia Davis', email: 'olivia@example.com' },
        { id: 9, name: 'James Garcia', email: 'james@example.com' },
        { id: 10, name: 'Linda Rodriguez', email: 'linda@example.com' },
        { id: 11, name: 'William Hernandez', email: 'william@example.com' },
        { id: 12, name: 'Patricia Clark', email: 'patricia@example.com' },
        { id: 13, name: 'Daniel Lewis', email: 'daniel@example.com' },
        { id: 14, name: 'Barbara Walker', email: 'barbara@example.com' },
        { id: 15, name: 'Joseph Green', email: 'joseph@example.com' },
        { id: 16, name: 'Nancy Hall', email: 'nancy@example.com' },
        { id: 17, name: 'Thomas Allen', email: 'thomas@example.com' },
        { id: 18, name: 'Margaret Scott', email: 'margaret@example.com' },
        { id: 19, name: 'Michael Wright', email: 'michael@example.com' },
        { id: 20, name: 'Elizabeth Turner', email: 'elizabeth@example.com' },
        { id: 21, name: 'David Parker', email: 'david@example.com' },
        { id: 22, name: 'Susan Mitchell', email: 'susan@example.com' },
        { id: 23, name: 'James Scott', email: 'james@example.com' },
        { id: 24, name: 'Karen White', email: 'karen@example.com' },
        { id: 25, name: 'Richard Green', email: 'richard@example.com' },
        { id: 26, name: 'Barbara Hall', email: 'barbara@example.com' },
        { id: 27, name: 'Joseph Allen', email: 'joseph@example.com' },
        { id: 28, name: 'Margaret Wright', email: 'margaret@example.com' },
        { id: 29, name: 'Michael Scott', email: 'michael@example.com' },
        { id: 30, name: 'Elizabeth Mitchell', email: 'elizabeth@example.com' },
        { id: 31, name: 'David Parker', email: 'david@example.com' },
        { id: 32, name: 'Susan Mitchell', email: 'susan@example.com' },
        { id: 33, name: 'James Scott', email: 'james@example.com' },
        { id: 34, name: 'Karen White', email: 'karen@example.com' },
        { id: 35, name: 'Richard Green', email: 'richard@example.com' },
        { id: 36, name: 'Barbara Hall', email: 'barbara@example.com' },
        { id: 37, name: 'Joseph Allen', email: 'joseph@example.com' },
        { id: 38, name: 'Margaret Wright', email: 'margaret@example.com' },
        { id: 39, name: 'Michael Scott', email: 'michael@example.com' },
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
        const blankUser: User = { id: null, name: '', email: '' };
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
            res.status(404).render('users/details', { user: null, message: 'User not found' });
            return;
        }
        const authUser = this.getAuthUser(req);
        res.render('users/details', { user, message: null, authUser });
    }
}

export default UserController;