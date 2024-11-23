import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import NetworkStack from './network/network';

export class FastapiEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'FastapiEcsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    new NetworkStack(this, 'NetworkStack');
  }
}
