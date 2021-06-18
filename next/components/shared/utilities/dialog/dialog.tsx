import { Children, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useDevice from "../../../../lib/hooks/useDevice";
import useScrollBlock from "../../../../lib/hooks/useScrollBlock";
import { HiOutlineX } from "react-icons/hi";

export interface DialogPropsType extends ReactProps {
  wrapperClass?: string;
  overlayClass?: string;
  dialogClass?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  title?: string;
  icon?: JSX.Element;
  width?: string;
  maxWidth?: string;
  mobileMode?: boolean;
  openAnimation?: string;
  closeAnimation?: string;
  root?: string;
  isOpen?: boolean;
  onClose?: () => any;
  onOverlayClick?: () => any;
}

const ROOT_ID = "dialog-root";
export function Dialog({
  wrapperClass = "fixed w-screen h-screen top-0 left-0 z-100 flex flex-col overflow-y-scroll py-20",
  overlayClass = "fixed w-full h-full top-0 left-0 pointer-events-none",
  dialogClass = "relative bg-white shadow-md rounded m-auto",
  headerClass = "relative flex justify-between px-4 py-1 box-content bg-white z-5 border-top rounded-t border-b border-gray-200",
  bodyClass = "relative bg-white rounded",
  footerClass = "relative flex px-4 pb-3 pt-2 bg-white z-5 rounded-b",
  mobileMode = true,
  width = "auto",
  maxWidth = "86vw",
  title = "",
  icon = null,
  style = {},
  onOverlayClick = () => props.onClose(),
  ...props
}: DialogPropsType) {
  const { isMobile, isSSR } = useDevice();
  if (isSSR) return null;

  const [isOpen, setIsOpen] = useState(props.isOpen);
  let isClickingOverlay = false;

  useEffect(() => {
    let timeout;
    if (props.isOpen) {
      setIsOpen(props.isOpen);
    } else {
      timeout = setTimeout(() => {
        setIsOpen(props.isOpen);
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [props.isOpen]);

  useScrollBlock({ rootId: ROOT_ID, dependencies: [isOpen] });

  let header = Children.map(props.children, (child) =>
    child?.type?.displayName === "Header" ? child : null
  );
  let body = Children.map(props.children, (child) =>
    child?.type?.displayName === "Body" ? child : null
  );
  let footer = Children.map(props.children, (child) =>
    child?.type?.displayName === "Footer" ? child : null
  );
  let children = Children.map(props.children, (child) =>
    !child?.type?.displayName ? child : null
  );

  if (title && !header.length) {
    header = [
      <>
        <div className="flex items-center">
          {icon ? <i className="text-lg text-primary mr-2">{icon}</i> : null}
          <span className="text-gray-700 text font-semibold">{title}</span>
        </div>
        <button className="btn-default transform translate-x-4" onClick={() => props.onClose()}>
          <i className="text-lg">
            <HiOutlineX />
          </i>
        </button>
      </>,
    ];
  }

  let el = (
    <div
      className={`dialog-wrapper ${wrapperClass} ${mobileMode && isMobile ? "mobile" : "mobile"}`}
      style={{ ...style }}
      onMouseDown={(e) => {
        e.stopPropagation();
        isClickingOverlay = true;
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        if (isClickingOverlay) {
          onOverlayClick();
          isClickingOverlay = false;
        }
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`dialog-overlay ${overlayClass} ${
          props.isOpen ? "animate-emerge" : "animate-fade"
        }`}
        style={{
          backgroundColor: "rgba(0,0,0,.32)",
        }}
      ></div>
      <div
        className={`dialog ${dialogClass} ${
          props.isOpen
            ? props.openAnimation
              ? props.openAnimation
              : mobileMode && isMobile
              ? "animate-slide-in-bottom"
              : "animate-scale-up"
            : props.closeAnimation
            ? props.closeAnimation
            : mobileMode && isMobile
            ? "animate-slide-out-bottom"
            : "animate-scale-down"
        }`}
        style={{ width, maxWidth }}
        onMouseDown={(e) => {
          e.stopPropagation();
          isClickingOverlay = false;
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          isClickingOverlay = false;
        }}
      >
        {header?.length ? <div className={`dialog-header ${headerClass}`}>{header[0]}</div> : null}
        {body?.length ? <div className={`dialog-body ${bodyClass}`}>{body[0]}</div> : null}
        {children}
        {footer?.length ? <div className={`dialog-footer ${footerClass}`}>{footer[0]}</div> : null}
      </div>
    </div>
  );

  return isOpen ? createPortal(el, document.getElementById(props.root || ROOT_ID)) : null;
}

const Header = ({ children }) => children;
Header.displayName = "Header";
Dialog.Header = Header;

const Body = ({ children }) => children;
Body.displayName = "Body";
Dialog.Body = Body;

const Footer = ({ children }) => children;
Footer.displayName = "Footer";
Dialog.Footer = Footer;
