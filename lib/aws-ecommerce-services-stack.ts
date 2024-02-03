import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsDatabase } from './database';
import { AwsMicroservices } from './microservice';
import { AwsApiGateway } from './apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsEcommerceServicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new AwsDatabase(this, 'AwsDatabase');
    const productTable = database.productTable;
    const microservices = new AwsMicroservices(this, 'AwsMicroservices', { 
      productTable: database.productTable, 
      basketTable: database.basketTable 
    });
    const productFunction = microservices.productMicroService;

    const apigw = new AwsApiGateway(this, 'AwsApiGateway', { 
      productMicroservice: microservices.productMicroService, 
      basketMicroservice: microservices.basketMicroservice 
    });
  }
}
