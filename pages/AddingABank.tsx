import React, { useCallback, useContext, useEffect } from "react";
import Header from "../PlaidComponents/Headers";
import Context from "../Context";
import Layout from "../Components/Layout";

const AddingABank = () => {
  const { linkSuccess, isItemAccess, dispatch } = useContext(Context);

  const getInfo = useCallback(async () => {
    const response = await fetch("/api/Plaid/info");
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation: boolean =
      data.products.includes("payment_initiation");
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
      },
    });
    return { paymentInitiation };
  }, [dispatch]);

  const generateToken = useCallback(
    //TODO: 1. asks server to get a link from plaid
    async (paymentInitiation: any) => {
      const response = await fetch("api/Plaid/create_link_token");
      if (!response) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      // console.log(data);
      if (data) {
        //TODO: 6. this is the link sent from plaid
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      localStorage.setItem("link_token", data.link_token); //to use later for Oauth
    },
    [dispatch]
  );

  useEffect(() => {
    //TODO: 2. on app start calls generating the link (will be used when oboarding new banks)
    const init = async () => {
      const { paymentInitiation } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      // console.log(paymentInitiation);
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, getInfo]);

  return (
    <Layout>
      <div>
        <div>
          <Header />
          {linkSuccess && isItemAccess}
        </div>
      </div>
    </Layout>
  );
};

export default AddingABank;
