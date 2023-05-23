import * as path from 'path';

export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '함께스터디 서버 API with Swagger',
      version: '1.0.0',
      description: '함께 스터디 Restful API 문서입니다',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'hamkke study',
        url: '#배포예정',
        email: 'devquokkajeong@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../routes/*.js')],
};
