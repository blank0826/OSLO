import React from "react";
import cx from "classnames";

export default function Down({ isOpen }) {
  return (
    <svg
      className={cx("iconQuery-down", { "isQuery-open": isOpen })}
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path d="M14.8 4L8 9.6 1.2 4 0 5.333 8 12l8-6.667z" />
    </svg>
  );
}
Down.defaultProps = {};
