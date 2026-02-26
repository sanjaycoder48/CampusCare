import { Newspaper, BellElectric, ScrollText } from "lucide-react";

function Sidebar() {
  return (
    <aside className="border-2 w-58 h-64 ">
      <div className=" h-full ">
      <div className="flex gap-2 mb-3 ">
        <img src="" alt="logo" className="" />
        <span className="font-bold">CampusCare</span>
      </div>
      <div className="flex flex-col ">
      <div className="m-2">
        <button className="flex gap-2 hover:bg-gray-100 rounded-xl p-2 ">
        <span>
          <Newspaper />
        </span>
        <p>DashBoard</p>
        </button>
      </div>
      <div className="m-2">
        <button className="flex gap-2 hover:bg-gray-100 rounded-xl p-2">
        <span>
          <BellElectric />
        </span>
        <p>EmergencyLog</p>
        </button>
      </div>
      <div className="m-2">
        <button className="flex gap-2 hover:bg-gray-100 rounded-xl p-2">
          <span>
            <ScrollText />
          </span>
          <p>My Complaint</p>
        </button> 
      </div>
      </div>
      </div>
      <div className="">
          <button className="">
            <img src="" alt="profile photo" className=""/>
            <span></span>
            <p></p>
          </button>
      </div>
    </aside>
  );
}

export default Sidebar;