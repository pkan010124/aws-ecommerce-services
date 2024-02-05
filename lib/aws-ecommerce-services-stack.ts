import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsDatabase } from './database';
import { AwsMicroservices } from './microservice';
import { AwsApiGateway } from './apigateway';
import { AwsEventBus } from './eventbus';
import { AwsQueue } from './queue';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsEcommerceServicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new AwsDatabase(this, 'AwsDatabase');
    const productTable = database.productTable;
    const microservices = new AwsMicroservices(this, 'AwsMicroservices', { 
      productTable: database.productTable, 
      basketTable: database.basketTable,
      orderTable: database.orderTable 
    });
    const productFunction = microservices.productMicroService;

    const apigw = new AwsApiGateway(this, 'AwsApiGateway', { 
      productMicroservice: microservices.productMicroService, 
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservices: microservices.orderingMicroservice 
    });

    const queue = new AwsQueue(this, 'AwsQueue', { consumer: microservices.orderingMicroservice });

    const eventBus = new AwsEventBus(this, 'AwsEventBus', {
      publisherFunction: microservices.basketMicroservice,
      targetQueue: queue.orderQueue
    });
  }
}
