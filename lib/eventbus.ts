import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface AwsEventBusProps {
  publisherFunction: IFunction
  targetFunction: IFunction
}

export class AwsEventBus extends Construct {
  constructor(scope: Construct, id: string, props: AwsEventBusProps) {
    super(scope, id);

    //event bus code
    const bus = new EventBus(this, "AwsEventBus", {
      eventBusName: "AwsEventBus"
    });

    const checkoutBasketRule = new Rule(this, "CheckoutBasketRule", {
      eventBus: bus,
      enabled: true,
      description: 'When basket microservice sends a checkout event, this rule will be triggered.',
      eventPattern: {
        source: ['com.aws.basket.checkoutbasket'],
        detailType: ['CheckoutBasket']
      },
      ruleName: 'CheckoutBasketRule'
    });

    // need to pass target to Ordering Lambda service
    checkoutBasketRule.addTarget(new LambdaFunction(props.targetFunction));

    bus.grantPutEventsTo(props.publisherFunction);
            // AccessDeniedException - is not authorized to perform: events:PutEvents
  }
}