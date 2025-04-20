# Video Processing Notification Lambda

AWS Lambda function that sends email notifications about video processing status using AWS SES.

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Configure environment variables in your AWS Lambda configuration:
   - `SMTP_HOST`: AWS SES SMTP endpoint (default: email-smtp.us-east-1.amazonaws.com)
   - `SMTP_PORT`: SMTP port (default: 587)
   - `SMTP_USERNAME`: SMTP credentials username from AWS SES
   - `SMTP_PASSWORD`: SMTP credentials password from AWS SES
   - `SENDER_EMAIL`: Email address used as the sender (must be verified in SES)

## AWS SES Setup

1. Verify your domain or at least one email address in AWS SES
2. If your SES account is in sandbox mode, you must also verify recipient email addresses
3. Create SMTP credentials in AWS SES console
4. Ensure your Lambda has appropriate IAM permissions to send emails via SES

## Testing Locally

You can test the lambda function locally using the included test event:

```bash
# If using AWS SAM CLI
sam local invoke -e test-event.json

# Or with serverless framework
serverless invoke local -f notification -p test-event.json
```

## Deployment

Deploy the function using your preferred method (AWS SAM, Serverless Framework, AWS CDK, etc.)

Example with AWS SAM:

```bash
sam build
sam deploy --guided
```

## Email Templates

The service includes two email templates:
- Success notification when video processing completes
- Failure notification when video processing fails

The templates are responsive and can be customized in the `email.service.ts` file. 