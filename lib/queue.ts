import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface AwsQueueProps {
  consumer: IFunction
}

export class AwsQueue extends Construct {

  public readonly orderQueue: IQueue;
  constructor(scope: Construct, id: string, props: AwsQueueProps) {
    super(scope, id);

    // queue
    this.orderQueue = new Queue(this, 'OrderQueue', {
      queueName: 'OrderQueue',
      visibilityTimeout: Duration.seconds(300)
    });

    props.consumer.addEventSource(new SqsEventSource(this.orderQueue, {
      batchSize: 1
    }));
  }
}
