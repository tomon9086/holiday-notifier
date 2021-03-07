# functions
## setup
### LINE API Key
1. Register App on LINE Developer Portal

2. Deploy to your Firebase Project
    ```sh
    $ firebase functions:config:set \
        line.channel_access_token='********************' \
        line.channel_secret='*****'
    ```
3. Set `API Key` and `API Secret Key` into `.runtimeconfig.json`
    ```sh
    $ firebase functions:config:get > .runtimeconfig.json
    ```
