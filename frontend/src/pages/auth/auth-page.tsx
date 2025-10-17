import React, { useEffect, useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { useSignIn, useSignUp, SignUpData, useResetPassword } from "@/hooks";
import { AuthType } from "@/services";

import { Input, Button, BackgroundWrapper } from "@/components";
import { ResetPasswordModal } from "./components/reset-password-modal";

import { pageRoutes } from "@/config";

import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

import { ChevronLeft } from "lucide-react";

import * as motion from "motion/react-client";

import toast from "react-hot-toast";

interface AuthPageProps {
  authPageType: "signIn" | "signUp" | "resetPassword";
}

export const AuthPage: React.FC<AuthPageProps> = ({ authPageType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const recoveryEmail = location.state?.recoveryEmail;

  const [formData, setFormData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    verificationCode: "",
    newPassword: "",
  });
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const { mutate: signInMutation, isPending: isSignInPending } = useSignIn();
  const { mutate: signUpMutation, isPending: isSignUpPending } = useSignUp();
  const { mutate: resetPasswordMutation, isPending: isResetPasswordPending } =
    useResetPassword();

  const disabledFormField =
    isSignUpPending || isSignInPending || isResetPasswordPending;

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (authPageType === "signIn") {
      if (formData.email === "" || formData.password === "") {
        toast.error("Some fields are empty");
        return;
      }

      signInMutation({
        email: formData.email.trim(),
        password: formData.password.trim(),
        authType: AuthType.Email,
      });
    }

    if (authPageType === "signUp") {
      if (
        formData.firstName === "" ||
        formData.email === "" ||
        formData.password === ""
      ) {
        toast.error("Some fields are empty");
        return;
      }

      signUpMutation({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        authType: AuthType.Email,
      });
    }

    if (authPageType === "resetPassword") {
      resetPasswordMutation({
        email: recoveryEmail,
        verificationCode: resetPasswordFormData.verificationCode,
        newPassword: resetPasswordFormData.newPassword.trim(),
      });
    }
  };

  const googleAuthSuccessHandler = async (credentialResponse: any) => {
    const user: { email: string; family_name: string; given_name: string } =
      jwtDecode(credentialResponse?.credential as string);

    if (authPageType === "signIn") {
      signInMutation({
        email: user.email,
        password: "",
        authType: AuthType.Google,
      });
    } else {
      signUpMutation({
        firstName: user.given_name,
        lastName: user.family_name,
        email: user.email,
        password: "",
        authType: AuthType.Google,
      });
    }
  };

  const googleAuthErrorHandler = () => {
    toast.error("Something went wrong");
  };

  useEffect(() => {
    if (!recoveryEmail) navigate(pageRoutes.signIn);
  }, [recoveryEmail]);

  const headingTitle = {
    signIn: "Sign in",
    signUp: "Sign up",
    resetPassword: "Reset password",
  };

  return (
    <>
      <div className="relative z-20 flex h-[100dvh] items-center justify-center">
        <div>
          <h1 className="relative text-center font-poetsenOne text-3xl text-gray-700">
            Notes app
          </h1>

          <motion.div
            key={authPageType}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              ((recoveryEmail && authPageType === "resetPassword") ||
                authPageType !== "resetPassword") && { opacity: 1, scale: 1 }
            }
            transition={{
              duration: 0.4,
              scale: { type: "keyframes", visualDuration: 0.2, bounce: 0.2 },
            }}
          >
            <div className="mt-8 w-[430px] rounded-3xl bg-card p-10 shadow-xl">
              <h2 className="text-xl font-semibold">
                {headingTitle[authPageType]}
              </h2>

              <form
                onSubmit={submitHandler}
                className="mt-3 flex flex-col gap-2"
              >
                {authPageType === "signUp" && (
                  <>
                    <Input
                      disabled={disabledFormField}
                      placeholder="First name"
                      value={formData.firstName}
                      name="firstName"
                      onChange={changeInputHandler}
                      className="rounded-xl bg-gray-100 p-3"
                    />
                    <Input
                      disabled={disabledFormField}
                      placeholder="Last name"
                      value={formData.lastName}
                      name="lastName"
                      onChange={changeInputHandler}
                      className="rounded-xl bg-gray-100 p-3"
                    />
                  </>
                )}

                {authPageType !== "resetPassword" && (
                  <>
                    <Input
                      disabled={disabledFormField}
                      placeholder="Email"
                      value={formData.email}
                      name="email"
                      onChange={changeInputHandler}
                      className="rounded-xl bg-gray-100 p-3"
                    />
                    <Input
                      disabled={disabledFormField}
                      placeholder="Password"
                      withHideIcon
                      value={formData.password}
                      type="password"
                      name="password"
                      onChange={changeInputHandler}
                      className="w-full rounded-xl bg-gray-100 p-3 pr-11"
                    />
                  </>
                )}

                {authPageType === "resetPassword" && (
                  <>
                    <Input
                      placeholder="Verification code"
                      value={resetPasswordFormData.verificationCode}
                      onChange={(event) => {
                        setResetPasswordFormData({
                          ...resetPasswordFormData,
                          verificationCode: event.target.value,
                        });
                      }}
                      className="rounded-xl bg-gray-100 p-3"
                    />
                    <Input
                      disabled={disabledFormField}
                      placeholder="New password"
                      value={resetPasswordFormData.newPassword}
                      type="password"
                      name="newPassword"
                      onChange={(event) => {
                        setResetPasswordFormData({
                          ...resetPasswordFormData,
                          newPassword: event.target.value,
                        });
                      }}
                      className="w-full rounded-xl bg-gray-100 p-3 pr-11"
                    />
                  </>
                )}
                <Button
                  type="submit"
                  className="mt-2 p-3"
                  loading={disabledFormField}
                  disabled={disabledFormField}
                >
                  {authPageType === "resetPassword" ? (
                    <span>Save</span>
                  ) : (
                    <span>Submit</span>
                  )}
                </Button>
              </form>

              {authPageType !== "resetPassword" && (
                <>
                  <div className="py-3">
                    <GoogleLogin
                      onSuccess={googleAuthSuccessHandler}
                      onError={googleAuthErrorHandler}
                    />
                  </div>

                  <div className="pt-2">
                    {authPageType === "signIn" && (
                      <>
                        <p className="text-sm">
                          <span>Don't have an account? </span>
                          <Link
                            to={pageRoutes.signUp}
                            className="font-medium text-blue-400 hover:opacity-80"
                          >
                            Sign up
                          </Link>
                        </p>
                        <button
                          onClick={() => setIsResetPasswordModalOpen(true)}
                          className="mt-2 text-sm font-medium text-blue-400 hover:opacity-80"
                        >
                          Forgot password
                        </button>
                      </>
                    )}

                    {authPageType === "signUp" && (
                      <p className="text-sm">
                        <span>Already have an account? </span>
                        <Link
                          to={pageRoutes.signIn}
                          className="font-medium text-blue-400 hover:opacity-80"
                        >
                          Sign in
                        </Link>
                      </p>
                    )}
                  </div>
                </>
              )}

              {authPageType === "resetPassword" && (
                <Link
                  to={pageRoutes.signIn}
                  className="mt-3 flex items-center gap-1 font-medium text-blue-400 hover:opacity-80"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                  <span className="text-sm">Return to sign in page</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
      />

      <BackgroundWrapper />
    </>
  );
};
