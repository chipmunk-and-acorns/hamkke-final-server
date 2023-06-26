import { dataSource } from '../db/db';
import Article from '../entity/article';
import { PageInfo } from '../types/page';

const repository = dataSource.Article;

export const saveArticle = async (newArticle: Article) => {
  return await repository.save(newArticle);
};

export const findArticles = async (
  pageInfo: PageInfo,
  relations: string[] = [],
) => {
  const { page, size } = pageInfo;
  return await repository.findAndCount({
    take: page,
    skip: (page - 1) * size,
    relations,
  });
};

export const findArticleById = async (
  articleId: number,
  relations?: string[],
) => {
  return await repository.findOne({ where: { articleId }, relations });
};

// export const findArticleByMemberId = async () => {};

export const removeArticle = async (article: Article) => {
  return await repository.remove(article);
};
