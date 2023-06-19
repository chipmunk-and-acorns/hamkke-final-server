import * as express from 'express';
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} from '../controller/article';

import { authCheck } from '../middleware/auth';
import { articleValidation } from '../middleware/validation/article';

const route = express.Router();

// Create
route.post('/', authCheck, articleValidation(), createArticle);
// Read
route.get('/', getArticles);
// Read By Id
route.get('/:id', getArticle);
// Read By MemberId
// route.get('/member/:id', getArticlesByMemberId);
// Update
route.put('/:id', authCheck, articleValidation(), updateArticle);
// Delete
route.delete('/:id', authCheck, deleteArticle);

export default route;
