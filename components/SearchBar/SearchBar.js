import Image from "next/image";

const SearchBar = () => {
  const handleClick = (e, value) => {
    e.preventDefault();
    console.log(value);
  };
  let input;
  return (
    <section className="search">
      <form action="#" id="form-search">
        <Image
          src="/images/icon-search.svg"
          alt="Venue"
          width={30}
          height={30}
        />
        <label htmlFor="input-search">search</label>
        <input
          type="text"
          name="search"
          id="input-search"
          // value="Search by artist, event or venue"
          ref={(node) => {
            input = node;
          }}
        />
        <button id="submit-search" onClick={(e) => handleClick(e, input.value)}>
          Search
        </button>
      </form>
    </section>
  );
};

export default SearchBar;
