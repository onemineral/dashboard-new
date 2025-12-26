# Rentalwise Javascript SDK

## Install

**npm**

`npm install @onemineral/pms-js-sdk`

**yarn**

`yarn add @onemineral/pms-js-sdk`


## Initialize the sdk


```js
import { newPmsClient } from '@onemineral/pms-js-sdk';

const pmsClient = newPmsClient({
    baseURL: 'https://demo.rentalwise.io/rest/',
    defaultHeaders: {
        'Authorization': process.env.RENTALWISE_API_TOKEN,
    },
});
```

## Query properties


```js
const properties = await pmsClient.property.query({
    paginate: {
        page: 1,
        perpage: 10,
    },
    // Apply conditions on property fields
    // e.g. query only enabled properties
    where: {
        conditions: [
            {
                field: 'status',
                in: ['enabled'],
            },
        ],
    },
    // Include property relationships in response
    // e.g. include property location in the response
    with: ['location'],
});
```
