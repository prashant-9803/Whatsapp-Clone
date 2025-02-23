import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setContactSearch } from "../../slices/messageSlice";

const SearchBar = () => {


  const {contactSearch, filteredContacts} = useSelector((state) => state.message)
  const dispatch = useDispatch()

  return (
    <div className="bg-search-input-container-background flex pl-5 py-3 items-center gap-3 ">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or Start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full py-1"
            value={contactSearch}
            onChange={(e) => dispatch(setContactSearch(e.target.value))}
          />
        </div>
      </div>

      <div className="pr-5 pl-3 ">
        <BsFilter className="text-panel-header-icon cursor-pointer text-lg" />
      </div>
    </div>
  );
};

export default SearchBar;
