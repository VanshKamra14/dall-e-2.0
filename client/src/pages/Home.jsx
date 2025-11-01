import React, { useState, useEffect } from "react";
import { Loader, Card, FormField } from "../components";
import { API_BASE } from "../config";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        console.log('Fetching from:', `${API_BASE}/api/v1/post`);
        const response = await fetch(`${API_BASE}/api/v1/post`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Posts fetched:', result);
          setAllPosts(result.data.reverse());
        } else {
          console.error('Server responded with:', response.status, await response.text());
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Error loading posts: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const searchValue = e.target.value;
    setSearchText(searchValue);

    setSearchTimeout(
      setTimeout(() => {
        const results = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSearchResults(results);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse a collection of imaginative and visually stunning images
          created with Clipdrop AI and shared by the community
        </p>
      </div>

      <div className="mt-16">
        <FormField
          LabelName="Search posts"
          type="text"
          name="text"
          placeholder="Search posts"
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
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={allPosts} title="No posts yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
