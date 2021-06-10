type SectionHeaderProps = {
  [x: string]: any;
  text: string;
};
export function SectionHeader(props: SectionHeaderProps) {
  return (
    <div className="relative flex items-center mb-5">
      <hr className="border-2 border-b-0 border-gray-200 absolute w-full" />
      <h4 className="uppercase px-3 lg:px-6 bg-white mx-auto z-10 font-semibold text-sm lg:text-xl text-gray-700 text-center">
        {props.text}
      </h4>
    </div>
  );
}
