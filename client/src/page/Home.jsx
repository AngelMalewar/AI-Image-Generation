import React, { useEffect, useState } from "react";

import { Card, FormField, Loader } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://yoginiupgrad.onrender.com/api/v1/post",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="bg-gradient-to-r from-cyan-500 to-blue-500  rounded py-10 px-10">
      <section className="max-w-7xl mx-auto ">
        <section className="bg-gradient-to-r from-violet-500 to-fuchsia-500 py-10 px-10 rounded">
          <div>
            <h1 className="font-extrabold text-[#222328]  text-[32px]">
              Our Community Spotlight
            </h1>
            <p className="mt-2 text-[#ffffff] text-[14px] max-w-[500px]">
              Immerse Yourself in our gallery of Images Created and Designed by
              Artificial Intelligence-Upgrad!
            </p>
          </div>
        </section>
        <div className="mt-16">
          <FormField
            labelName="Search posts"
            type="text"
            name="text"
            placeholder="Search something..."
            value={searchText}
            handleChange={handleSearchChange}
          />
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing Resuls for{" "}
                  <span className="text-[#222328]">{searchText}</span>:
                </h2>
              )}
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                {searchText ? (
                  <RenderCards
                    data={searchedResults}
                    title="No Search Results Found"
                  />
                ) : (
                  <RenderCards data={allPosts} title="No Posts Yet" />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </section>
  );
};

export default Home;
