import { dataSource } from '../db/db';
import Article from '../entity/article';

const repository = dataSource.Article;

export const saveArticle = async (newArticle: Article) => {
  return await repository.save(newArticle);
};

export const findArticles = async (relations: string[] = []) => {
  return await repository.find({ relations });
};

export const findArticleById = async (
  articleId: number,
  relations: string[] = [],
) => {
  return await repository.findOne({ where: { articleId }, relations });
};

// export const findArticleByMemberId = async () => {};

export const removeArticle = async (article: Article) => {
  return await repository.remove(article);
};
