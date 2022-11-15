// import { React } from "react";
// // import { ProfDashboard } from "./Dashboard";
// import { GiMagnifyingGlass } from "react-icons/gi";
// import { useEffect, useState } from "react";
// import { Transition } from "@headlessui/react";

// export default function UserDashboard() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [state, setState] = useState("");

//   return (
//     <>
//       <nav
//         className=" ml-3 mr-3 sticky top-0 z-50"
//         style={{ backgroundColor: "#1a1c23" }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div
//               className="flex items-center mx-auto"
//               style={{
//                 width: "100%",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div className="flex-shrink-0">
//                 <img
//                   style={{ width: "4rem", height: "4rem" }}
//                   //   src={logo}
//                   alt="Workflow"
//                 />
//               </div>
//               <div className="hidden md:block">
//                 <div
//                   className="ml-10 flex items-baseline space-x-4"
//                   style={{ width: "100%", justifyContent: "space-evenly" }}
//                 >
//                   <div className="relative text-gray-600">
//                     <input
//                       type="search"
//                       name="search"
//                       placeholder="Enter state"
//                       className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
//                       list="states"
//                       id="input_state"
//                       onChange={(e) => {
//                         setState(e.target.value);
//                       }}
//                     />
//                     <button
//                       // className="absolute right-0 top-0 mr-4"
//                       style={{ marginTop: "10px" }}
//                       onClick={() => {
//                         // loadDashboardOrphanage(state);
//                       }}
//                     >
//                       <GiMagnifyingGlass
//                         style={{ width: "1.5rem", height: "1.5rem" }}
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="-mr-2 flex md:hidden">
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 type="button"
//                 className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 mr-2"
//                 aria-controls="mobile-menu"
//                 aria-expanded="false"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 {!isOpen ? (
//                   <svg
//                     className="block h-6 w-6"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 6h16M4 12h16M4 18h16"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="block h-6 w-6"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <Transition
//           show={isOpen}
//           enter="transition ease-out duration-200 transform"
//           enterFrom="opacity-0 scale-95"
//           enterTo="opacity-100 scale-100"
//           leave="transition ease-in duration-200 transform"
//           leaveFrom="opacity-100 scale-100"
//           leaveTo="opacity-0 scale-95"
//         >
//           {(ref) => (
//             <div className="md:hidden" id="mobile-menu">
//               <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                 <div className="relative text-gray-600">
//                   <input
//                     name="search_min"
//                     placeholder="Enter state"
//                     className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
//                     list="states_min"
//                     onChange={(e) => {
//                       setState(e.target.value);
//                     }}
//                   />
//                   {/* <datalist id="states_min">
//                     {states.map((state) => (
//                       <option value={state} />
//                     ))}
//                   </datalist> */}
//                   <button
//                     className="absolute right-0 top-0 my-auto mr-4"
//                     onClick={() => {
//                       //   loadDashboardOrphanage(state);
//                     }}
//                   >
//                     <GiMagnifyingGlass
//                       style={{
//                         width: "1.5rem",
//                         height: "1.5rem",
//                         color: "yellowgreen",
//                       }}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </Transition>
//       </nav>
//       <div className="min-h-screen flex flex-row bg-gray-100">
//         <div
//           className="flex flex-col w-56 overflow-hidden ml-3"
//           style={{ backgroundColor: "#1a1c23" }}
//         >
//           <ul className="flex flex-col py-4" style={{ marginTop: "5rem" }}>
//             <li>
//               {orphanages == 1 ? (
//                 <button
//                   className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                   style={{
//                     height: "3rem",
//                     width: "130px",
//                     marginLeft: "2rem",
//                     paddingLeft: "1rem",
//                     backgroundColor: "yellowgreen",
//                     borderRadius: "8px",
//                   }}
//                   onClick={() => {
//                     showOrphanages();
//                   }}
//                 >
//                   {" "}
//                   <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                     Orphanages
//                   </span>
//                 </button>
//               ) : (
//                 <button
//                   className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                   style={{
//                     height: "3rem",
//                     width: "130px",
//                     marginLeft: "2rem",
//                     paddingLeft: "1rem",
//                   }}
//                   onClick={() => {
//                     showOrphanages();
//                   }}
//                 >
//                   {" "}
//                   <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                     Orphanages
//                   </span>
//                 </button>
//               )}
//             </li>
//             <li style={{ marginTop: "1rem" }}>
//               {localStorage.getItem("LogInAs") === "user" ? (
//                 profile == 1 ? (
//                   <button
//                     className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                     style={{
//                       height: "3rem",
//                       width: "130px",
//                       marginLeft: "2rem",
//                       paddingLeft: "1rem",
//                       backgroundColor: "yellowgreen",
//                       borderRadius: "8px",
//                     }}
//                     onClick={() => {
//                       // setOrphanages(0);
//                       // setProfile(1);
//                       userProfile();
//                     }}
//                   >
//                     <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                       Profile
//                     </span>
//                   </button>
//                 ) : (
//                   <button
//                     className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                     style={{
//                       height: "3rem",
//                       width: "130px",
//                       marginLeft: "2rem",
//                       paddingLeft: "1rem",
//                     }}
//                     onClick={() => {
//                       // setOrphanages(0);
//                       // setProfile(1);
//                       userProfile();
//                     }}
//                   >
//                     <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                       Profile
//                     </span>
//                   </button>
//                 )
//               ) : orphanage_profile == 1 ? (
//                 <button
//                   className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                   style={{
//                     height: "3rem",
//                     width: "130px",
//                     marginLeft: "2rem",
//                     paddingLeft: "1rem",
//                     backgroundColor: "yellowgreen",
//                     borderRadius: "8px",
//                   }}
//                   onClick={() => {
//                     // setOrphanages(0);
//                     // setProfile(1);
//                     orphanageProfile();
//                   }}
//                 >
//                   <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                     Profile
//                   </span>
//                 </button>
//               ) : (
//                 <button
//                   className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                   style={{
//                     height: "3rem",
//                     width: "130px",
//                     marginLeft: "2rem",
//                     paddingLeft: "1rem",
//                   }}
//                   onClick={() => {
//                     // setOrphanages(0);
//                     // setProfile(1);
//                     orphanageProfile();
//                   }}
//                 >
//                   <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                     Profile
//                   </span>
//                 </button>
//               )}
//             </li>
//             <li style={{ marginTop: "1rem" }}>
//               <Link to="/News" target="_blank">
//                 <button
//                   className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                   style={{
//                     height: "3rem",
//                     width: "130px",
//                     marginLeft: "2rem",
//                     paddingLeft: "1rem",
//                   }}
//                 >
//                   <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                     News
//                   </span>
//                 </button>
//               </Link>
//             </li>
//             <li style={{ marginTop: "1rem" }}>
//               <button
//                 className="flex flex-row items-center transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-100 hover:text-gray-800"
//                 style={{
//                   height: "3rem",
//                   width: "130px",
//                   marginLeft: "2rem",
//                   paddingLeft: "1rem",
//                 }}
//                 onClick={() => {
//                   // setOrphanages(0);
//                   // setProfile(1);
//                   Logout(navigate);
//                 }}
//               >
//                 <span style={{ fontSize: "15px", letterSpacing: "2px" }}>
//                   Log Out
//                 </span>
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// }
