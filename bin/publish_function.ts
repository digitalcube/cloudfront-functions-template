#!/usr/bin/env node
import { CloudFrontClient, DescribeFunctionCommand, PublishFunctionCommand } from '@aws-sdk/client-cloudfront'
import { ViewerRequestFunction, ViewerResponseFunction } from '../lib/resources'

const region = process.env.AWS_REGION || 'us-east-1'
const client = new CloudFrontClient({ region })

const publishFunction = async (targetFunction: { name: string }) => {
    const describe = await client.send(new DescribeFunctionCommand({
        Name: targetFunction.name,
        Stage: 'DEVELOPMENT'
    }))
    const etag = describe.ETag
    if (!etag) {
        throw new Error(`Missing ETag for ${targetFunction.name}`)
    }
    return client.send(new PublishFunctionCommand({
        Name: targetFunction.name,
        IfMatch: etag
    }))
}

const functions = [ViewerRequestFunction, ViewerResponseFunction];

Promise.all(functions.map(publishFunction))
    .then(result => {
        console.log(result)
    })
    .catch(e => {
        console.error(e)
        process.exit(1)
    })