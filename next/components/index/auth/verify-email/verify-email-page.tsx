import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAlert } from "../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";

export function VerifyEmailPage() {
  const router = useRouter();
  const alert = useAlert();
  const toast = useToast();
  const [sig, setSig] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (router.isReady) {
      const sig = router.query["sig"];
      if (!sig) {
        alert.error("Đường dẫn không hợp lệ", "Thiếu token").then(() => {
          router.replace("/404");
        });
      } else {
        setSig(sig);
      }
    }
  }, [router.isReady]);

  // useEffect(() => {
  //   if (sig) {
  //     // UserService.validateVerifyEmailSig(sig)
  //     //   .then((res) => {
  //     //     UserService.verifyEmail(sig).then((res) => {
  //     //       alert.info("Email đã được xác thực", "Xác nhận chuyển về trang chủ").then(() => {
  //     //         router.replace("/auth/login");
  //     //       });
  //     //     });
  //     //   })
  //     //   .catch((err) => {
  //     //     console.error(err);
  //     //     alert.error("Đường dẫn không hợp lệ", err.message).then(() => {
  //     //       router.replace("/404");
  //     //     });
  //     //   });
  //   }
  // }, [sig]);

  return (
    <>
      <div className="flex flex-col min-h-screen"></div>
    </>
  );
}
