import { Link } from 'react-router-dom';
import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { useState } from 'react';

const Header = (props: { setSidebarOpen: (arg0: boolean) => void; sidebarOpen: any; }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-boxdark">
      <div className="flex flex-grow items-center justify-between bg-gradient-to-r from-white to-[#f60] px-4 py-4 shadow-2 md:px-6 2xl:px-11"> <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle Button */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="relative block h-0.5 w-full bg-black dark:bg-white my-1 transition-all duration-200 ease-in-out"></span>
              <span className="relative block h-0.5 w-full bg-black dark:bg-white my-1 transition-all duration-200 ease-in-out"></span>
              <span className="relative block h-0.5 w-full bg-black dark:bg-white my-1 transition-all duration-200 ease-in-out"></span>
            </span>
          </button>
          {/* Hamburger Toggle Button */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img 
              src='src/images/logo/logo-top.SVG' 
              alt="Logo" 
              className="w-full max-w-xs h-auto rounded-full sm:max-w-sm md:max-w-md lg:max-w-xs" 
            />
          </Link>
        </div>

        <div className={`flex-grow hidden sm:block ${menuOpen ? 'hidden' : ''}`}>
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
            {/* Dark Mode Toggler */}

            {/* Notification Menu Area */}
            <DropdownNotification />
            {/* Notification Menu Area */}

            {/* Chat Notification Area */}
            <DropdownMessage />
            {/* Chat Notification Area */}

            {/* Menu Button for Smaller Screens */}
            <button
              onClick={toggleMenu}
              className="sm:hidden flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <span className="text-black dark:text-white">...</span>
            </button>
            {/* Menu Button for Smaller Screens */}
          </ul>

          {/* User Area */}
          <DropdownUser />
          {/* User Area */}
        </div>
      </div>

      {/* Dropdown Menu for Smaller Screens */}
      {menuOpen && (
        <div className="absolute right-0 top-16 bg-white dark:bg-boxdark shadow-md rounded-md p-2 z-50">
          <ul className="flex flex-col gap-2">
            <li><DarkModeSwitcher /></li>
            <li><DropdownNotification /></li>
            <li><DropdownMessage /></li>
            <li><DropdownUser /></li>
          </ul>
        </div>
      )}
      {/* Dropdown Menu for Smaller Screens */}
    </header>
  );
};

export default Header;