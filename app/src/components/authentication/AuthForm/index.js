import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RQButton, RQInput } from "lib/design-system/components";
import { Typography, Row, Col } from "antd";
import { FaSpinner } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

//IMAGES
import GoogleIcon from "../../../assets/img/icons/common/google.svg";
// import AppleIconWhite from "../../../assets/img/icons/common/apple-white.svg";
// import MicrosoftIcon from "../../../assets/img/icons/common/microsoft.svg";
// import GithubIcon from "../../../assets/img/icons/common/github.svg";

//CONSTANTS
import APP_CONSTANTS from "../../../config/constants";
import PATHS from "config/constants/sub/paths";

//ACTIONS
import {
  handleEmailSignInButtonOnClick,
  handleSignUpButtonOnClick,
  handleForgotPasswordButtonOnClick,
  handleGoogleSignInButtonOnClick,
  handleResetPasswordOnClick,
} from "./actions";

//UTILS
import { getQueryParamsAsMap } from "../../../utils/URLUtils";
import { getAppMode } from "../../../store/selectors";
import { trackAuthModalShownEvent } from "modules/analytics/events/common/auth/authModal";

//STYLES
import { AuthFormHero } from "./AuthFormHero";
import "./AuthForm.css";

const { ACTION_LABELS: AUTH_ACTION_LABELS } = APP_CONSTANTS.AUTH;

const AuthForm = ({
  setAuthMode: SET_MODE,
  authMode: MODE,
  setPopoverVisible: SET_POPOVER,
  src,
  userActionMessage,
  eventSource,
  callbacks,
}) => {
  const navigate = useNavigate();
  //LOAD PROPS
  const callbackFromProps = callbacks || {};
  const { onSignInSuccess, onRequestPasswordResetSuccess } = callbackFromProps;

  //GLOBAL STATE
  const appMode = useSelector(getAppMode);
  const path = window.location.pathname;
  const [actionPending, setActionPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState();
  // const [emailOptin, setEmailOptin] = useState(false);
  const [trackEvent, setTrackEvent] = useState(true);

  const currentTestimonialIndex = useMemo(
    () => Math.floor(Math.random() * 3),
    []
  );
  const emailOptin = false;
  let isSignUp = true;

  useEffect(() => {
    // Updating reference code from query parameters
    let queryParams = getQueryParamsAsMap();
    if (!referralCode && typeof referralCode != "string") {
      if (queryParams["rcode"]) {
        setReferralCode(queryParams["rcode"]);
      } else {
        setReferralCode("");
      }
    }
    if (trackEvent) {
      trackAuthModalShownEvent();
      setTrackEvent(false);
    }
  }, [referralCode, trackEvent]);

  const SocialAuthButtons = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <>
            {/* <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon">
                      <img alt="Login with Github" src={GithubIcon} />
                    </span>
                    <span className="btn-inner--text">Github</span>
                  </Button> */}
            <RQButton
              className="btn-default text-bold w-full"
              onClick={() =>
                handleGoogleSignInButtonOnClick(
                  setActionPending,
                  src,
                  onSignInSuccess,
                  appMode,
                  MODE,
                  navigate,
                  eventSource
                )
              }
            >
              <img src={GoogleIcon} alt="google" className="auth-icons" />
              {MODE === AUTH_ACTION_LABELS.SIGN_UP
                ? "Sign up with Google"
                : "Sign in with Google"}
            </RQButton>
          </>
        );

      default:
        return null;
    }
  };
  const InfoMessage = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <Typography.Text className="secondary-text">
            Enter your email address to reset your password. You may need to
            check your spam folder or unblock{" "}
            <strong>no-reply@requestly.io</strong>
          </Typography.Text>
        );
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Typography.Text className="secondary-text">
            Please enter the new password you'd like to set for your account.
          </Typography.Text>
        );

      default:
        return null;
    }
  };

  const FormSubmitButton = () => {
    if (actionPending) {
      return (
        <RQButton
          className="w-full primary form-elements-margin"
          type="primary"
        >
          <FaSpinner className="icon-spin" />
        </RQButton>
      );
    }
    switch (MODE) {
      default:
      case AUTH_ACTION_LABELS.LOG_IN:
        return (
          <RQButton
            type="primary"
            className="form-elements-margin w-full"
            onClick={(event) =>
              handleEmailSignInButtonOnClick(
                event,
                email,
                password,
                false,
                appMode,
                setActionPending,
                src,
                onSignInSuccess,
                () => setPassword(""),
                eventSource
              )
            }
          >
            Sign In with Email
          </RQButton>
        );

      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <RQButton
            type="primary"
            className="form-elements-margin w-full"
            onClick={(event) =>
              handleSignUpButtonOnClick(
                event,
                name,
                email,
                password,
                referralCode,
                setActionPending,
                navigate,
                emailOptin,
                isSignUp,
                onSignInSuccess,
                eventSource
              )
            }
          >
            Create Account
          </RQButton>
        );
      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <RQButton
            type="primary"
            className="form-elements-margin w-full"
            onClick={(event) =>
              handleForgotPasswordButtonOnClick(
                event,
                email,
                setActionPending,
                onRequestPasswordResetSuccess
              )
            }
          >
            Send reset link
          </RQButton>
        );
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <RQButton
            type="primary"
            className="form-elements-margin w-full"
            onClick={(event) =>
              handleResetPasswordOnClick(
                event,
                password,
                setActionPending,
                navigate,
                () => SET_MODE(AUTH_ACTION_LABELS.LOG_IN)
              )
            }
          >
            Create new password
          </RQButton>
        );
    }
  };

  const BackToLogin = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <>
            {!path.includes(PATHS.AUTH.RESET_PASSWORD.RELATIVE) && (
              <button
                className="back-to-login-btn secondary-text cursor-pointer form-elements-margin"
                onClick={() => {
                  SET_MODE(AUTH_ACTION_LABELS.LOG_IN);
                  setEmail("");
                }}
              >
                <HiArrowLeft />
                Back
              </button>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // const renderRememberMeCheckbox = () => {
  //   switch (MODE) {
  //     case AUTH_ACTION_LABELS.LOG_IN:
  //       return (
  //         <div className="auth-modal-checkbox">
  //           <input
  //             className="checkbox"
  //             id=" customCheckLogin"
  //             type="checkbox"
  //             defaultChecked
  //           />
  //           <label className="custom-control-label" htmlFor=" customCheckLogin">
  //             <span className="text-muted">Remember me</span>
  //           </label>
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };

  // const renderEmailOptin = () => {
  //   switch (MODE) {
  //     case AUTH_ACTION_LABELS.SIGN_UP:
  //       return (
  //         <div className="auth-modal-checkbox">
  //           <input
  //             className="checkbox"
  //             id="emailOptin"
  //             type="checkbox"
  //             defaultChecked={emailOptin}
  //             onChange={() => setEmailOptin(!emailOptin)}
  //           />
  //           <label className="custom-control-label" htmlFor="emailOptin">
  //             <span className="text-muted">
  //               Send me updates with tailored offers, feature releases and
  //               product launches
  //             </span>
  //           </label>
  //           <br />
  //           <br />
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };
  // const onTabChange = (clickedTab) => {
  //   switch (clickedTab) {
  //     default:
  //     case AUTH_ACTION_LABELS.LOG_IN: {
  //       SET_MODE(AUTH_ACTION_LABELS.LOG_IN);
  //       SET_POPOVER(true);
  //       break;
  //     }
  //     case AUTH_ACTION_LABELS.SIGN_UP: {
  //       SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
  //       SET_POPOVER(true);
  //       break;
  //     }
  //   }
  // };
  const renderRightFooterLink = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
        return (
          <Col className="mt-1">
            <span
              className="text-right text-muted cursor-pointer text-underline caption"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD);
                SET_POPOVER(false);
                setEmail("");
                setName("");
                setPassword("");
              }}
            >
              Forgot password?
            </span>
          </Col>
        );

      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Col className="mt-1">
            <span
              className="float-right text-muted cursor-pointer text-underline caption"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD);
                SET_POPOVER(false);
              }}
            >
              Not working? Click to resend email
            </span>
          </Col>
        );

      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <Col>
            <span
              className="float-right text-muted cursor-pointer"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
                SET_POPOVER(true);
              }}
            >
              Sign up
            </span>
          </Col>
        );
      default:
        return null;
    }
  };

  const renderPasswordField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
      case AUTH_ACTION_LABELS.SIGN_UP:
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Row
            className={`${
              MODE !== AUTH_ACTION_LABELS.DO_RESET_PASSWORD &&
              "form-elements-margin"
            } w-full`}
          >
            {/* <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
              </InputGroupAddon> */}
            <label
              htmlFor="password"
              className="text-bold auth-modal-input-label"
            >
              {MODE === AUTH_ACTION_LABELS.SIGN_UP
                ? "Choose password"
                : "Password"}
            </label>
            <RQInput
              id="password"
              className="auth-modal-input"
              required={true}
              placeholder={
                MODE === AUTH_ACTION_LABELS.SIGN_UP
                  ? "Minimum 8 characters"
                  : "Enter your password"
              }
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {renderRightFooterLink()}
          </Row>
        );

      default:
        return null;
    }
  };

  const renderNameField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <Row className="w-full">
            <label
              htmlFor="username"
              className="text-bold auth-modal-input-label"
            >
              Your name
            </label>
            <RQInput
              id="username"
              className="auth-modal-input"
              required={true}
              placeholder="John Doe"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Row>
        );

      default:
        return null;
    }
  };

  const renderEmailField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return null;
      default:
        return (
          <Row
            className={`${
              MODE !== AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD &&
              "form-elements-margin"
            } w-full`}
          >
            <label htmlFor="email" className="text-bold auth-modal-input-label">
              {MODE === AUTH_ACTION_LABELS.SIGN_UP ? "Work Email" : "Email"}
            </label>
            <RQInput
              id="email"
              className="auth-modal-input "
              required={true}
              placeholder={
                MODE === AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD ||
                MODE === AUTH_ACTION_LABELS.LOG_IN
                  ? "Enter your email"
                  : "you@company.com"
              }
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Row>
        );
    }
  };
  // const renderReferralMessage = () => {
  //   return (
  //     <div className="text-center text-muted mb-4 text-green">
  //       <small>Yay! Referral Code applied successfully!</small> <br />
  //       <small>
  //         <b>Sign up with work email</b> to get Free Requestly Premium
  //       </small>
  //     </div>
  //   );
  // };

  // const renderDivider = () => {
  //   switch (MODE) {
  //     case AUTH_ACTION_LABELS.SIGN_UP:
  //       return (
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             marginBottom: "1.5rem",
  //           }}
  //         >
  //           <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
  //           <span style={{ padding: "10px", minWidth: "fit-content" }}>
  //             or Sign up using your Email
  //           </span>
  //           <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
  //         </div>
  //       );
  //     case AUTH_ACTION_LABELS.LOG_IN:
  //       return (
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             marginBottom: "1.5rem",
  //           }}
  //         >
  //           <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
  //           <span style={{ padding: "10px", minWidth: "fit-content" }}>
  //             or Sign in with Email
  //           </span>
  //           <div style={{ borderBottom: "1px solid #92a1b1", width: "100%" }} />
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const onSignInClick = () => {
    SET_MODE(AUTH_ACTION_LABELS.LOG_IN);
    SET_POPOVER(true);
    setEmail("");
    setName("");
    setPassword("");
  };

  const onCreateAccountClick = () => {
    SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
    SET_POPOVER(true);
    setEmail("");
    setPassword("");
  };

  return (
    <Row className="bg-secondary shadow border-0 auth-modal">
      {MODE === AUTH_ACTION_LABELS.SIGN_UP ? (
        <Col span={24}>
          <Row>
            <AuthFormHero currentTestimonialIndex={currentTestimonialIndex} />
            <Col
              span={11}
              className="signup-modal-section-wrapper signup-form-wrapper"
            >
              <Typography.Text
                type="primary"
                className="text-bold w-full header"
              >
                Create your Requestly account
              </Typography.Text>

              <Row align={"middle"} className="mt-1">
                <Typography.Text className="secondary-text">
                  Already using Requestly?
                </Typography.Text>
                <RQButton
                  className="btn-default text-bold caption modal-signin-btn"
                  onClick={onSignInClick}
                >
                  Sign in
                </RQButton>
              </Row>

              <Row className="auth-wrapper mt-1">
                {renderNameField()}
                {renderEmailField()}
                {renderPasswordField()}
                <FormSubmitButton />
                <div className="auth-modal-divider w-full">or</div>
                <SocialAuthButtons />
                <Typography.Text className="secondary-text form-elements-margin">
                  I agree to the{" "}
                  <a
                    className="auth-modal-link"
                    href="https://requestly.io/terms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Requestly Terms
                  </a>
                  . Learn about how we use and protect your data in our{" "}
                  <a
                    className="auth-modal-link"
                    href="https://requestly.io/privacy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                  .
                </Typography.Text>
              </Row>
            </Col>
          </Row>
        </Col>
      ) : MODE === AUTH_ACTION_LABELS.LOG_IN ? (
        <Col span={24} className="login-modal-wrapper">
          <Typography.Text type="primary" className="text-bold w-full header">
            Sign in
          </Typography.Text>
          <Row align={"middle"} className="mt-1">
            <Typography.Text className="secondary-text">or</Typography.Text>
            <RQButton
              className="btn-default text-bold caption modal-signin-btn"
              onClick={onCreateAccountClick}
            >
              Create a new account
            </RQButton>
          </Row>
          <Row className="auth-wrapper mt-1">
            <SocialAuthButtons />
            <div className="auth-modal-divider w-full mb-0">or</div>
            {renderEmailField()}
            {renderPasswordField()}
            <FormSubmitButton />
          </Row>
        </Col>
      ) : (
        <Col span={24} className="login-modal-wrapper">
          <Typography.Text type="primary" className="text-bold w-full header">
            {MODE === AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD
              ? "Forgot your password?"
              : "Create new password"}
          </Typography.Text>
          <Row className="mt-1">
            <InfoMessage />
          </Row>
          <Row className="auth-wrapper mt-1">
            {renderEmailField()}
            {renderPasswordField()}
            <FormSubmitButton />
            <BackToLogin />
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default AuthForm;
