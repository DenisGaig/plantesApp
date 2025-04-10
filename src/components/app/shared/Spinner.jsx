import { CircleLoader, DotLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="dot-loader">
      <DotLoader color="#714acc" loading speedMultiplier={1} />
    </div>
  );
};

const CircleLoaderSpinner = () => {
  return (
    <div className="circle-loader">
      <CircleLoader color="#714acc" loading size={100} speedMultiplier={1} />
    </div>
  );
};

export default Spinner;
export { CircleLoaderSpinner };
