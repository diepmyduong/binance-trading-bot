import { QUOTATION_STEPS, useQuotationContext } from "../providers/quotation-provider";

export function QuotationHeader() {
  const { step, setStep } = useQuotationContext();

  return (
    <div className="flex h-18 -mx-4">
      <div className="flex-1 bg-gray-100 flex">
        {QUOTATION_STEPS.map((quotationStep, index) => (
          <div
            className={`relative flex-1 flex items-center justify-center h-full px-3 group cursor-pointer transition-colors ${
              quotationStep.value == step ? "bg-primary" : ""
            }`}
            key={quotationStep.value}
            onClick={() => setStep(quotationStep.value)}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 mr-2 rounded-full font-semibold ${
                quotationStep.value == step
                  ? "bg-white text-primary"
                  : "bg-gray-400 text-white group-hover:bg-primary"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`font-semibold uppercase ${
                quotationStep.value == step
                  ? "text-white"
                  : "text-gray-400 group-hover:text-primary"
              }`}
            >
              {quotationStep.label}
            </span>
            {quotationStep.value != step && (
              <div className="absolute right-0 h-8 border-l border-gray-300 top-1/2 transform -translate-y-1/2"></div>
            )}
          </div>
        ))}
      </div>
      <div className="border-l-8 border-primary-dark px-4 flex justify-between items-center bg-primary-light text-primary w-1/4 min-w-2xs">
        <span className="font-semibold">Tổng tiền</span>
        <span className="text-lg font-bold">100.000.000đ</span>
      </div>
    </div>
  );
}
