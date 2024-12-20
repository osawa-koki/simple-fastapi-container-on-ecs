# simple-fastapi-container-on-ecs

🪰🪰🪰 FastAPIのコンテナ(ECR)をECS(Fargate起動タイプ)にデプロイしてみる！  

[![ci](https://github.com/osawa-koki/simple-fastapi-container-on-ecs/actions/workflows/ci.yml/badge.svg)](https://github.com/osawa-koki/simple-fastapi-container-on-ecs/actions/workflows/ci.yml)
[![cd](https://github.com/osawa-koki/simple-fastapi-container-on-ecs/actions/workflows/cd.yml/badge.svg)](https://github.com/osawa-koki/simple-fastapi-container-on-ecs/actions/workflows/cd.yml)
[![Dependabot Updates](https://github.com/osawa-koki/simple-fastapi-container-on-ecs/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/osawa-koki/simple-fastapi-container-on-ecs/actions/workflows/dependabot/dependabot-updates)

![成果物](./fruit.gif)  

## 実行方法

DevContainerに入り、以下のコマンドを実行します。  
※ `~/.aws/credentials`にAWSの認証情報があることを前提とします。  

```bash
cdk synth
cdk bootstrap
cdk deploy --require-approval never --all
```

エンドポイントを取得します。  

```bash
aws cloudformation describe-stacks --stack-name FastapiEcsStack-OutputStack --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' --output text
```

プロトコルはHTTPです。  

---

GitHub Actionsでデプロイする場合は、以下のシークレットを設定してください。  

| シークレット名 | 説明 |
| --- | --- |
| AWS_ACCESS_KEY_ID | AWSのアクセスキーID |
| AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| AWS_REGION | AWSのリージョン |
| DOTENV | `.env`ファイルの中身 |

タグをプッシュすると、GitHub Actionsが動作します。  
手動でトリガーすることも可能です。  
