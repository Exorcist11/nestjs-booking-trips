// cloudinary.provider.ts

import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'deyszirfc',
      api_key:'253776478779844',
      api_secret: 'JmIPK1WfzOpk_Pv32stIdBSYjJo',
    });
  },
};
