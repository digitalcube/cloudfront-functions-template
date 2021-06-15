import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as CloudfrontFunctions from '../../lib/cloudfront-functions-stack';

describe('unit test for the stack', () => {
  let app: cdk.App
  let stack: cdk.Stack
  beforeEach(() => {
    app = new cdk.App();
    stack = new CloudfrontFunctions.CloudfrontFunctionsStack(app, 'MyTestStack');
  })
  test('Should match snapshot', () => {
      expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
  });
  it('should have CloudFront Function resources', () => {
    expect(stack).toHaveResource( "AWS::CloudFront::Function")
  })
  it('should disabled auto publish attributes', () => {
    expect(stack).toHaveResource( "AWS::CloudFront::Function", {
      AutoPublish: false,
    })
  })
  it('should not contain module.export on the functionCode', () => {
    const resources = Object.values(SynthUtils.toCloudFormation(stack).Resources)
      .filter((resource: any) => resource.Type === "AWS::CloudFront::Function" )
    resources.forEach((resource: any) => {
      expect(resource.Properties.FunctionCode).not.toContain('module.exports')
    })
  })
  it('should not contain const on the functionCode', () => {
    const resources = Object.values(SynthUtils.toCloudFormation(stack).Resources)
      .filter((resource: any) => resource.Type === "AWS::CloudFront::Function" )
    resources.forEach((resource: any) => {
      expect(resource.Properties.FunctionCode).not.toContain('const')
    })
  })
  it('should not contain let on the functionCode', () => {
    const resources = Object.values(SynthUtils.toCloudFormation(stack).Resources)
      .filter((resource: any) => resource.Type === "AWS::CloudFront::Function" )
    resources.forEach((resource: any) => {
      expect(resource.Properties.FunctionCode).not.toContain('let')
    })
  })
})