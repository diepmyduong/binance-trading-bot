import { useEffect, useRef } from "react";

type HTMLReviewerProps = {
  [x: string]: any;
  html?: string;
};
export function HTMLReviewer(props: HTMLReviewerProps) {
  const iframRef = useRef(null);
  useEffect(() => {
    if (iframRef) {
      var doc = iframRef.current.contentWindow.document;
      doc.open();
      doc.write(props.html);
      doc.close();
    }
  }, [iframRef, props.html]);

  return (
    <iframe
      {...props}
      className="pointer-events-none w-full h-full rounded-lg mt-1"
      ref={iframRef}
      src="about:blank"
    ></iframe>
  );
}
