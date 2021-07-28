import React, { useState } from "react";
import BreadCrumbs from "../../../shared/utilities/breadcrumbs/breadcrumbs";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Checkbox } from "../../../shared/utilities/form/checkbox";
import { Button } from "../../../shared/utilities/form/button";

export function RegisterPage() {
  const { shopCode } = useShopContext();
  return (
    <div className="bg-white shadow  min-h-screen  relative rounded-md w-full">
      <div className="px-4">
        <BreadCrumbs
          breadcrumbs={[{ label: "Trang chủ", href: `/${shopCode}` }, { label: "Đăng ký CTV" }]}
          className="pt-4"
        />
        <h1 className=" text-28 font-semibold py-2 pt-4">Terms of service</h1>
        <p>{termService}</p>
      </div>
      <div className="flex flex-col p-4 pt-2 border-t-2 sticky bottom-0 bg-white">
        <Checkbox placeholder="Tôi đồng ý với diều khoản" defaultValue={true} />
        <Button text="Đăng ký" primary className="bg-gradient" large />
      </div>
    </div>
  );
}
const termService = `Terms of service (also known as terms of use and terms and conditions, commonly abbreviated
  as TOS or ToS, ToU or T&C) are the legal agreements between a service provider and a person
  who wants to use that service. The person must agree to abide by the terms of service in
  order to use the offered service.[1] Terms of service can also be merely a disclaimer,
  especially regarding the use of websites. Vague language and lengthy sentences used in the
  terms of use have brought concerns on customer privacy and raised public awareness in many
  ways. A terms of service agreement typically contains sections pertaining to one or more of
  the following topic Disambiguation/definition of key words and phrases User rights and
  responsibilities Proper or expected usage; definition of misuse Accountability for online
  actions, behavior, and conduct Privacy policy outlining the use of personal data Payment
  details such as membership or subscription fees, etc. Opt-out policy describing procedure
  for account termination, if available Sometimes contains a Arbitration clause detailing the
  dispute resolution process and limited rights to take a claim to court Disclaimer/Limitation
  of Liability clarifying the site's legal liability for damages incurred by users User
  notification upon modification of terms, if offered Among 102 companies marketing genetic
  testing to consumers in 2014 for health purposes, 71 had publicly available terms and
  conditions:[4] 57 of the 71 had disclaimer clauses (including 10 disclaiming liability for
  injury caused by their own negligence), 51 let the company change terms (including 17
  without notice), 34 allow data disclosure in certain circumstances, 31 require consumers to
  indemnify the company, 20 promise not to sell data. Among 260 mass market consumer software
  license agreements in 2010,[5] 91% disclaimed warranties of merchantability or fitness for
  purpose or said it was "As is" 92% disclaimed consequential, incidental, special or
  foreseeable damages 69% did not warrant the software was free of defects or would work as
  described in the manual 55% capped damages at the purchase price or less 36% said they were
  not warranting whether it infringed others' intellectual property rights 32% required
  arbitration or a specific court 17% required the customer to pay legal bills of the maker
  (indemnify), but not vice versa Among the terms and conditions of 31 cloud-computing
  services in January-July 2010, operating in England,[6] 27 specified the law to be used (a
  US state or other country), most specify that consumers can claim against the company only
  in a particular city in that jurisdiction, though often the company can claim against the
  consumer anywhere, some require claims to be brought within half a year to 2 years, 7 impose
  arbitration, all forbid illegal and objectionable conduct by the consumer, 13 can amend
  terms just by posting changes on their own website, a majority disclaim responsibility for
  confidentiality or backups, most promise to preserve data only briefly after terminating
  service, few promise to delete data thoroughly when the customer leaves, some monitor the
  customers' data to enforce their policies on use, all disclaim warranties and almost all
  disclaim liability, 24 require the customer to indemnify them, a few indemnify the customer,
  a few give credits for poor service, 15 promise "best efforts" and can suspend or stop any
  time. The researchers note that rules on location and time limits may be unenforceable for
  consumers in many jurisdictions with consumer protections, that acceptable use policies are
  rarely enforced, that quick deletion is dangerous if a court later rules the termination
  wrongful, that local laws often require warranties (and UK forced Apple to say so).`;
