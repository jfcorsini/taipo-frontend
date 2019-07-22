import Vue from 'vue'
import VueRouter from 'vue-router'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

// vue-form-generator will make it easy to add and validate a styled form
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg-core.css'
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'

import App from './App'
import router from './router'
import config from './config'

const options = {
  defaultOptions: {
   watchQuery: {
     fetchPolicy: 'cache-and-network'
   }
  }
}

const client = new AWSAppSyncClient({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: config.aws_appsync_authenticationType,
    apiKey: config.aws_appsync_apiKey,
  }
}, options)

const appsyncProvider = new VueApollo({
 defaultClient: client
})

Vue.use(VueFormGenerator)
Vue.use(VueApollo)
Vue.config.productionTip = false

Amplify.configure(config)
Vue.use(VueRouter)
Vue.use(AmplifyPlugin, AmplifyModules)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  apolloProvider: appsyncProvider
}).$mount('#app')
