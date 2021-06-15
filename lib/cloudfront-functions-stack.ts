import { CfnFunction } from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { ViewerRequestFunction, ViewerResponseFunction } from './resources'

export class CloudfrontFunctionsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const stage = process.env.STAGE || 'development'

    // The code that defines your stack goes here
    new CfnFunction(this, 'ViewerRequestFunction' + stage, {
      functionCode: ViewerRequestFunction.getFunctionCode().toString(),
      autoPublish: false,
      functionConfig: {
        comment: "empty function (boiler plate)",
        runtime: ViewerRequestFunction.runtime
      },
      name: ViewerRequestFunction.name
    })

    new CfnFunction(this, 'ViewerResponseFunction' + stage, {
      name: ViewerResponseFunction.name,
      autoPublish: false,
      functionCode: ViewerResponseFunction.getFunctionCode().toString(),
      functionConfig: {
        comment: "Add easing security header and set redirection of s3 object uuid removing",
        runtime: ViewerResponseFunction.runtime
      }
    })
  }
}
