import { useEffect, useState } from "react";
import { bech32 } from "bech32";
import elliptic from "elliptic";
// @ts-ignore
import crypto from "crypto-browserify";
import "./App.css";
import { OraiServiceProvider } from "@oraichain/service-provider-orai";
import init, { interpolate, get_pk } from "@oraichain/blsdkg";
import BN from "bn.js";
init();

const onlySocialKey = window.onlySocialKey;

console.log({ onlySocialKey });

const ec = new elliptic.ec("secp256k1");

const hash160 = (buffer: Buffer) => {
  const sha256Hash = crypto.createHash("sha256").update(buffer).digest();
  try {
    return crypto.createHash("rmd160").update(sha256Hash).digest();
  } catch (err) {
    return crypto.createHash("ripemd160").update(sha256Hash).digest();
  }
};

const getAddress = (privateKey: string) => {
  const key = ec.keyFromPrivate(privateKey);
  const pubKey = Buffer.from(key.getPublic().encodeCompressed("array"));
  const words = bech32.toWords(hash160(pubKey));
  const address = bech32.encode("orai", words);
  return address;
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [privateKey, setPrivateKey] = useState<any>();

  // Init Service Provider inside the useEffect Method
  useEffect(() => {
    const init = async () => {
      // Initialization of Service Provider
      try {
        await (onlySocialKey.serviceProvider as OraiServiceProvider).init();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const triggerLogin = async () => {
    if (!onlySocialKey) {
      uiConsole("onlySocialKey not initialized yet");
      return;
    }
    try {
      const loginResponse = await (
        onlySocialKey.serviceProvider as OraiServiceProvider
      ).triggerLogin({
        typeOfLogin: "google",
        clientId:
          "88022207528-isvvj6icicp9lkgl6ogcpj5eb729iao8.apps.googleusercontent.com",
        verifier: "tkey-google",
      });

      console.log(loginResponse);
    } catch (error) {
      console.log({ error });
      uiConsole(error);
    }
  };

  const initializeNewKey = async () => {
    if (!onlySocialKey) {
      uiConsole("onlySocialKey not initialized yet");
      return;
    }
    try {
      await triggerLogin(); // Calls the triggerLogin() function above
      await onlySocialKey.initialize(); // 1/2 flow
      const { pubKey } = onlySocialKey.getKeyDetails();
      console.log({ pubKey });
      setPrivateKey(onlySocialKey.privKey.toString(16, 64));
      console.log("Private Key: " + onlySocialKey.privKey.toString(16, 64));
    } catch (error) {
      console.log(error);
      uiConsole(error, "caught");
    }
  };

  const triggerLoginMobile = async () => {
    if (!onlySocialKey) {
      uiConsole("onlySocialKey not initialized yet");
      return;
    }
    try {
      // Triggering Login using Service Provider ==> opens the popup
      const { shares, sharesIndexes, userInfo, thresholdPublicKey } = await (
        onlySocialKey.serviceProvider as any
      ).triggerLoginMobile({
        typeOfLogin: "google",
        clientId:
          "821030499059-g57d7aqlj9o5lo5snuc87884fv6m7qk0.apps.googleusercontent.com",
        verifier: "cupiee-google-dev",
        // idToken:
        //   "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzYWZlN2E5YmRhNDZiYWU2ZWY5N2U0NmM5NWNkYTQ4OTEyZTU5NzkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MjEwMzA0OTkwNTktZzE3MGp1bzRjZGM1ZWlhNzVwYXV2a2czNTNzMDVqOTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MjEwMzA0OTkwNTktZzU3ZDdhcWxqOW81bG81c251Yzg3ODg0ZnY2bTdxazAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM1ODI0OTQxMzcwMjM2NzE5ODAiLCJlbWFpbCI6InhhY3ZhaS4wNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ijg4WVZ5ZC0tQUFiOHJod280eUI3ZUEiLCJub25jZSI6ImM5djdVdUNzWkZfVmZrWjM0WG5NM25uU1ExalhaZmJZRndCVnNVb0FWR0kiLCJuYW1lIjoiQ2hp4bq_biDEkMaw4budbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y1ZqTFFCNmZtT0s0cVpTc0FGY2xPcmJYazhNTXNsY3R2RXhGUVo0SHFKPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkNoaeG6v24iLCJmYW1pbHlfbmFtZSI6IsSQxrDhu51uZyIsImxvY2FsZSI6InZpIiwiaWF0IjoxNjkyNzg0NDQ1LCJleHAiOjE2OTI3ODgwNDV9.WWAn6Asu1ADnAymv9CuO0QUazcv_XwfSwpSC0Qv0hVhdiVNa8loMSocV41ECjJoiMIljKVJ_8BlneyKLPrEvyNo6_sFWa4py3_p1PKfDaiMiNZHJ-I1IupOOSnm-n4H6EwUNSoEF367l6IFYwQ-7nz7FoaXmCEUX7emwy3_jRFtevkxZn_O18AKpEuEFdB3NIvCtHfGgVNVlrm4d38cC0WkgIfJvLXJjn-mHVaXQh_Q0i0Zfz3GPAtJ_cU3hF76Og4BcIaBO3jsywoG9gb9bLyjvFu7CnX1zHyPkSJPnFc2CLwj5XNA4vnKMkg7fOXfJuBL4ooe11ENSlykpM_0S6A",
      });

      // #region WebView
      // after receiving shares, sharesIndexes using this 2 function in WEBVIEW in mobile

      const privKey = interpolate(sharesIndexes, shares);
      const pubKey = get_pk(privKey);

      // #endregion

      console.log({ shares, sharesIndexes, userInfo, thresholdPublicKey });
      console.log({ privKey, pubKey });

      if (thresholdPublicKey !== Buffer.from(pubKey).toString("hex")) {
        throw new Error("Public key not same");
      }
      const privateKey = await (
        onlySocialKey.serviceProvider as any
      ).directWeb.torus.getPrivKey(new BN(privKey));
      (onlySocialKey.serviceProvider as any).setPostboxKey(privateKey.privKey);
    } catch (error) {
      uiConsole(error);
    }
  };
  const keyDetails = async () => {
    if (!onlySocialKey) {
      uiConsole("onlySocialKey not initialized yet");
      return;
    }
    const keyDetails = onlySocialKey.getKeyDetails();
    uiConsole(keyDetails);
  };

  const logout = (): void => {
    uiConsole("Log out");
    setUser(null);
  };

  const getUserInfo = (): void => {
    uiConsole(user);
  };

  const getPrivateKey = (): void => {
    uiConsole(privateKey);
  };

  const getAccounts = async () => {
    const address = getAddress(privateKey);
    uiConsole(address);
  };

  const uiConsole = (...args: any[]): void => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={keyDetails} className="card">
            Key Details
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Private Key
          </button>
        </div>

        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>

        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      <button onClick={initializeNewKey} className="card">
        Login
      </button>
      <button onClick={triggerLoginMobile} className="card">
        Mobile
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth (onlySocialKey)
        </a>
        & ReactJS Ethereum Example
      </h1>

      <div className="grid">{privateKey ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/self-host/self-host-react-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
