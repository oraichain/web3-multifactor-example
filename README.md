# Web3 multifactor example

A example of web3-multifactor with 2 kind of key:

- Only-social-key
- ThresholdKey

## Table of contents

1. [Explain okey.ts](#explain-okey.ts)
2. [How to run](#how-to-run)

## Explain okey.ts

```typescript
const network: Network =
  (process.env.REACT_APP_NODE_ENV as Network) || Network.DEV;
const hostUrl = metadataUrl[network]; // dynamic get default metadataUrl from the multifactors system

// Initialize Multifactors.js for interacting with Multifactors system
const multifactors = new Multifactors({
  blsdkg: { init, get_pk, interpolate },
});

// Configuration of Service Provider
const customAuthArgs: CustomAuthArgs = {
  baseUrl: `${window.location.origin}/serviceworker`,
  network, // based on the verifier network.
  multifactors,
};

// Configuration of Modules which are used only in ThresholdKey
const webStorageModule = new WebStorageModule();
const securityQuestionsModule = new SecurityQuestionsModule();
const storageLayer = new OraiStorageLayer({
  hostUrl,
});

// Initilize Service Provider which have provided the encKey
const serviceProvider = new OraiServiceProvider({
  customAuthArgs,
});

// ThresholdKey
export const tKey = new ThresholdKey({
  modules: {
    webStorage: webStorageModule, // 2 modules have been initilized above
    securityQuestions: securityQuestionsModule,
  },
  manualSync: false,
  customAuthArgs,
  storageLayer,
  serviceProvider,
});

// OnlySocialKey
export const onlySocialKey = new OnlySocialKey({
  // No need any addition modules
  serviceProvider,
  storageLayer,
});
```

<a name="how-to-run"></a>

## How to run

- Install yarn
- By default of example is using only-social-key. If you want to change to thresholdKey, you must comment only-social-key-test and uncommnet the test in index.tsx.

```typescript
// import App from "./Test";
import App from "./Only-Social-Key-Test";
```

- 2 enviroments are provided in example:

  - STAGING (TESTNET)
  - MAINET

```bash
yarn
yarn start:staging

```
