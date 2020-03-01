export default {
  aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.AWS_APPSYNC_REGION,
  aws_appsync_authenticationType: process.env.AWS_APPSYNC_AUTHENTICATION_TYPE,
  aws_appsync_apiKey: process.env.AWS_APPSYNC_API_KEY,
  Auth: {
    identityPoolId: process.env.AWS_AUTH_IDENTITY_POOL_ID,
    region: process.env.AWS_AUTH_REGION,
    userPoolId: process.env.AWS_AUTH_USER_POOL_ID,
    userPoolWebClientId: process.env.AWS_AUTH_USER_POOL_WEB_CLIENT_ID,
  },
  Analytics: { 
    disabled: true
  }
};
