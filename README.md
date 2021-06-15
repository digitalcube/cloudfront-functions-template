Simply CDK stack template with CI / CD pipeline on CircleCI.

## Features
We can do...

- Create two CloudFront Function (viewer-request / viewer-response )
- Customize these function config by using AWS CDK (TypeScript)
- Deploy functions by AWS CDK CLI
- Execute E2E test using AWS SDK and Jest
- Publish function using npm-script
- Automate these tasks on CircleCI

## Configurations


### Setup

```
% git clone git@github.com:digitalcube/cloudfront-functions-template.git
% cd cloudfront-functions-template
% yarn
```

### Configure AWS CLI

We need to complete the AWS CLI initialization before using AWS CDK.  
We can learn about it by the document.

https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites


### CircleCI configuration

We need to set these environment variables before starting the CircleCI job.

- AWS_ACCESS_KEY_ID: IAM User's access key id
- AWS_SECRET_ACCESS_KEY: IAM User's secret access key

Basically using Administrator Policy to create a user for executing AWS CDK command. But of course, we can create a new custom Policy for the stack.

## Workflows

The template is using these branches to deploy / test / publish CloudFront functions

- main: Production-ready branch.
- development: Testing environment.
- [another branch]: Just build/test the CDK template

## CI job details

### main / develop branch

- Setup project
- Execute unit test of AWS CDK stack
- Deploy the stack to AWS (as a development stage)
- Execute E2E test using jest to test the function behavior
- If pass these steps, the function will published

## CLI commands

### Stack testing

```bash
$ yarn test
```

### Deploy to AWS

By default these function are not publish automatically.
Only deployed to the development stage.

```bash
$ yarn deploy
```

### Testing function (E2E)

Call CloudFront.TestFunction API and check the response by using Jest.

```bash
$ yarn test:e2e
```


### Publish functions

Publish these function

```bash
$ yarn publish-function

or

$ npx ts-node --prefer-ts-exts bin/publish_function.ts 
```