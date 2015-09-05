# Bluemix Object storage service controller

Create container and object into Bluemix Object storage srevice.


# Requirement

* Node.js
* Grunt
* Bluemix Object storage (v1) service


# Installation

1. Clone this repository
2. Create and bind object storage service to app
3. Run `npm install`
3. Run `grunt`
4. Run `cf push APPNAME`


# Development

If you want run or develop this app in local environment, create `credential.json`.

```credential.json
{
  "auth_uri": "<SERVICE CREDENTIAL>",
  "global_account_auth_uri": "<SERVICE CREDENTIAL>",
  "username": "<SERVICE CREDENTIAL>",
  "password": "<SERVICE CREDENTIAL>"
}
```
