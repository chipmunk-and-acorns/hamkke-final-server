import * as express from 'express';

import { registerAccount, login, logout, deleteAccount, updatePassword, updateNickname } from '../controller/member';

const route = express.Router();

// register
route.post('/register', registerAccount);
// login
route.post('/login', login);
// logout
route.post('/logout', logout);
// update password
route.put('/:id/password', updatePassword);
// update nickname
route.put('/:id/nickname', updateNickname);
// delete
route.delete('/:id', deleteAccount);

export default route;
