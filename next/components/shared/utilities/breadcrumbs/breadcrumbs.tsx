import Link from "next/link";
import { useEffect, useState } from "react";

interface PropsType extends ReactProps {
  breadcrumbs: {
    href?: string;
    label: string;
  }[];
  native?: boolean;
  accent?: boolean;
}

export default function BreadCrumbs({ breadcrumbs, ...props }: PropsType) {
  return (
    <div
      className={`text-sm lg:text-base font-semibold ${props.className || ""} ${
        !props.native && " uppercase "
      }`}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index}>
          {breadcrumb.href ? (
            <>
              <Link href={breadcrumb.href}>
                <a
                  className={`text-gray-600 hover:underline ${
                    (props.accent && " hover:text-accent ") || " hover:text-primary "
                  }`}
                >
                  <span>{breadcrumb.label}</span>
                </a>
              </Link>
              <span className="px-1">/</span>
            </>
          ) : (
            <a className={(props.accent && "text-accent ") || " text-primary "}>
              <span>{breadcrumb.label}</span>
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
