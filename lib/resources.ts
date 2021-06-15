import { Function } from 'cff-tools';
import { join } from 'path';

const stage = process.env.STAGE || 'development'
export const ViewerRequestFunction = new Function({
  name: 'ViewerRequestFunction-' + stage,
  runtime: 'cloudfront-js-1.0'
}, {
    functionFilePath: join(__dirname, '../functions/viewer_reqeust.js')
})

export const ViewerResponseFunction = new Function({
  name: 'ViewerResponseFunction-' + stage,
  runtime: 'cloudfront-js-1.0'
}, {
    functionFilePath: join(__dirname, '../functions/viewer_response.js')
})
