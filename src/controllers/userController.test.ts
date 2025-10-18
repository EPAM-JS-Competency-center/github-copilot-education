import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import UserController from './userController';

describe('UserController', () => {
    let controller: UserController;
    let mockRequest: any;
    let mockResponse: any;

    beforeEach(() => {
        controller = new UserController();
        mockResponse = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    test('listUsers should render users list', () => {
        controller.listUsers({}, mockResponse);
        expect(mockResponse.render).toHaveBeenCalledWith('users/list', {
            users: expect.arrayContaining([
                expect.objectContaining({ id: 1, name: 'John Doe', email: 'john@example.com' })
            ])
        });
    });

    test('editUser should render edit form with existing user', () => {
        mockRequest = { params: { id: '1' } };
        controller.editUser(mockRequest, mockResponse);
        expect(mockResponse.render).toHaveBeenCalledWith('users/edit', {
            user: expect.objectContaining({ id: 1, name: 'John Doe', email: 'john@example.com' })
        });
    });

    test('editUser should render edit form with empty user for new user', () => {
        mockRequest = { params: {} };
        controller.editUser(mockRequest, mockResponse);
        expect(mockResponse.render).toHaveBeenCalledWith('users/edit', {
            user: { id: null, name: '', email: '' }
        });
    });

    test('saveUser should update existing user', () => {
        mockRequest = {
            params: { id: '1' },
            body: { name: 'Updated John', email: 'updated@example.com' }
        };
        controller.saveUser(mockRequest, mockResponse);
        expect(mockResponse.redirect).toHaveBeenCalledWith('/users');
    });

    test('saveUser should create new user', () => {
        mockRequest = {
            params: {},
            body: { name: 'New User', email: 'new@example.com' }
        };
        controller.saveUser(mockRequest, mockResponse);
        expect(mockResponse.redirect).toHaveBeenCalledWith('/users');
    });

    test('removeUser should remove user and redirect', () => {
        mockRequest = { params: { id: '1' } };
        controller.removeUser(mockRequest, mockResponse);
        expect(mockResponse.redirect).toHaveBeenCalledWith('/users');
    });

    test('viewUser should render details for existing user', () => {
        mockRequest = { params: { id: '1' } };
        controller.viewUser(mockRequest, mockResponse);
        expect(mockResponse.render).toHaveBeenCalledWith('users/details', {
            user: expect.objectContaining({ id: 1, name: 'John Doe', email: 'john@example.com' }),
            message: null
        });
    });

    test('viewUser should render not found for invalid id', () => {
        mockRequest = { params: { id: '999' } };
        controller.viewUser(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.render).toHaveBeenCalledWith('users/details', {
            user: null,
            message: 'User not found'
        });
    });
});