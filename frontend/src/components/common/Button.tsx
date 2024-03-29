import Link from "next/link";
import React from "react";

interface Props {
  label?: string;
  color?:
    | "primary"
    | "secondary"
    | "disabled"
    | "succes"
    | "error"
    | "warning"
    | "switch"
    | "alternative";
  clickHandler?: any;
  className?: string;
  circular?: boolean;
  icon?: any;
  type?: "light" | "dark";
  route?: string;
  loading?: boolean;
  disabled?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
  buttonType?: "menu_nolog" | "menu_log" | "default";
  clickType?: "button" | "submit";
  padding?: string;
}

function Button({
  label,
  color = "primary",
  clickHandler,
  className = "",
  circular,
  icon,
  type = "dark",
  route,
  loading = false,
  disabled = false,
  target = "_self",
  buttonType = "default",
  clickType = "button",
  padding = "md:px-3 md:py-3",
}: Props) {
  const colorize = () => {
    switch (color) {
      case "primary":
        return `${
          type === "dark"
            ? "bg-dark-700 text-light-200"
            : "bg-light-400 text-dark-700"
        }`;
      case "secondary":
        return `${
          type === "dark"
            ? "bg-dark-600 text-light-200"
            : "bg-light-300 text-dark-600"
        }`;
      case "succes":
        return `bg-success-300 text-light-100`;
      case "warning":
        return `bg-warning-300 text-light-100`;
      case "error":
        return `bg-error-500 text-light-100`;
      case "disabled":
        return `bg-dark-700 text-light-300`;
      case "alternative":
        return `${type === "dark" ? "bg-light-300" : "bg-dark-400"}`;
      case "switch":
        return `${type === "dark" ? "bg-dark-300" : "bg-light-400"}`;
    }
  };

  const getButtonType = () => {
    switch (buttonType) {
      case "default":
        return ``;
      case "menu_nolog":
        return `2xl:px-24 xl:px-20 md:px-14 md:rounded-tl-[200px] md:rounded-bl-[50px] md:rounded-tr-[50px] md:rounded-br-[200px] rounded-md text-dark-100 `;
      case "menu_log":
        return `xl:w-[200px] lg:w-[160px] md:w-[120px] w-[100px] h-[50px] text-lg rounded-md bg-dark-100 text-light-400 text-center`;
      default:
        return ``;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // console.log(e);
    if (e?.button !== 0) {
      return false;
    }

    clickHandler(e);
  };

  const ButtonRender = () => {
    return (
      <button
        className={`${
          icon || circular
            ? "p-0.5"
            : buttonType === "menu_log"
            ? padding
            : "py-3 px-5"
        } ${className} ${colorize()}  ${
          loading || disabled ? "bg-dark-400 text-dark-600" : ""
        } ${
          circular
            ? circular && label
              ? "rounded-md"
              : "rounded-full"
            : "rounded-md"
        } ${getButtonType()} transition ease-in-out delay-150 hover:bg-opacity-50 hover:text-light-200 text-center md:text-base text-sm`}
        onMouseDown={clickHandler && handleClick}
        disabled={disabled || loading}
        type={clickType}
      >
        {label}

        {icon ? icon : <></>}
      </button>
    );
  };

  return route ? (
    <Link href={route} target={target}>
      <a>{ButtonRender()}</a>
    </Link>
  ) : (
    <>{ButtonRender()}</>
  );
}

export default Button;
