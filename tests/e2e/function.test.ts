import { FunctionTask, TestRequestEventFactory, TestResponseEventFactory } from "cff-tools"
import { ViewerRequestFunction,ViewerResponseFunction } from "../../lib/resources"


describe('e2e (Call AWS API CloudFront.TestFunction API)', () => {
    describe('ViewerRequestFunction', () => {
        it('should return request with no updated', async () => {
            const eventBuilder = TestRequestEventFactory.create()
            const task = new FunctionTask(ViewerRequestFunction)
            const result = await task.runTestToGetFunctionOutput(eventBuilder, 'DEVELOPMENT')
            expect(result)
                .toEqual({
                    request: eventBuilder.getEvent().request
                })
        })
    })

    describe('ViewerResponseFunction', () => {
        it('should return response with a easing security headers', async () => {
            const eventBuilder = TestResponseEventFactory.create()
            const task = new FunctionTask(ViewerResponseFunction)
            const result = await task.runTestToGetFunctionOutput(eventBuilder, 'DEVELOPMENT')
            expect(result)
                .toEqual({
                    response: {
                        headers: {
                          'x-xss-protection': {
                            value: '1; mode=block',
                          },
                          'x-content-type-options': {
                            value: 'nosniff',
                          },
                          'x-frame-options': {
                            value: 'SAMEORIGIN',
                          },
                          'strict-transport-security': {
                            value: 'max-age=63072000',
                          },
                        },
                        statusDescription: 'OK',
                        cookies: {},
                        statusCode: 200,
                    }
                })
        })
    })
})