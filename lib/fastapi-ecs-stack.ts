import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

import * as dotenv from 'dotenv';

import NetworkStack from './network/network';

dotenv.config();

export class FastapiEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const networkStack = new NetworkStack(this, 'NetworkStack');

    // ECSクラスターの作成
    const cluster = new ecs.Cluster(this, 'FargateCluster', {
      vpc: networkStack.vpc,
    });

    // Fargateタスク定義の作成
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'FargateTaskDef', {
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    // ECRプル権限の追加
    taskDefinition.addToExecutionRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ],
        resources: ["*"]
      })
    );

    const container = taskDefinition.addContainer('WebContainer', {
      image: ecs.ContainerImage.fromRegistry(process.env.ECR_REPOSITORY_URI!),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'FargateWebApp' }),
    });
    // コンテナのポートマッピング
    container.addPortMappings({
      containerPort: 80,
    });

    // Fargateサービスの作成（ALBを使用）
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      publicLoadBalancer: true,
      desiredCount: 1,
      assignPublicIp: false,
    });

    // インバウンドルールの調整
    fargateService.service.connections.allowFromAnyIpv4(ec2.Port.tcp(80), 'Allow HTTP access from the internet');

    // 必要なECSタスクの実行権限を追加
    fargateService.taskDefinition.addToExecutionRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ],
        resources: ["*"]
      })
    );

    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: 'The DNS name of the load balancer for accessing the Fargate service',
    });
  }
}
