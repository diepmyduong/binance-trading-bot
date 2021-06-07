interface PropsType extends ReactProps {}
import { DefaultHead } from "./../default-head";

export function NoneLayout({ ...props }: PropsType) {
  return (
    <>
      <DefaultHead />
      <div className="flex flex-col w-full min-h-screen">{props.children}</div>
    </>
  );
}
