import { Card } from "../../shared/utilities/card/card";
import { QuotationHeader } from "./components/quotation-header";
import { StepGeneralInfo } from "./components/step-general-info";
import { QuotationProvider } from "./providers/quotation-provider";

export function QuotationPage() {
  return (
    <QuotationProvider>
      <Card className="p-0 main-container my-16 min-h-md border border-bluegray-200 shadow-bluegray-xl">
        <QuotationHeader />
        <StepGeneralInfo />
      </Card>
    </QuotationProvider>
  );
}
