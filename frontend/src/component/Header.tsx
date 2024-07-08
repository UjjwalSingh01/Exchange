import { Link, useNavigate } from "react-router-dom";
import 'flowbite'

interface HeaderProps {
  firstname: string;
}

export default function Header(props : HeaderProps) {
  const navigate = useNavigate()

  async function handleSignout() {
    localStorage.clear();

    navigate('/')
  }

  return (
    <div className="flex justify-between p-4 border-b-[1px] border-gray-400">

      <div>
        <h1 className="text-2xl font-bold">Exchange</h1>
      </div>

      <div className="flex items-center">
        <h1 className="text-xl">Hello {props.firstname}</h1>
      

      
        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
          </svg>
        </button>


        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
              <li>
                <Link to={'/dashboard'} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to={'/transfer'} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Transfer Money</Link>
              </li>
            </ul>
            <div className="py-2">
              <button onClick={() => {handleSignout()}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Out</button>
            </div>
        </div>
      </div>
    </div>
  );
}
