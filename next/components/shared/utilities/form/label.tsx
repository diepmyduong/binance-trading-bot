import { FaAsterisk, FaInfoCircle } from "react-icons/fa";

interface PropsType extends ReactProps {
  text: string;
  htmlFor?: string;
  tooltip?: string;
  required?: boolean;
  error?: string;
}

export function Label({ ...props }: PropsType) {
  return (
    <label
      htmlFor={props.htmlFor}
      className={`flex items-center text-base w-full font-semibold min-h-6 pl-1 mb-1 ${
        props.className || ""
      }`}
    >
      <span
        className={`inline-flex items-center ${
          props.error ? "text-danger" : "text-gray-600"
        }`}
      >
        {props.text}
        {props.required && (
          <sup
            className={`ml-1 text-8 ${
              props.error ? "text-danger" : "text-primary"
            }`}
          >
            <FaAsterisk />
          </sup>
        )}
        {props.tooltip && (
          <i
            className="text-base inline-block ml-1.5 text-gray-500"
            data-tooltip={props.tooltip}
          >
            <FaInfoCircle />
          </i>
        )}
      </span>
      {props.children}
    </label>
  );
}
