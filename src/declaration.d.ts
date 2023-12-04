import ThresholdKey from "@oraichain/default";
import OnlySocialKey from "@oraichain/only-social-key";

declare module "*.scss";

declare global {
  interface Window {
    tKey: ThresholdKey;
    onlySocialKey: OnlySocialKey;
  }
}
