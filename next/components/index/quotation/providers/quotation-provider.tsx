import { createContext, useContext, useEffect, useState } from "react";

export const QuotationContext = createContext<
  Partial<{
    step: QUOTATION_STEP;
    setStep: (val: QUOTATION_STEP) => any;
  }>
>({});

export function QuotationProvider(props) {
  const [step, setStep] = useState<QUOTATION_STEP>(null);

  useEffect(() => {
    setStep(QUOTATION_STEP.GENERAL_INFO);
  }, []);

  return (
    <QuotationContext.Provider value={{ step, setStep }}>
      {props.children}
    </QuotationContext.Provider>
  );
}

export const useQuotationContext = () => useContext(QuotationContext);

export enum QUOTATION_STEP {
  GENERAL_INFO,
  SELECT_PRODUCT,
  CONFIRM_QUOTATION,
  COMPLETE,
}

export const QUOTATION_STEPS: Option[] = [
  { value: QUOTATION_STEP.GENERAL_INFO, label: "Điền thông tin" },
  { value: QUOTATION_STEP.SELECT_PRODUCT, label: "Chọn hạng mục" },
  { value: QUOTATION_STEP.CONFIRM_QUOTATION, label: "Xác nhận báo giá" },
];
