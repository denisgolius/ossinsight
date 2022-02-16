import Router from "koa-router";
import Query from "./core/Query";
import {MysqlQueryExecutor} from "./core/MysqlQueryExecutor";
import {DefaultState} from "koa";
import type {ContextExtends} from "../index";

export default function server(router: Router<DefaultState, ContextExtends>) {

  const executor = new MysqlQueryExecutor({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    queueLimit: 10
  })

  router.get('/q/:query', async ctx => {
    const query = new Query(ctx.params.query)
    try {
      const res = await query.run(ctx.query, executor)

      ctx.response.status = 200
      ctx.response.body = res
    } catch (e) {

      ctx.logger.error('request failed %s', ctx.request.originalUrl, e)
      ctx.response.status = 400
      ctx.response.body = e
    }
  })
}
