import axios from "axios";
import Router from "next/router";
import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/router";
import Context from "../Context";

const Link = () => {
  const router = useRouter();
  const { linkToken, dispatch, userInfo } = useContext(Context);
  const onSuccess = React.useCallback(
    (public_token: string) => {
      //TODO: 9. taking public token to receive an access token through plaid api
      // send public_token to server
      const setToken = async () => {
        //TODO: 10. api request for access token
        const response = await fetch("/api/Plaid/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `public_token=${public_token}`,
        });
        // console.log(response);
        if (!response.ok) {
          dispatch({
            type: "SET_STATE",
            state: {
              itemId: `no item_id retrieved`,
              accessToken: `no access_token retrieved`,
              isItemAccess: false,
            },
          });
          return;
        }
        const data = await response.json();
        // console.log(data)
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        });
        router.push("/Dashboard");
      };
      setToken();
      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/Dashboard"); //TODO: Should send to transaction page?
    },
    [dispatch]
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    //TODO: 7. this is used to send the previously received link with successful user login
    token: linkToken!,
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config); //TODO: 8. an object received for user after linking plaid with their institution

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);
  return (
    <button
      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 m-3"
      type="button"
      onClick={() => open()}
      disabled={!ready}
    >
      Launch Link
    </button>
  );
};

export default Link;
