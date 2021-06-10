import { NotFound } from "./not-found";
import { IoHourglassOutline } from "react-icons/io5";
export function WIP() {
  return <NotFound icon={<IoHourglassOutline />} text="Tính năng đang được hoàn thiện." />;
}
