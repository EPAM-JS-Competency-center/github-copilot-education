class UserController {
    private users: { id: number; name: string; email: string }[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
    ];
    private nextId: number = 4;  // Updated to continue after the initial users

    public listUsers(req: any, res: any) {
        res.render('users/list', { users: this.users });
    }

    public editUser(req: any, res: any) {
        const userId = req.params.id ? parseInt(req.params.id) : null;
        const user = userId ? this.users.find(user => user.id === userId) : { id: null, name: '', email: '' };
        res.render('users/edit', { user });
    }

    public saveUser(req: any, res: any) {
        const userId = req.params.id ? parseInt(req.params.id) : null;
        const { name, email } = req.body;
        
        if (userId) {
            const userIndex = this.users.findIndex(user => user.id === userId);
            if (userIndex !== -1) {
                this.users[userIndex] = { id: userId, name, email };
            }
        } else {
            const newUser = { id: this.nextId++, name, email };
            this.users.push(newUser);
        }
        res.redirect('/users');
    }

    public removeUser(req: any, res: any) {
        const userId = parseInt(req.params.id);
        this.users = this.users.filter(user => user.id !== userId);
        res.redirect('/users');
    }
}

export default UserController;