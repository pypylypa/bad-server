import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import ForbiddenError from '../errors/forbidden-error'

const CSRF_COOKIE_NAME = '_csrf'
const CSRF_HEADER_NAME = 'x-csrf-token'

export const generateCsrfToken = (_req: Request, res: Response) => {
    const token = crypto.randomBytes(32).toString('hex')

    res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    })

    return token
}

export const csrfProtection = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const tokenFromCookie = req.cookies[CSRF_COOKIE_NAME]
    const tokenFromHeader = req.headers[CSRF_HEADER_NAME]

    if (
        typeof tokenFromCookie !== 'string' ||
        typeof tokenFromHeader !== 'string' ||
        tokenFromCookie !== tokenFromHeader
    ) {
        return next(new ForbiddenError('Невалидный CSRF-токен'))
    }

    return next()
}