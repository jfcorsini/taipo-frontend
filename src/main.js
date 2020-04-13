import Vue from 'vue'
import VueRouter from 'vue-router'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'

import App from './App'
import router from './router'
import config from './config'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faComments, faUsers, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './assets/scss/tailwind.scss';

library.add(faHome)
library.add(faComments)
library.add(faUsers)
library.add(faSignOutAlt)
library.add(faBell)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
