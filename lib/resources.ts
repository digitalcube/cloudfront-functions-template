import { readFileSync } from 'fs';
import { join } from 'path';

const stage = process.env.STAGE || 'development'
type CloudFrontFunctionDefinition = {
  name: string;
  runtime: 'cloudfront-js-1.0';
  functionFilePath: string;
  getFunctionCode: () => string;
}

const createFunctionDefinition = (baseName: string, functionFilePath: string): CloudFrontFunctionDefinition => ({
  name: `${baseName}-${stage}`,
  runtime: 'cloudfront-js-1.0',
  functionFilePath,
  getFunctionCode: () => readFileSync(functionFilePath, 'utf8')
})

export const ViewerRequestFunction = createFunctionDefinition(
  'ViewerRequestFunction',
  join(__dirname, '../functions/viewer_request.js')
)

export const ViewerResponseFunction = createFunctionDefinition(
  'ViewerResponseFunction',
  join(__dirname, '../functions/viewer_response.js')
)
