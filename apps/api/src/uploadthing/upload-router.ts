import { JwtPayload } from '@food-delivery/types';
import { createUploadthing, type FileRouter } from 'uploadthing/express';
import type { Request } from 'express';

type AuthticatedRequest = Request & { user?: JwtPayload };

const f = createUploadthing();

export const uploadRouter: FileRouter = {
  restaurantImage: f({
    image: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .middleware(({ req }) => {
      const { user } = req as AuthticatedRequest;

      if (!user) throw new Error('Unauthorized');

      return { uploadedBy: user.sub ?? 'unknown' };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log(metadata, file);
      return {
        url: file.url,
      };
    }),

  menuItemImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(({ req }) => {
      const { user } = req as AuthticatedRequest;

      if (!user) throw new Error('Unauthorized');

      return { uploadedBy: user.sub ?? 'unknown' };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log(metadata, file);
      return {
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
