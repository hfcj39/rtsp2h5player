import {ValidateError} from './param-validator'
import {Context} from 'koa'

export async function errorHandler(ctx: Context, next) {
    try {
        await next()
    } catch (e) {
        if (e instanceof Error && !(e instanceof ValidateError)) {
            console.error(e)
        }
        if (typeof e === 'number') {
            ctx.status = e;
            ctx.body = '';
            return
        }
        if (e.status) {
            ctx.status = 200;
            ctx.body = e;
            return
        }
        ctx.body = {
            status: 500,
            error: e.message || e.toString(),
        }
    }
}