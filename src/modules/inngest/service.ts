import { log } from '@/log'
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { requestId } from 'hono/request-id'
import { serve } from 'inngest/hono'
import { functions } from './functions'
import { inngest } from './inngest'

export abstract class InngestService {
  static async start() {
    const app = new Hono()
    app.use(requestId())
    app.use(poweredBy())
    app.use(async (context, next) => {
      const base = {
        id: context.get('requestId'),
        method: context.req.method,
        path: context.req.path,
      }

      log.info(
        {
          ...base,
          headers: context.req.header(),
        },
        'Received Request',
      )
      const started_at = Date.now()
      await next()
      const ended_at = Date.now()
      log.info(
        {
          ...base,
          status: context.res.status,
          statusText: context.res.statusText,
          duration: ended_at - started_at,
        },
        'Request Response',
      )
    })
    app.on(
      ['GET', 'PUT', 'POST'],
      ['/api/inngest'],
      serve({
        client: inngest,
        functions,
      }),
    )

    const server = Bun.serve({
      fetch: app.fetch,
      port: 3000,
    })

    log.info(
      { port: server.port, hostname: server.hostname, url: server.url },
      'Inngest service started',
    )
  }
}
