import { SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { type, data } = body;
    console.log(type, data);
  }
};
