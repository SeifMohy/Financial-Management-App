import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";

import Context from "../Context";

const Link = () => {
  const { linkToken, dispatch } = useContext(Context);
console.log(linkToken)
  const onSuccess = React.useCallback(
    (public_token: string) => {
      //TODO: 9. taking public token to receive an access token through plaid api
      // send public_token to server
      const token = `public_token=${public_token}`
      const setToken = async () => {
        //TODO: 10. api request for access token
        const response = await fetch("/api/Plaid/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `public_token=${public_token}`,
        });
        console.log(response);
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
        console.log(data)
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
          },
        });
      };
      setToken();
      dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
      window.history.pushState("", "", "/AddingABank"); //TODO: send somewhere other than home page
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
    <button type="button" onClick={() => open()} disabled={!ready}>
      Launch Link
    </button>
  );
};

export default Link;
