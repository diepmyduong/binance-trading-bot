import { useState } from "react";

import { Card } from "../../../../components/shared/utilities/card/card";
import Email from "./component/email";
import { EmailProvider } from "./providers/email-provider";

export default function EmailMarketingPage() {
  return (
    <>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-3">
          <Card className="px-0 py-0">
            <EmailProvider>
              <Email></Email>
            </EmailProvider>
          </Card>
        </div>
      </div>
    </>
  );
}
