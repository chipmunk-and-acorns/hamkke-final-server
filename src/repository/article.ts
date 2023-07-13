import { dataSource } from '../db/db';
import Article from '../entity/article';

interface findOptions {
  page: number;
  size: number;
  stacks: number[];
  position: number | undefined;
  complete: boolean;
}

const repository = dataSource.Article;

export const saveArticle = async (newArticle: Article) => {
  return await repository.manager.transaction(async (entityManager) => {
    return await entityManager.save(newArticle);
  });
};

export const findArticles = async (option: findOptions) => {
  const { page, size, stacks, position, complete } = option;
  let query = repository
    .createQueryBuilder('article')
    .leftJoinAndSelect('article.stacks', 'stack')
    .leftJoinAndSelect('article.positions', 'position')
    .leftJoinAndSelect('article.comments', 'comment')
    .skip((page - 1) * size)
    .take(size);

  if (stacks.length > 0) {
    query = query.where('stack.stackId IN (:...stacks)', { stacks });
  }

  if (position) {
    query = query.andWhere('position.positionId = :position', { position });
  }

  if (complete) {
    query = query.andWhere('article.complete = :complete', { complete });
  }

  return await query.getManyAndCount();
};

export const findArticleById = async (
  articleId: number,
  relations?: string[],
) => {
  return await repository.findOne({ where: { articleId }, relations });
};

export const removeArticle = async (article: Article) => {
  return await repository.remove(article);
};
