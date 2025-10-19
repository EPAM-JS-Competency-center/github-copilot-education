import UserController from './userController';

type MockReq = {
    params?: Record<string, any>;
    body?: Record<string, any>;
};

type MockRes = {
    render: jest.Mock;
    redirect: jest.Mock;
    status: jest.Mock;
};

const createMockRes = (): MockRes => {
    const res: any = {};
    res.render = jest.fn();
    res.redirect = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
    return res as MockRes;
};

describe('UserController', () => {
    let controller: UserController;

    beforeEach(() => {
        controller = new UserController();
    });

    describe('listUsers', () => {
        it('renders the users list view with users', () => {
            const req: MockReq = {};
            const res = createMockRes();

            controller.listUsers(req as any, res as any);

            expect(res.render).toHaveBeenCalledWith('users/list', expect.objectContaining({ users: expect.any(Array) }));
        });
    });

    describe('editUser', () => {
        it('renders edit view with existing user when id is provided', () => {
            const req: MockReq = { params: { id: '1' } };
            const res = createMockRes();

            controller.editUser(req as any, res as any);

            expect(res.render).toHaveBeenCalledWith('users/edit', expect.objectContaining({ user: expect.objectContaining({ id: 1 }) }));
        });

        it('renders edit view with empty user when id is not provided', () => {
            const req: MockReq = { params: {} };
            const res = createMockRes();

            controller.editUser(req as any, res as any);

            expect(res.render).toHaveBeenCalledWith('users/edit', expect.objectContaining({ user: { id: null, name: '', email: '' } }));
        });
    });

    describe('saveUser', () => {
        it('updates an existing user and redirects', () => {
            const reqCreate: MockReq = { params: {}, body: { name: 'New User', email: 'new@example.com' } };
            const resCreate = createMockRes();
            controller.saveUser(reqCreate as any, resCreate as any); // create one first to ensure nextId works consistently

            const req: MockReq = { params: { id: '1' }, body: { name: 'Updated Name', email: 'updated@example.com' } };
            const res = createMockRes();

            controller.saveUser(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith('/users');
        });

        it('creates a new user and redirects', () => {
            const req: MockReq = { params: {}, body: { name: 'Created User', email: 'created@example.com' } };
            const res = createMockRes();

            controller.saveUser(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith('/users');
        });
    });

    describe('removeUser', () => {
        it('removes a user and redirects', () => {
            const req: MockReq = { params: { id: '1' } };
            const res = createMockRes();

            controller.removeUser(req as any, res as any);

            expect(res.redirect).toHaveBeenCalledWith('/users');
        });
    });

    describe('viewUser', () => {
        it('renders details when user exists', () => {
            const req: MockReq = { params: { id: '1' } };
            const res = createMockRes();

            controller.viewUser(req as any, res as any);

            expect(res.render).toHaveBeenCalledWith('users/details', expect.objectContaining({ user: expect.objectContaining({ id: 1 }), message: null }));
            expect(res.status).not.toHaveBeenCalled();
        });

        it('sets 404 and renders when userId missing', () => {
            const req: MockReq = { params: {} };
            const res = createMockRes();

            controller.viewUser(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('users/details', { user: null, message: 'User not found' });
        });

        it('sets 404 and renders when user not found', () => {
            const req: MockReq = { params: { id: '999' } };
            const res = createMockRes();

            controller.viewUser(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('users/details', { user: null, message: 'User not found' });
        });
    });
});


