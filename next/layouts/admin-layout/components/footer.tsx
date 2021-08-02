import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export function Footer({ className = "" }) {
  return (
    <>
      <footer
        className={`w-full p-3 flex justify-center items-center border-t border-gray-200 text-gray-600 mt-auto ${className}`}
      >
        {`3M v${publicRuntimeConfig.version} © ${new Date().getFullYear()}`}
      </footer>
    </>
  );
}
