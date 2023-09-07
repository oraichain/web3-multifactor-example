import ThresholdKey from "@oraichain/default";
import TorusStorageLayer from "@oraichain/storage-layer-torus";
import WebStorageModule from "@oraichain/web-storage";
import TorusServiceProvider from "@oraichain/service-provider-torus";
import SecurityQuestionsModule from "@oraichain/security-questions";
import init, { interpolate, get_pk } from "@oraichain/blsdkg";
import { Network } from "@oraichain/customauth";
import OnlySocialKey from "@oraichain/only-social-key";

export const metadataUrl = {
  [Network.DEV]: "http://127.0.0.1:5051", // only-dev
  [Network.STAGING]: "https://metadata.social-login-staging.orai.io",
  [Network.TESTNET]: "https://metadata.social-login-testnet.orai.io", // deprecated
  [Network.MAINNET]: "https://metadata-social-login.orai.io",
};

const network: Network =
  (process.env.REACT_APP_NODE_ENV as any) || "development";
const hostUrl = metadataUrl[network];
console.log(process.env.REACT_APP_NODE_ENV);

// Configuration of Service Provider
const customAuthArgs = {
  baseUrl: `${window.location.origin}/serviceworker`,
  network, // based on the verifier network.
  blsdkg: { init, get_pk, interpolate },
};
// Configuration of Modules
const webStorageModule = new WebStorageModule();
const securityQuestionsModule = new SecurityQuestionsModule();
const storageLayer = new TorusStorageLayer({
  hostUrl,
});

const serviceProvider = new TorusServiceProvider({
  customAuthArgs,
});

export const tKey = new ThresholdKey({
  modules: {
    webStorage: webStorageModule,
    securityQuestions: securityQuestionsModule,
  },
  manualSync: false,
  customAuthArgs,
  storageLayer,
  serviceProvider,
});

export const OnlySocialLoginKey = new OnlySocialKey({
  serviceProvider,
  storageLayer,
});
(window as any).tKey = tKey;
