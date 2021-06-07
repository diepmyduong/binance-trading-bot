interface PropTypes extends ReactProps {
  name: string
};
export function SettingName({
  name,
  ...props
}: PropTypes) {

  return <div className="text-gray-600 font-semibold pl-1 pb-1">{name}</div>
}
