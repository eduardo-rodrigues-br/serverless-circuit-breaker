/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    let response = {}
    
    try {
        if (Math.random() < 0.6){
            response.statusCode = 500
            response.body = JSON.stringify({
                message: 'Message from default function: Error while proccess payment'
            })
        }
        else{
            response.statusCode = 200
            response.body = JSON.stringify({
                message: 'Message from default function: Payment made with success!'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    
    return response
};