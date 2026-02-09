import { CloudFrontClient, DescribeFunctionCommand, TestFunctionCommand } from "@aws-sdk/client-cloudfront"
import { TextEncoder } from "util"
import { ViewerRequestFunction, ViewerResponseFunction } from "../../lib/resources"

const region = process.env.AWS_REGION || 'us-east-1'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const sessionToken = process.env.AWS_SESSION_TOKEN
const hasCredentials = Boolean(accessKeyId && secretAccessKey)

const createClient = () => new CloudFrontClient({
    region,
    credentials: hasCredentials ? {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
        sessionToken
    } : undefined
})

const createRequestEvent = () => ({
    version: '1.0',
    context: {
        eventType: 'viewer-request'
    },
    viewer: {
        ip: '203.0.113.1'
    },
    request: {
        method: 'GET',
        uri: '/',
        headers: {},
        querystring: {}
    }
})

const createResponseEvent = () => ({
    version: '1.0',
    context: {
        eventType: 'viewer-response'
    },
    viewer: {
        ip: '203.0.113.1'
    },
    response: {
        statusCode: 200,
        statusDescription: 'OK',
        headers: {},
        cookies: {}
    }
})

const testFunction = async (name: string, eventObject: object) => {
    const client = createClient()
    const describe = await client.send(new DescribeFunctionCommand({
        Name: name,
        Stage: 'DEVELOPMENT'
    }))
    const etag = describe.ETag
    if (!etag) {
        throw new Error(`Missing ETag for ${name}`)
    }
    const result = await client.send(new TestFunctionCommand({
        Name: name,
        IfMatch: etag,
        Stage: 'DEVELOPMENT',
        EventObject: new TextEncoder().encode(JSON.stringify(eventObject))
    }))
    const output = result.TestResult?.FunctionOutput || '{}'
    return JSON.parse(output)
}


describe('e2e (Call AWS API CloudFront.TestFunction API)', () => {
    describe('ViewerRequestFunction', () => {
        const itIfCreds = hasCredentials ? it : it.skip
        itIfCreds('should return request with no updates', async () => {
            const event = createRequestEvent()
            const result = await testFunction(ViewerRequestFunction.name, event)
            expect(result)
                .toEqual({
                    request: {
                        ...event.request,
                        cookies: {}
                    }
                })
        })
    })

    describe('ViewerResponseFunction', () => {
        const itIfCreds = hasCredentials ? it : it.skip
        itIfCreds('should return response with no updates', async () => {
            const event = createResponseEvent()
            const result = await testFunction(ViewerResponseFunction.name, event)
            expect(result)
                .toEqual({
                    response: event.response
                })
        })
    })
})