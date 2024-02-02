import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface AwsMicroservicesProps {
  productTable: ITable;
}

export class AwsMicroservices extends Construct {

  public readonly productMicroService: NodejsFunction;

  constructor(scope: Construct, id: string, props: AwsMicroservicesProps) {
    super(scope, id);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: props.productTable.tableName
      },
      runtime: Runtime.NODEJS_20_X
    }

    // Product microservices lambda function
    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
    })

    props.productTable.grantReadWriteData(productFunction);

    this.productMicroService = productFunction;
  }
}