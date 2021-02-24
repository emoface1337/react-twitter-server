import express from 'express'
import cloudinary from '../core/cloudinary'

class UploadFileController {
    async uploadPhoto(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const file = req.file
            const filePath = '../' + file.path

            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (err, result) => {
                if (err || !result) {
                    return res.status(500).json({
                        status: 'error',
                        message: err || 'upload error'
                    })
                }
                res.status(201).json({
                    status: 'success',
                    data: result
                })
            }).end(file.buffer)

        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }

    }
}

export const UploadController = new UploadFileController()