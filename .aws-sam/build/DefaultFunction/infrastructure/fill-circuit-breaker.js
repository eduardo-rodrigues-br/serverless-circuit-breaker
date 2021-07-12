const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = process.env.CIRCUIT_BREAKER_TABLE_NAME
const axios = require('axios')
let responseStatus = 'SUCCESS'
let responseData

exports.handler = (event, context) => {  
    console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));

    dynamodb.putItem({
        "TableName": TABLE_NAME,
        "Item" : {
            "id": {
               "S": event.ResourceProperties.DefaultFunction
            },
            "state": {
                "S": "CLOSED"
            }
        }
    }, function(err, data) {
        if (err) {
            responseStatus = "FAILED"
            responseData = {
                message: "Error while inserting circuit breaker"
            }
            console.log('Error while inserting circuit breaker: ', err)
            sendResponse(event, context, responseStatus, responseData)
        }
        else {
            responseData = {
                message: "Circuit breaker inserted with success!"
            }
            sendResponse(event, context, responseStatus, responseData)
        }
    });
};

function sendResponse(event, context, responseStatus, responseData){
    const responseBody = {
        "Status": responseStatus,
        "Reason":  `See the details in CloudWatch Log Stream: ${event.ResourceProperties.DefaultFunction}`,
        "PhysicalResourceId": event.ResourceProperties.DefaultFunction,
        "StackId": event.StackId,
        "RequestId": event.RequestId,
        "LogicalResourceId": event.LogicalResourceId,
        "NoEcho": false,
        "Data": responseData || {}
    }
    
    console.log(responseBody)

    axios.put(event.ResponseURL, responseBody).then(data => {
        return "Circuit breaker inserted with success!"
    })
    .catch(err =>{
        return err
    })
}