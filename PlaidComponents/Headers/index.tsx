import React, { useContext, useEffect } from "react";
import Callout from "plaid-threads/Callout";
import Button from "plaid-threads/Button";
import InlineLink from "plaid-threads/InlineLink";

import Link from "../Link";
import Context from "../../Context";

import styles from "./index.module.scss";
import axios from "axios";

const Header = () => {
  const {
    itemId,
    accessToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
    userInfo,
  } = useContext(Context);

  const sendToSaveToken = {
    accessToken: accessToken,
    userId: userInfo.currentSession?.user.id,
  };

  async function saveAccessToken(data: any) {
    const updatedUser = await axios.put("/api/Auth/accessToken", data);
  }

  useEffect(() => {
    saveAccessToken(sendToSaveToken), [isItemAccess];
  });

  return (
    <div className={styles.grid}>
      <h3 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
        Add A Bank!
      </h3>

      {!linkSuccess ? (
        <>
          <h4 className="m-3 text-xl font-light leading-7 text-gray-900 sm:leading-9 sm:truncate">
            Use below button to add your bank
          </h4>
          {/* message if backend is not running and there is no link token */}
          {!backend ? (
            <Callout warning>
              Unable to fetch link_token: please make sure your backend server
              is running and that your .env file has been configured with your
              <code>PLAID_CLIENT_ID</code> and <code>PLAID_SECRET</code>.
            </Callout>
          ) : /* message if backend is running and there is no link token */
          linkToken == null && backend ? (
            <Callout warning>
              <div>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured
                correctly.
              </div>
              <div>
                If you are on a Windows machine, please ensure that you have
                cloned the repo with{" "}
                <InlineLink
                  href="https://github.com/plaid/quickstart#special-instructions-for-windows"
                  target="_blank"
                >
                  symlinks turned on.
                </InlineLink>{" "}
                You can also try checking your{" "}
                <InlineLink
                  href="https://dashboard.plaid.com/activity/logs"
                  target="_blank"
                >
                  activity log
                </InlineLink>{" "}
                on your Plaid dashboard.
              </div>
              <div>
                Error Code: <code>{linkTokenError.error_code}</code>
              </div>
              <div>
                Error Type: <code>{linkTokenError.error_type}</code>{" "}
              </div>
              <div>Error Message: {linkTokenError.error_message}</div>
            </Callout>
          ) : linkToken === "" ? (
            <div className={styles.linkButton}>
              <Button large disabled>
                Loading...
              </Button>
            </div>
          ) : (
            <div className={styles.linkButton}>
              <Link />
            </div>
          )}
        </>
      ) : (
        <>
          {isItemAccess ? (
            <h4 className="m-3 text-xl font-light leading-7 text-gray-900 sm:leading-9 sm:truncate">
              Congrats! You linked your Bank Account.
            </h4>
          ) : (
            <h4 className={styles.subtitle}>
              <Callout warning>
                Unable to create an item. Please check your backend server
              </Callout>
            </h4>
          )}
          {/* TODO: Save accessToken and item ID to user */}
          <div className={styles.itemAccessContainer}>
            <p className={styles.itemAccessRow}>
              <span className={styles.idName}>item_id</span>
              <span className={styles.tokenText}>{itemId}</span>
            </p>

            <p className={styles.itemAccessRow}>
              <span className={styles.idName}>access_token</span>
              <span className={styles.tokenText}>{accessToken}</span>
            </p>
          </div>
          {isItemAccess && (
            <p className={styles.requests}>
              Now that you have an access_token, you can make all of the
              following requests:
            </p>
          )}
        </>
      )}
    </div>
  );
};

Header.displayName = "Header";

export default Header;
