import { useEffect, useState } from "react";
import { React } from "react";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoBookSharp } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsInfoCircle } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { TbCreditCard } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { VscFilePdf } from "react-icons/vsc";
import { GrDocumentWord, GrDocumentPpt } from "react-icons/gr";
import { MdOndemandVideo } from "react-icons/md";
import { RiFolderReceivedFill } from "react-icons/ri";
import PulseLoader from "react-spinners/PulseLoader";
import lockedFolder from "../../images/lock.png";
import enrolledFolder from "../../images/open-folder.png";
import {
  LogoutStudent,
  fetchCourses,
  accessUser,
  getURL,
  uploadQuery,
  fetchTags,
  fetchDept,
  accessUserName,
} from "../../Firebase";

import Select from "react-select";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import UserProfile from "../Profile/UserProfile";
import UserQuery from "./UserQuery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function notifyUserDashboard(msg) {
  toast(msg);
}

export default function UserDashboard() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openedCourseData, setOpenedCourseData] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [queryVisibility, setQueryVisibility] = useState(false);
  const [openQueryDialog, setQueryDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [backDisplay, setBackDisplay] = useState(false);
  const [profileDisplay, setProfileDisplay] = useState(false);
  const [showQueries, setShowQueries] = useState(false);
  const [animLoading, setAnimLoading] = useState(false);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#C490E4");

  const override = {
    display: "block",
    margin: "15rem 5rem 5rem 35rem",
    borderColor: "#C490E4",
  };

  const navigate = useNavigate();

  useEffect(() => {
    componentDidUpdate();

    document.body.classList.add("overflow-x-hidden");

    // console.log(courses);
    // console.log("!");
    if (courses.length == 0) {
      let val = [];
      let arr = fetchCourses();
      val = val.concat(arr);
      setCourses(val);
      setAllCourses(val);
      // console.log("2");
    } else {
      if (enrollCourses.length == 0) {
        let val = [];
        let arr = accessUser();
        val = val.concat(arr);
        setEnrollCourses(val);
        // console.log("3");
      }
      // console.log("4");
    }

    if (allTags.length == 0) {
      // console.log("5");
      let val = [];
      let arr = fetchDept();
      val = val.concat(arr);
      // console.log(val);
      let val2 = [];
      let arr2 = fetchTags();
      val2 = val2.concat(arr2);
      // console.log(val2);

      if (val.length != 0 && val2.length != 0) {
        const groupedOptions = [
          {
            label: "Department",
            options: val,
          },
          {
            label: "Tags",
            options: val2,
          },
        ];

        setAllTags(groupedOptions);
      }
    }
    // console.log(courses);
  }, [courses, enrollCourses]);

  function componentDidUpdate() {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }

  const handleClickOpen = () => {
    setQueryDialog(true);
  };

  const handleClose = () => {
    setQueryDialog(false);
    setQuery("");
  };

  const handleChange = (selectedOptions) => {
    var arr = [];
    arr = arr.concat(selectedOptions);
    // setTag(arr);

    var arr2 = [];
    arr.map((tag) => {
      arr2.push(tag.value);
    });
    var taggedCourseAll = [];
    var uniqueKey = [];
    for (var i = 0; i < arr2.length; i++) {
      var tag = arr2[i];
      for (var j = 0; j < allCourses.length; j++) {
        var course = allCourses[j];
        if (
          course.data["dept"].includes(tag) ||
          course.data["tag"].indexOf(tag) != -1
        ) {
          if (!uniqueKey.includes(course.key)) {
            uniqueKey.push(course.key);
            taggedCourseAll = taggedCourseAll.concat(course);
          }
        }
      }
    }
    console.log(courses);
    console.log(taggedCourseAll);
    setBackDisplay(false);
    setQueryVisibility(false);
    setLocation("");
    setCourses(taggedCourseAll);
  };

  const getDownloadURL = async (name) => {
    getURL(location, name);
  };

  const handleStudentSignOut = () => {
    LogoutStudent(navigate);
  };

  const openCCourse = (courseKey) => {
    checkEnrolled(courseKey);
    setQueryVisibility(true);
    setBackDisplay(true);
    setLocation(location + "" + courseKey);
    // updateCourse(location + "/" + courseKey);
    // console.log(courseKey);
    var data = allCourses.filter((course) => course.key == courseKey);
    setOpenedCourseData(data);
    let val = courses;
    let arr = val.filter((c) => c.key == courseKey);
    arr = arr[0].data.content;
    setCourses(arr);
  };

  const checkEnrolled = (courseKey) => {
    console.log(enrollCourses);
    console.log(courseKey);
    for (let i = 0; i < enrollCourses.length; i++) {
      if (enrollCourses[i] == courseKey) {
        setEnrolled(true);
        return;
      }
    }

    setEnrolled(false);
    return;
  };

  const openFCourse = (index) => {
    console.log(enrolled);
    console.log(index);
    if (index > 0 && !enrolled) {
      notifyUserDashboard(
        "You are not enrolled in the course. First enroll to access the modules."
      );
      return;
    }

    setLocation(location + "/" + index);
    console.log(index);
    let val = courses;
    let arr = val[index];
    console.log(arr);
    setCourses(arr);
  };

  function getNames(enrolledCourses) {
    let newArr = [];
    console.log(courses);
    console.log(enrollCourses);
    courses.map((course) => {
      if (enrolledCourses.includes(course.key)) {
        const childData = course.data;
        const childKey = course.key;
        newArr.push({ key: childKey, data: childData });
      }
    });

    setCourses(newArr);
  }

  const enrolledCourses = () => {
    getNames(enrollCourses);
  };

  const searchCourses = () => {
    if (courseSearch == "") {
      return;
    }

    let arr = [];

    let checkCode = courseSearch.toUpperCase();

    console.log(checkCode);

    for (var i = 0; i < allCourses.length; i++) {
      if (allCourses[i].key == checkCode) {
        const childData = allCourses[i].data;
        const childKey = allCourses[i].key;
        arr.push({ key: childKey, data: childData });
      }
    }

    if (arr.length == 0) {
      notifyUserDashboard(
        "The mentioned course doesn't exist. Kindly check the course code and try again!"
      );
    } else {
      setCourses(arr);
    }
    setCourseSearch("");
  };

  const submitQuery = () => {
    setQueryDialog(false);
    setQuery("");
    let queryContent = query;
    let locationCourse = location;
    var index = locationCourse.indexOf("/");

    if (index != -1) {
      locationCourse = locationCourse.substring(0, index);
    }
    console.log(locationCourse);
    uploadQuery(locationCourse, queryContent);

    //add query
  };

  const goBack = () => {
    let locationCourse = location;
    var index = location.indexOf("/");

    if (index == -1) {
      console.log("2");
      setCourses(allCourses);
      setBackDisplay(false);
      setQueryVisibility(false);
      setLocation("");
    } else {
      locationCourse = locationCourse.substring(0, index);
      setLocation(locationCourse);
      for (var i = 0; i < allCourses.length; i++) {
        if (allCourses[i].key == locationCourse) {
          setCourses(allCourses[i].data.content);
        }
      }
    }
  };

  function handleHover(itemClass) {
    var moduleName = itemClass.target.innerText;
    if (moduleName.indexOf("Module") == -1) {
      var folderKey = moduleName.substring(0, moduleName.indexOf("\n"));
      document.getElementById(folderKey).classList.add("folder");
    } else {
      var folderId = moduleName.replaceAll(" ", "");
      document.getElementById(folderId).classList.add("folder");
    }
  }

  function handleHoverOut(itemClass) {
    var moduleName = itemClass.target.innerText;
    if (moduleName.indexOf("Module") == -1) {
      var folderKey = moduleName.substring(0, moduleName.indexOf("\n"));
      document.getElementById(folderKey).classList.remove("folder");
    } else {
      var folderId = moduleName.replaceAll(" ", "");
      document.getElementById(folderId).classList.remove("folder");
    }
  }

  return (
    <>
      <header
        class="py-6 bg-gray-700 text-white text-center flex justify-around"
        style={{ height: "12vh", backgroundColor: "#FCE2DB" }}
      >
        <h1
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
        >
          About OSLO
        </h1>
        <h1
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
        >
          Contact OSLO
        </h1>
        <h1
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
        >
          Creators
        </h1>
        <Dialog open={openQueryDialog} onClose={handleClose}>
          <DialogTitle>Raise a Query</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your queries will be directly viewed by the professors of the
              respective course.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Query"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={submitQuery}>Submit</Button>
          </DialogActions>
        </Dialog>
      </header>
      <div className="flex flex-row">
        <ToastContainer />
        <div
          className={`${open ? "w-0" : "w-64"} flex flex-col`}
          style={{ height: "158vh" }}
        >
          <div className="absolute mx-auto my-10">
            <button>
              <BsFillArrowRightSquareFill
                onClick={() => setOpen(!open)}
                className={`${open == true ? "mt-12" : ""}`}
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
              />
            </button>
          </div>
          <div
            className={` ${
              open ? "-translate-x-full" : "translate-x-0"
            } flex-col h-screen p-3 duration-300 absolute`}
            style={{ background: "#C490E4", height: "158vh" }}
          >
            <div className="space-y-4" style={{ marginTop: "5rem" }}>
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "#ffffff", fontFamily: "Merriweather" }}
                >
                  Dashboard
                </h2>
                <button
                  onClick={() => setOpen(!open)}
                  style={{ color: "#ffffff" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <input
                  type="search"
                  name="Search"
                  placeholder="Eg: CSD304, CSD311"
                  className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none"
                  onChange={(e) => setCourseSearch(e.target.value)}
                  value={courseSearch}
                />
                <span className="absolute inset-y-0 left-0 flex items-center py-4">
                  <button
                    type="submit"
                    className="p-2 focus:outline-none focus:ring"
                    onClick={searchCourses}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </span>
              </div>
              <div className="flex-1">
                <ul className="pt-2 pb-4 space-y-1 text-sm">
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <Select
                      isMulti
                      name="tags"
                      options={allTags}
                      className="basic-multi-select bg-purple-300 text-gray-800"
                      classNamePrefix="mySelect"
                      onChange={handleChange}
                      placeholder="Tags"
                    />
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setProfileDisplay(false);
                      // setOpenedCourseData("");
                      setShowQueries(false);
                      setLocation("");
                      setCourses(fetchCourses);
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md cursor-pointer">
                      <IoBookSharp className="w-6 h-6 text-gray-100 fill-white stroke-current" />
                      <span
                        className="text-gray-100 tracking-wider"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        All Courses
                      </span>
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setLocation("");
                      // setOpenedCourseData("");
                      setShowQueries(false);
                      setProfileDisplay(false);
                      enrolledCourses();
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md cursor-pointer">
                      <BsPencilSquare className="w-6 h-6 text-gray-100 fill-white stroke-current" />
                      <span
                        className="text-gray-100 tracking-wider"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Enrolled In
                      </span>
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div
                      className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                      onClick={() => {
                        setProfileDisplay(true);
                        setOpenDetail(false);
                        setBackDisplay(false);
                        setShowQueries(false);
                        setQueryVisibility(false);
                      }}
                    >
                      <CgProfile className="w-6 h-6 text-gray-100 fill-white stroke-current" />
                      <span
                        className="text-gray-100"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Profile
                      </span>
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div
                      className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                      onClick={() => {
                        setQueryVisibility(false);
                        setBackDisplay(false);
                        setLocation("");
                        setOpenDetail(false);
                        setShowQueries(true);
                        setProfileDisplay(false);
                      }}
                    >
                      <CgProfile className="w-6 h-6 text-gray-100 fill-white stroke-current" />
                      <span
                        className="text-gray-100"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        My Queries
                      </span>
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div
                      className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                      onClick={handleStudentSignOut}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span
                        className="text-gray-100"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Logout
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <section class="text-gray-600 body-font">
            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
                background: "#C490E4",
                fontSize: "30px",
                letterSpacing: "0.04em",
                color: "#FCE2DB",
                fontWeight: "900",
                fontFamily: "Playfair Display",
              }}
            >
              <div
                className={`${openDetail == false ? "" : "ml-8"} p-6 ${
                  open ? "ml-0" : ""
                }`}
              >
                Hello {accessUserName()} !
              </div>
              <button
                className="saveProfileButton"
                style={{
                  // height: "4rem",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  marginRight: "11rem",
                  display: queryVisibility ? "block" : "none",
                  background: "#C490E4",
                  fontSize: "20px",
                  border: "2px solid #F7E8F6",
                  color: "#F7E8F6",
                  fontFamily: "Playfair Display",
                }}
                onClick={handleClickOpen}
              >
                Raise Query
              </button>
            </div>
            <RiFolderReceivedFill
              className="cursor-pointer"
              onClick={goBack}
              style={{
                color: "black",
                float: "right",
                marginTop: "0.5rem",
                marginRight: "11rem",
                width: "2rem",
                height: "2rem",
                display: backDisplay ? "block" : "none",
              }}
            ></RiFolderReceivedFill>

            <div class="container px-5 py-4 mx-auto">
              <div class="flex flex-wrap -m-4">
                {showQueries ? (
                  <UserQuery allCourses={allCourses}></UserQuery>
                ) : profileDisplay ? (
                  <UserProfile>{console.log(profileDisplay)}</UserProfile>
                ) : courses.length != 0 ? (
                  courses[0].key == undefined ? (
                    courses[0].format == undefined ? (
                      (openDetail == false ? setOpenDetail(true) : "",
                      courses.map((course, i) => (
                        <div
                          class={` xl:w-1/5 md:w-1/3 p-4`}
                          onMouseEnter={handleHover}
                          onMouseLeave={handleHoverOut}
                        >
                          {/* {console.log(allCourses)} */}
                          <div
                            class="p-6 rounded-lg cursor-pointer"
                            onClick={() => openFCourse(i)}
                          >
                            <div class="w-15 h-15 inline-flex items-center justify-center text-indigo-500 mb-4">
                              {!enrolled && i != 0 ? (
                                <img
                                  src={lockedFolder}
                                  id={`Module${i}`}
                                  style={{ width: "5rem", height: "5rem" }}
                                />
                              ) : (
                                <img
                                  src={enrolledFolder}
                                  id={`Module${i}`}
                                  style={{ width: "5rem", height: "5rem" }}
                                />
                              )}
                            </div>
                            <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                              Module {i}
                            </h2>
                          </div>
                        </div>
                      )))
                    ) : (
                      courses.map((course) =>
                        course.format == "New Empty Module" ? (
                          <h1
                            className="m-auto text-2xl"
                            style={{ marginTop: "30vh" }}
                          >
                            Empty module
                          </h1>
                        ) : (
                          <div class="xl:w-1/5 md:w-1/3 p-4">
                            <div
                              class="p-6 rounded-lg cursor-pointer"
                              onClick={() => getDownloadURL(course.url)}
                            >
                              <div class="w-15 h-15 inline-flex items-center justify-center text-indigo-500 mb-4">
                                {course.format == "pdf" ? (
                                  <VscFilePdf
                                    style={{
                                      width: "5rem",
                                      height: "5rem",
                                      color: "darkred",
                                    }}
                                  />
                                ) : course.format == "docx" ? (
                                  <GrDocumentWord
                                    style={{ width: "5rem", height: "5rem" }}
                                  />
                                ) : course.format == "ppt" ? (
                                  <GrDocumentPpt
                                    style={{ width: "5rem", height: "5rem" }}
                                  />
                                ) : course.format == "video" ? (
                                  <MdOndemandVideo
                                    style={{ width: "5rem", height: "5rem" }}
                                  />
                                ) : (
                                  <img
                                    src={enrolledFolder}
                                    style={{ width: "5rem", height: "5rem" }}
                                  />
                                )}
                              </div>
                              <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                                {course.name}
                              </h2>
                            </div>
                          </div>
                        )
                      )
                    )
                  ) : (
                    (openDetail == true ? setOpenDetail(false) : "",
                    courses.map((course) => (
                      <div class="xl:w-1/5 md:w-1/3 p-4 cursor-pointer">
                        {/* {console.log(courses[0])} */}
                        <div
                          class="p-6 rounded-lg"
                          onClick={() => openCCourse(course.key)}
                          onMouseEnter={handleHover}
                          onMouseLeave={handleHoverOut}
                        >
                          <div class="w-15 h-15 inline-flex items-center justify-center text-indigo-500 mb-4">
                            <img
                              src={enrolledFolder}
                              style={{ width: "5rem", height: "5rem" }}
                              id={`${course.key}`}
                            />
                          </div>
                          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                            {course.key}
                          </h2>
                          <p class="leading-relaxed text-base">
                            {course.data["name"]}
                          </p>
                        </div>
                      </div>
                    )))
                  )
                ) : (
                  <PulseLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={18}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
              </div>
            </div>
          </section>
        </div>
        <div
          className={`${
            openDetail ? (open == false ? "w-72" : "w-60") : "w-0"
          } flex flex-col h-screen`}
          style={{ height: "158vh" }}
        >
          <div
            style={{ backgroundColor: "#C490E4", height: "158vh" }}
            className={` ${
              openDetail ? "translate-x-0" : "translate-x-full"
            } flex-col h-screen p-3 duration-300 absolute right-0`}
          >
            <div className="space-y-4" style={{ marginTop: "5rem" }}>
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "#ffffff", fontFamily: "Merriweather" }}
                >
                  Course Details
                </h2>
              </div>
              <div className="flex-1">
                <ul className="pt-2 pb-4 space-y-1 text-sm">
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setLocation("");
                      setCourses(fetchCourses);
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <FaChalkboardTeacher
                        className="w-6 h-6 stroke-current"
                        style={{ color: "#ffffff" }}
                      />
                      <span
                        className="tracking-wider font-bold"
                        style={{
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Instructor:
                      </span>
                      {openedCourseData != "" ? (
                        <span
                          className="tracking-wider"
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            fontFamily: "Merriweather",
                            color: "#ffffff",
                          }}
                        >
                          {openedCourseData[0].data["faculty"]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setLocation("");
                      enrolledCourses();
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <HiOutlineOfficeBuilding
                        className="w-6 h-6 stroke-current stroke-1"
                        style={{ color: "#ffffff" }}
                      />
                      <span
                        className="tracking-wider font-bold"
                        style={{
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Office:
                      </span>
                      {openedCourseData != "" ? (
                        <span
                          className="tracking-wider"
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            fontFamily: "Merriweather",
                            color: "#ffffff",
                          }}
                        >
                          {openedCourseData[0].data["office"]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setLocation("");
                      enrolledCourses();
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <BiTimeFive
                        className="w-6 h-6 stroke-current"
                        style={{ color: "#ffffff" }}
                      />
                      <span
                        className="tracking-wider font-bold"
                        style={{
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Office Timing:
                      </span>
                      {openedCourseData != "" ? (
                        <span
                          className="tracking-wider"
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            fontFamily: "Merriweather",
                            color: "#ffffff",
                          }}
                        >
                          {openedCourseData[0].data["officeTiming"]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setLocation("");
                      enrolledCourses();
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <BsInfoCircle
                        className="w-6 h-6"
                        style={{ color: "#ffffff" }}
                      />
                      <span
                        className="tracking-wider font-bold"
                        style={{
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Pre-req:
                      </span>
                      {openedCourseData != "" ? (
                        <span
                          className="tracking-wider"
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            fontFamily: "Merriweather",
                            color: "#ffffff",
                          }}
                        >
                          {openedCourseData[0].data["prereq"]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <MdOutlineSpeakerNotes
                        className="w-6 h-6 stroke-current"
                        style={{ color: "#ffffff" }}
                      />
                      <span
                        className="font-bold"
                        style={{
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Note:
                      </span>
                      {openedCourseData != "" ? (
                        <span
                          className="tracking-wider"
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            fontFamily: "Merriweather",
                            color: "#ffffff",
                          }}
                        >
                          {openedCourseData[0].data["note"]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <TbCreditCard
                        className="w-6 h-6 stroke-current"
                        style={{ color: "#ffffff" }}
                      />
                      <span
                        className="font-bold"
                        style={{
                          color: "#ffffff",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Units:
                      </span>
                      {openedCourseData != "" ? (
                        <span
                          className="tracking-wider"
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            fontFamily: "Merriweather",
                            color: "#ffffff",
                          }}
                        >
                          L-{openedCourseData[0].data.credit["L"]}&nbsp;P-
                          {openedCourseData[0].data.credit["P"]}&nbsp;T-
                          {openedCourseData[0].data.credit["T"]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { notifyUserDashboard };
