interface PropsType extends ReactProps {
  title?: string;
  primary?: boolean;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}
export function FieldSet(props: PropsType) {
  return (
    <fieldset
      className={`grid grid-cols-12 gap-x-5 auto-rows-min ${
        props.cols ? "col-span-" + props.cols : "col-span-12"
      } ${props.className || ""}`}
      style={props.style}
    >
      <h6
        className={`col-span-12 text-lg uppercase text-center font-bold ${
          props.primary ? "text-primary" : "text-gray-600"
        }`}
      >
        {props.title}
      </h6>
      {props.children}
    </fieldset>
  );
}
