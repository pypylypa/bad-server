import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    const rootDir = path.resolve(baseDir)
    
    return (req: Request, res: Response, next: NextFunction) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.json']
        const ext = path.extname(req.path).toLowerCase()

        if (!allowedExtensions.includes(ext)) {
            return next()
        }
        // Определяем полный путь к запрашиваемому файлу
        const filePath = path.resolve(rootDir, `.${req.path}`)

        if (!filePath.startsWith(`${rootDir}${path.sep}`)) {
            return res.status(403).json({ message: 'Доступ запрещен' })
        }

        // Проверяем, существует ли файл
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Файл не существует отдаем дальше мидлварам
                return next()
            }
            // Файл существует, отправляем его клиенту
            return res.sendFile(filePath, (error) => {
                if (error) {
                    next(error)
                }
            })
        })
    }
}
