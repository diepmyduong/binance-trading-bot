export default function Error({ statusCode }) {
  return null;
  // return <>{statusCode == 500 ? <Error500 /> : <Error404 />}</>;
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 500;
  return { statusCode };
};
