import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export function Footer() {
  return (
    <>
      <footer className="w-full p-3 flex justify-center items-center border-t border-gray-200 mt-auto">
        <p className="text-sm text-gray-600">{`Apex v${
          publicRuntimeConfig.version
        } © ${new Date().getFullYear()}`}</p>
      </footer>
    </>
  );
}
