import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page(props) {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin");
  }, []);
  return <></>;
}
