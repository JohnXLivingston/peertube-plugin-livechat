// SPDX-FileCopyrightText: 2024-2025 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

import { eachSeries } from 'async'
import type { NextFunction, Request, RequestHandler, Response } from 'express'

// Syntactic sugar to avoid try/catch in express controllers

export type RequestPromiseHandler = ((req: Request, res: Response, next: NextFunction) => Promise<any>)

// type asyncMiddleWareFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>
// function asyncMiddleware (fun: RequestPromiseHandler | RequestPromiseHandler[]): asyncMiddleWareFunction {
//   return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     if (!Array.isArray(fun)) {
//       // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
//       Promise.resolve((fun as RequestHandler)(req, res, next))
//         .catch(err => { next(err) })
//       return
//     }

//     try {
//       for (const f of fun) {
//         await new Promise<void>((resolve, reject) => {
//           // eslint-disable-next-line @typescript-eslint/no-floating-promises
//           asyncMiddleware(f)(req, res, err => {
//             if (err) {
//               reject(err)
//               return
//             }
//             resolve()
//           })
//         })
//       }

//       next()
//     } catch (err) {
//       next(err)
//     }
//   }
// }

function asyncMiddleware (fun: RequestPromiseHandler | RequestPromiseHandler[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (Array.isArray(fun)) {
      eachSeries(fun as RequestHandler[], (f, cb) => {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        Promise.resolve(f(req, res, (err: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          cb(err)
        }))
          .catch(err => { next(err) })
      }, next)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    Promise.resolve((fun as RequestHandler)(req, res, next))
      .catch(err => { next(err) })
  }
}

export {
  asyncMiddleware
}
