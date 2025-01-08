import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toast() {
  return (
    <ToastContainer
      autoClose={3000}
      pauseOnHover
      theme="light"
      position="top-right"
    />
  );
}

export function notifyError(text: string) {
  return toast.error(text);
}
export function notifyWarning(text: string) {
  return toast.warning(text);
}
export function notifySuccess(text: string) {
  return toast.success(text);
}
