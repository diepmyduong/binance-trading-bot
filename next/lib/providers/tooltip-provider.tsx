import { Placement } from "@popperjs/core";
import { createContext, useContext } from "react";
import tippy from "tippy.js";
import useObserver from "../hooks/useObserver";

const TooltipContext = createContext<{}>(null);

export function TooltipProvider({ theme = "dark", children }: any) {
  const placements = [
    "top",
    "bottom",
    "left",
    "right",
    "top-start",
    "bottom-start",
    "left-start",
    "right-start",
    "top-end",
    "bottom-end",
    "left-end",
    "right-end",
  ];
  const tooltipEl = typeof window !== "undefined" ? document.getElementById("tooltip") : null;
  if (tooltipEl && theme) {
    tooltipEl.classList.add(theme);
  }
  const observerOptions: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ["data-tooltip", "data-placement"],
  };

  ["__next", "dialog-root", "popover-root"].forEach((root) => {
    if (typeof window !== "undefined") {
      const rootEl = document.getElementById(root);
      // if (!rootEl) return;
      let timeout;
      useObserver(
        (mutations) => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            attachTooltip(rootEl);
          }, 300);
        },
        observerOptions,
        root
      );
    }
  });

  const attachTooltip = (el: Element) => {
    if (el.querySelector("[data-tooltip]")) {
      el.querySelectorAll("[data-tooltip]").forEach((el) => {
        const tooltip = el?.getAttribute("data-tooltip");
        if (!(el as any)._tippy && tooltip) {
          const dataPlacement = el?.getAttribute("data-placement");
          let placement: Placement = "auto";
          if (placements.includes(dataPlacement)) {
            placement = dataPlacement as Placement;
          }
          tippy(el, {
            content: tooltip,
            placement,
            animation: "shift-away-subtle",
            appendTo: "parent",
          });
        }
      });
    }
  };

  return <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>;
}

export const useTooltip = () => useContext(TooltipContext);
