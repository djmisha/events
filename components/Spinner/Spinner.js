import Image from "next/image";

const Spinner = ({ isLoading, text = "loading" }) => (
  <div className="spinner">
    <div>
      {isLoading && (
        <div className="loader">
          <Image
            src="/images/loading.svg"
            alt="loading"
            width={100}
            height={75}
          />
          <span>{text}</span>
        </div>
      )}
    </div>
  </div>
);

export default Spinner;
