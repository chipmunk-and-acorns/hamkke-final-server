import * as express from 'express';

import { registerAccount, login, logout, updateAccount, deleteAccount } from '../controller/member';

const route = express.Router();

// register
route.post('/register', registerAccount);
// login
route.post('/login', login);
// logout
route.post('/logout', logout);
// update member information
route.put('/:id', updateAccount);
// delete
route.delete('/:id', deleteAccount);

export default route;
