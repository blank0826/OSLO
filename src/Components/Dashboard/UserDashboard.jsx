import { useEffect } from "react";
import { useState } from "react";
import { React } from "react";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { FcFolder } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";
import { FaHashtag } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { VscFilePdf } from "react-icons/vsc";
import { GrDocumentWord, GrDocumentPpt } from "react-icons/gr";
import { MdOndemandVideo } from "react-icons/md";
import { TiArrowLeftThick } from "react-icons/ti";
import {
  LogoutStudent,
  fetchCourses,
  accessUser,
  getURL,
  uploadQuery,
  fetchTags,
} from "../../Firebase";

import logo from "../../images/logo.png";
import Select from "react-select";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function UserDashboard() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [tags, setTag] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollCourses, setEnrollCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [queryVisibility, setQueryVisibility] = useState(false);
  const [openQueryDialog, setQueryDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [backDisplay, setBackDisplay] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    componentDidUpdate();
    if (courses.length == 0) {
      let val = [];
      let arr = fetchCourses();
      val = val.concat(arr);
      setCourses(val);
      setAllCourses(val);
    } else {
      if (enrollCourses.length == 0) {
        let val = [];
        let arr = accessUser();
        val = val.concat(arr);
        console.log("eee");
        console.log(val);
        setEnrollCourses(val);
      }
    }

    if (allTags.length == 0) {
      let val = [];
      let arr = fetchTags();
      val = val.concat(arr);
      setAllTags(val);
    }
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
    setTag({ selectedOptions });
    console.log(tags);
  };

  const getDownloadURL = async (name) => {
    getURL(location, name);
  };

  // const ColourOption = [
  //   { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  //   { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
  //   { value: "purple", label: "Purple", color: "#5243AA" },
  //   { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  //   { value: "orange", label: "Orange", color: "#FF8B00" },
  //   { value: "yellow", label: "Yellow", color: "#FFC400" },
  //   { value: "green", label: "Green", color: "#36B37E" },
  //   { value: "forest", label: "Forest", color: "#00875A" },
  //   { value: "slate", label: "Slate", color: "#253858" },
  //   { value: "silver", label: "Silver", color: "#666666" },
  // ];

  let tagOptions = [];

  const handleStudentSignOut = () => {
    LogoutStudent(navigate);
  };

  const openCCourse = (courseKey) => {
    checkEnrolled(courseKey);
    setQueryVisibility(true);
    setBackDisplay(true);
    setLocation(location + "" + courseKey);
    // updateCourse(location + "/" + courseKey);
    console.log(courseKey);
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
      window.alert(
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
      window.alert(
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

  return (
    <>
      <header class="py-6 bg-gray-700 text-white text-center flex justify-between">
        <img
          src={logo}
          className="ml-6"
          style={{ width: "3rem", height: "4rem" }}
        />
        <Button
          style={{
            display: queryVisibility ? "block" : "none",
            color: "#937DC2",
          }}
          variant="outlined"
          onClick={handleClickOpen}
        >
          Raise Query
        </Button>
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
        <FiLogOut
          className="mr-3 cursor-pointer mt-4"
          style={{ width: "2rem", height: "2rem" }}
          onClick={handleStudentSignOut}
        />
      </header>
      <div className="flex">
        <div className={`${open ? "w-0" : "w-60"} flex flex-col h-screen`}>
          <div className="absolute mx-auto my-10">
            <button onClick={() => setOpen(!open)}>
              <BsFillArrowRightSquareFill
                style={{ width: "2rem", height: "2rem" }}
              />
            </button>
          </div>
          <div
            className={` ${
              open ? "-translate-x-full" : "translate-x-0"
            } flex-col h-screen p-3 duration-300 absolute`}
            style={{ background: "#937DC2" }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Dashboard</h2>
                <button onClick={() => setOpen(!open)}>
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
                    onClick={() => {
                      setQueryVisibility(false);
                      setBackDisplay(false);
                      setLocation("");
                      setCourses(fetchCourses);
                    }}
                  >
                    <a
                      href="#"
                      className="flex items-center p-2 space-x-3 rounded-md"
                    >
                      <IoBookSharp className="w-6 h-6 text-gray-100 fill-white stroke-current stroke-2" />
                      <span className="text-gray-100 tracking-wider">
                        All Courses
                      </span>
                    </a>
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
                    <a
                      href="#"
                      className="flex items-center p-2 space-x-3 rounded-md"
                    >
                      <BsPencilSquare className="w-6 h-6 text-gray-100 fill-white stroke-current stroke-1" />
                      <span className="text-gray-100 tracking-wider">
                        Enrolled In
                      </span>
                    </a>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md">
                      <FaHashtag className="w-6 h-6 text-gray-100 fill-white stroke-current stroke-" />
                      <Select
                        isMulti
                        name="colors"
                        options={allTags}
                        className="basic-multi-select "
                        classNamePrefix="select"
                        onChange={handleChange}
                      />
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <a
                      href="#"
                      className="flex items-center p-2 space-x-3 rounded-md"
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span className="text-gray-100">Orders</span>
                    </a>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <a
                      href="#"
                      className="flex items-center p-2 space-x-3 rounded-md"
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-100">Settings</span>
                    </a>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <a
                      href="#"
                      className="flex items-center p-2 space-x-3 rounded-md"
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
                      <span className="text-gray-100">Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <section class="text-gray-600 body-font">
            <TiArrowLeftThick
              onClick={goBack}
              style={{
                width: "2rem",
                height: "2rem",
                display: backDisplay ? "block" : "none",
              }}
            ></TiArrowLeftThick>
            <div class="container px-5 py-24 mx-auto">
              <div class="flex flex-wrap -m-4">
                {/* {console.log("2 " + allCourses.length)} */}
                {/* {console.log(allCourses)} */}
                {courses.length != 0 ? (
                  courses[0].key == undefined ? (
                    courses[0].format == undefined ? (
                      courses.map((course, i) => (
                        <div class="xl:w-1/5 md:w-1/3 p-4">
                          {/* {console.log(courses[0])} */}
                          <div
                            class="p-6 rounded-lg"
                            onClick={() => openFCourse(i)}
                          >
                            <div class="w-15 h-15 inline-flex items-center justify-center text-indigo-500 mb-4">
                              <FcFolder
                                style={{ width: "5rem", height: "5rem" }}
                              />
                            </div>
                            <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                              Module {i}
                            </h2>
                            {/* <p class="leading-relaxed text-base">
                          {course.data["name"]}
                        </p> */}
                          </div>
                        </div>
                      ))
                    ) : (
                      courses.map((course) => (
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
                                <FcFolder
                                  style={{ width: "5rem", height: "5rem" }}
                                />
                              )}
                            </div>
                            <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                              {course.name}
                            </h2>
                            {/* <p class="leading-relaxed text-base">
                            {course.data["name"]}
                          </p> */}
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    courses.map((course) => (
                      <div class="xl:w-1/5 md:w-1/3 p-4">
                        {/* {console.log(courses[0])} */}
                        <div
                          class="p-6 rounded-lg"
                          onClick={() => openCCourse(course.key)}
                        >
                          <div class="w-15 h-15 inline-flex items-center justify-center text-indigo-500 mb-4">
                            <FcFolder
                              style={{ width: "5rem", height: "5rem" }}
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
                    ))
                  )
                ) : (
                  <h1>Fetching................</h1>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
