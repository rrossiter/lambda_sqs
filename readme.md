# Rodando serviços aws localmente

Neste projeto iremos criar uma aplicação com as seguintes configurações:

Utilizar serviço de API - interface de programação de aplicações:
- Criar e expor um api gateway - rota/recurso;
- Utilizaremos o Aws Api gateway para integração/disponibilização de serviços backend.

Criar um serviço backend:
- Utilizaremos o Aws Lambda Function como serviço backend;
- Utilizaremos Javascript/nodejs como linguagem de programação;

Utilizar serviço de mensageria para desacoplamento:
- Utilizaremos o Aws Simple Queue Service - SQS como serviço de fila.

A partir da estrutura mencionada, iremos:
- Receber uma request;
- Tratar os dados e;
- Armazena-los no serviço de fila, para posterior processamento.

* E iremos executar todos estes seviços da AWS sem gastar 1 centavo!!

Para isso, vamos conhecer e executar tudo via localstack. Abaixo, veja quais serviços da aws vamos usar:

- Cloudformation;
- ApiGateway;
- Lambda;
- SQS.

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
    - Comando para baixar a imagem: docker pull localstack/localstack (repositório: https://hub.docker.com/r/localstack/localstack)
    - Comando para subir a imagem a partir de um docker-compose: "docker-compose up" (o arquivo docker-compose.yml está no projeto)
2. Criar um bucket
    - aws s3 --endpoint-url=http://localhost:4566 mb s3://my-package --region sa-east-1
    - Gerar arquivo .zip do projeto node
        - Para gerar o .zip eu usei o serverless framework, a partir do comando: sls package
        - Copiar o arquivo .zip que será gerado no diretório .serverless, na raiz do seu projeto
            - aws s3 --endpoint-url=http://localhost:4566 cp C:\\Users\\rrossiter\\Documents\\lambda_sqs\\.serverless\\localstack.zip s3://my-package
3. Validar o template cloudformation
    - aws cloudformation validate-template --template-body file://template.yml --region sa-east-1
    - Executar o cloudformation para gerar a stack
        - aws cloudformation --endpoint-url=http://localhost:4566 create-stack --stack-name my_stack --template-body file://template.yml --capabilities CAPABILITY_IAM --region sa-east-1
    - Verificar status da stack
        - aws cloudformation --endpoint-url=http://localhost:4566 describe-stacks --stack-name my_stack
    - Deletar a stack
        - aws cloudformation --endpoint-url=http://localhost:4566 delete-stack --stack-name my_stack  --region sa-east-1
    - Verificar registros inseridos na fila
        - aws sqs --endpoint-url=http://localhost:4566 receive-message --queue-url http://localhost:4566/000000000000/received-events

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
