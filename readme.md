# Rodando serviços aws localmente

Esse projeto contempla a execução via localstack dos seguintes serviços da aws:

1. Cloudformation;
2. ApiGateway;
3. Lambda;
4. SQS.

## Tecnologias utilizadas

 - [NodeJs 15.11.0 +](https://nodejs.org/dist/v15.11.0/)
 - [LocalStack](https://github.com/localstack/localstack)
 - [Cloudformation](https://docs.aws.amazon.com/pt_br/AWSCloudFormation/latest/UserGuide/Welcome.html)
 - [ApiGateway](https://aws.amazon.com/pt/api-gateway/)
 - [Lambda](https://docs.aws.amazon.com/pt_br/lambda/latest/dg/welcome.html)
 - [SQS](https://docs.aws.amazon.com/pt_br/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)
 - [Serverless Framework](https://www.serverless.com/)

## Passo a Passo para executar

1. Configurar docker e baixar a imagem do localstack
1.1. docker pull localstack/localstack (repositório: https://hub.docker.com/r/localstack/localstack)
1.2. Rodar o comando "docker compose up" (arquivo docker-compose.yml está no projeto, para entender as possiveis configurações, verificar o https://github.com/localstack/localstack)
2. Criar um bucket
2.1. aws s3 --endpoint-url=http://localhost:4566 mb s3://my-bucket --region sa-east-1
2.2. Gerar arquivo .zip do projeto node
2.2.1. Para gerar o .zip eu usei o serverless framework, a partir do comando: sls package
2.2.2. Copiar o arquivo .zip gerado
2.2.3. aws s3 --endpoint-url=http://localhost:4566 cp C:\\projetos\\localstack\\lambda\\.serverless\\localstack.zip s3://my-bucket
3. Validar o template cloudformation
3.1. aws cloudformation validate-template --template-body file://template.yml --region sa-east-1
3.1.1. Rodar o cloudformation para gerar a stack
3.1.2. aws cloudformation --endpoint-url=http://localhost:4566 create-stack --stack-name my_stack --template-body file://template.yml --capabilities CAPABILITY_IAM --region sa-east-1
3.2. Verificar status da stack
3.2.1. aws cloudformation --endpoint-url=http://localhost:4566 describe-stacks --stack-name my_stack

## Run tests WIP

```
npm run test:unit
npm run test:coverage
```
## Run Application WIP

```
npm run test:unit
npm run test:coverage
```

## Diagram

```
WIP
```
