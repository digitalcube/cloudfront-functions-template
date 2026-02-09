import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CloudfrontFunctions from '../../lib/cloudfront-functions-stack';

describe('unit test for the stack', () => {
  let app: App
  let stack: Stack
  let template: Template
  beforeEach(() => {
    app = new App();
    stack = new CloudfrontFunctions.CloudfrontFunctionsStack(app, 'MyTestStack');
    template = Template.fromStack(stack);
  })
  test('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot()
  });
  it('should have CloudFront Function resources', () => {
    template.resourceCountIs('AWS::CloudFront::Function', 2)
  })
  it('should disabled auto publish attributes', () => {
    template.hasResourceProperties('AWS::CloudFront::Function', {
      AutoPublish: false
    })
  })
  it('should not contain module.export on the functionCode', () => {
    const resources = Object.values(template.toJSON().Resources)
      .filter((resource: any) => resource.Type === "AWS::CloudFront::Function" )
    resources.forEach((resource: any) => {
      expect(resource.Properties.FunctionCode).not.toContain('module.exports')
    })
  })
  it('should not contain const on the functionCode', () => {
    const resources = Object.values(template.toJSON().Resources)
      .filter((resource: any) => resource.Type === "AWS::CloudFront::Function" )
    resources.forEach((resource: any) => {
      expect(resource.Properties.FunctionCode).not.toContain('const')
    })
  })
  it('should not contain let on the functionCode', () => {
    const resources = Object.values(template.toJSON().Resources)
      .filter((resource: any) => resource.Type === "AWS::CloudFront::Function" )
    resources.forEach((resource: any) => {
      expect(resource.Properties.FunctionCode).not.toContain('let')
    })
  })
})