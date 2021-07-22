const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CIRCUIT_BREAKER_TABLE_NAME
let response;

exports.handler = (event, context) => {  
    console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));

    dynamodb.update({
        TableName: TABLE_NAME,
        Key: {
            "id": event.functionName
        },
        UpdateExpression: "set nextAttempt = :x, #s = :state",
        ExpressionAttributeValues: {
            ":x": new Date(Date.now() + parseInt(event.timeout)).toISOString(),
            ":state": "OPEN"
        },
        ExpressionAttributeNames: {
          "#s": "state"
        }
    }, handleResponse);
};

function handleResponse(err, data) {
    if (err) {
        throw new Error(`Error while inserting next attempt: ${err}`)
    }
    else {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Next attempt inserted with success!'
            })
        }

        return response;
    }
}