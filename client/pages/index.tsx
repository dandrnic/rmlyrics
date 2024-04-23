import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';

function Index() {
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
  const [message, setMessage] = useState("Loading");
  const [songImg, setSongImg] = useState(""); // State to store the song image

  useEffect(() => {
    async function getHomeData() {
      try {
        const response = await axios.get("http://localhost:8080/api/home", {
          params: { searchTerm }
        });
        const { message, SongImg } = response.data;
        setMessage(message);
        setSongImg(SongImg); // Set the song image state
        console.log(message);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data");
      }
    }
    getHomeData();
  }, [searchTerm]);

  // Function to handle changes in the search input
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#FAFAFA] py-6 sm:py-12">
      <nav className="fixed left-0 top-0 flex h-screen min-w-[220px] flex-col overflow-auto bg-[#F2F2F2] px-10  font-[sans-serif] shadow-lg">
       <p className="my-10 max-w-[230px] font-sans text-1xl p text-[#7a7a7a]">A (wip) lyrics scraper with eng/romaji translations ♪(ﾉ´∀｀*)ﾉ </p>
       
        <div className="flex cursor-pointer flex-wrap items-center">
          <div className="relative"></div>
       
            <p className="ml-1 font-sans text-2xl text-[#7D7D7D]">song:</p>
       
        </div>
        <div className="relative mt-8 rounded-md bg-[#E1E1E1] px-6 py-4">
          {/* Hook up the input field to onChange event */}
          <input 
            className="text-lg max-w-[200px] bg-transparent px-1 font-sans text-[#000000] outline-none" 
            placeholder="Search"
            value={searchTerm} // Set input value to the state
            onChange={handleSearchInputChange} // Call the handler on input change
          />
        </div>
        <ul className="mt-30 flex-1 space-y-0 pl-3">
          <li>
            <a href="javascript:void(0)" className="relative left-0 flex items-center rounded-md text-sm font-semibold text-[#7D7D7D] transition-all duration-300 hover:left-2"> <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mr-4 h-[18px] w-[18px]" viewBox="0 0 512 512"></svg></a>
          </li>
        </ul>
        <div className="ml-0 flex-1">
          <p className="font-sans text-2xl my-12 text-[#7D7D7D]">now playing:</p>
          <img src={songImg} className="my-5" /> {/* Render the song image */}
        </div>
      </nav>
  
      <div className="min-h-[1000px] bg-white px-4 sm:px-10">
        <p className="font-sans text-left text-1xl mt-20 max-w-[1000px] ml-[400px] text-[#000] break-words leading-loose">
          {message}
        </p>
      </div>
    </div>
  );
  
}

export default Index;
