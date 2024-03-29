import { useEffect, useRef } from "react";
import { useState, CSSProperties } from "react";
import { React } from "react";
import {
  BsFillArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
  BsFillPersonPlusFill,
  BsQuestionCircle,
} from "react-icons/bs";
import { FcFolder } from "react-icons/fc";
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
import { CMultiSelect } from "@coreui/react-pro";
import lockedFolder from "../../images/lock.png";
import enrolledFolder from "../../images/open-folder.png";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineFileUnknown } from "react-icons/ai";
import ProfProfile from "../Profile/ProfProfile";
import ProfQuery from "./ProfQuery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  LogoutProf,
  fetchCourses,
  accessProf,
  getURL,
  uploadQuery,
  fetchTags,
  fetchDept,
  accessUserName,
  addVStudent,
  addModuleFunc,
  removeModuleFunc,
  removeDoc,
  handleUploadFile,
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
import UserProfile from "../Profile/UserProfile";
import UserQuery from "./UserQuery";

require("typeface-abril-fatface");

function notifyProfDashboard(msg) {
  toast(msg);
}

export default function ProfDashboard() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openedCourseData, setOpenedCourseData] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [rollNumber, setRollNumber] = useState("");
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [taughtCoursesSelect, setTaughtCoursesSelect] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [queryVisibility, setQueryVisibility] = useState(false);
  const [openVirtualDialog, setVirtualDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [backDisplay, setBackDisplay] = useState(false);
  const [profileDisplay, setProfileDisplay] = useState(false);
  const [showQueries, setShowQueries] = useState(false);
  const [selectedVirtualCourse, setSelectedVirtualCourse] = useState(false);
  const [addModule, setaddModule] = useState(false);
  const [addContent, setaddContent] = useState(false);
  const [openAddContent, setOpenAddContent] = useState(false);

  const [openAddModule, setOpenAddModule] = useState(false);
  const [openRemoveOrDownloadDoc, setOpenRemoveOrDownloadDoc] = useState(false);

  const [openRemoveOrAddModule, setopenRemoveOrAddModule] = useState(false);

  const [moduleIndex, setModuleIndex] = useState("");
  const [docKey, setDocKey] = useState("");
  const [eventOpened, setEventOpened] = useState(false);
  const [fileInput, setFile] = useState("");

  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#C490E4");
  const { register, handleSubmit, errors, control } = useForm();

  let [loading1, setLoading1] = useState(true);
  let [color1, setColor1] = useState("#C490E4");

  const override = {
    display: "block",
    margin: "15rem 5rem 5rem 35rem",
    borderColor: "#C490E4",
  };

  const navigate = useNavigate();

  const refContainer = useRef(null);

  const notify = () => toast("Module Added Successfully!");
  const notifyRemove = () => toast("Module Removed Successfully!");
  const notifyRemoveDoc = () => toast("Content Removed Successfully!");
  const notifyAddingDoc = () => toast("Uploading, please wait!");
  const notifyAddedDoc = () => toast("Document added successfully!");

  useEffect(() => {
    componentDidUpdate();
    // notifyProfDashboard("hey");
    document.body.classList.add("overflow-x-hidden");

    if (courses.length == 0) {
      let val = [];
      let arr = fetchCourses();
      let tempArr = [];
      if (arr.length != 0) {
        tempArr = arr.filter((course) => {
          return course.key == "Events";
        });
        arr = arr.filter((course) => {
          return course.key != "Events";
        });
      }
      val = val.concat(tempArr);
      val = val.concat(arr);
      setCourses(val);
      setAllCourses(val);
    } else {
      if (taughtCourses.length == 0) {
        let val = [];
        let arr = accessProf();
        val = val.concat(arr);
        setTaughtCourses(val);
        let taughtCSelect = [];
        val.map((courses) => {
          taughtCSelect.push({
            value: courses.key,
            label: courses.key + " - " + courses.data.name,
            isFixed: true,
          });
        });
        // console.log(location);
        setTaughtCoursesSelect(taughtCSelect);
      } else {
        if (location != "") {
          if (location.indexOf("/") == -1) {
            console.log(location);
            openCCourse(location);
          } else openFCourse(location);
        }
      }
    }

    if (allTags.length == 0) {
      let val = [];
      let arr = fetchDept();
      val = val.concat(arr);
      let val2 = [];
      let arr2 = fetchTags();
      val2 = val2.concat(arr2);

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
    console.log(allCourses);
  }, [courses, taughtCourses]);

  function componentDidUpdate() {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }

  const handleClickOpen = () => {
    setVirtualDialog(true);
  };

  const handleClose = () => {
    setVirtualDialog(false);
    setQuery("");
  };

  const handleVirtualCourse = (selectedCourse) => {
    setSelectedVirtualCourse(selectedCourse);
  };

  const handleChange = (selectedOptions) => {
    var arr = [];
    arr = arr.concat(selectedOptions);
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
    // setaddModule(false);
    setCourses(taggedCourseAll);
  };

  const getDownloadURL = async (name) => {
    getURL(location, name);
  };

  const handleProfSignOut = () => {
    LogoutProf(navigate);
  };

  const openCCourse = (courseKey) => {
    taughtCourses.map((course) => {
      if (course.key == courseKey || courseKey == "Events") {
        setaddModule(true);
      }
    });

    if (courseKey == "Events") {
      setEventOpened(true);
    } else {
      setEventOpened(false);
    }

    setQueryVisibility(true);
    setBackDisplay(true);
    console.log(location);
    if (location == "" || location == null)
      setLocation(location + "" + courseKey);
    var data = allCourses.filter((course) => course.key == courseKey);
    console.log(courseKey);
    console.log(data);
    if (courses[0].key != undefined) {
      setOpenedCourseData(data);
      let val = courses;
      console.log(val);
      let arr = val.filter((c) => c.key == courseKey);
      console.log(arr);
      arr = arr[0].data.content;
      setCourses(arr);
    }
  };

  const handleCloseRemoveOrAddModule = () => {
    setopenRemoveOrAddModule(false);
  };

  const removeOrOpenModule = (index) => {
    setModuleIndex(index);
    setopenRemoveOrAddModule(true);
  };

  const handleRemoveModule = () => {
    setopenRemoveOrAddModule(false);
    removeModuleFunc(moduleIndex, location);

    notifyRemove();

    let val = [];
    let arr = accessProf();
    val = val.concat(arr);
    setTaughtCourses(val);
    let taughtCSelect = [];
    val.map((courses) => {
      taughtCSelect.push({
        value: courses.key,
        label: courses.key + " - " + courses.data.name,
        isFixed: true,
      });
    });
    setTaughtCoursesSelect(taughtCSelect);

    let val1 = [];
    let arr1 = fetchCourses();
    let tempArr = [];
    if (arr1.length != 0) {
      tempArr = arr1.filter((course) => {
        return course.key == "Events";
      });
      arr1 = arr1.filter((course) => {
        return course.key != "Events";
      });
    }
    val1 = val1.concat(tempArr);
    val1 = val1.concat(arr1);
    setCourses(val1);
    setAllCourses(val1);
  };

  const handleOpenModule = () => {
    setopenRemoveOrAddModule(false);
    openFCourse(moduleIndex);
  };

  const openFCourse = (index) => {
    console.log("Location is " + location);
    console.log("Index is " + index);
    if (location.indexOf("/") == -1) {
      setLocation(location + "/" + index);
    }

    setaddModule(false);

    taughtCourses.map((course) => {
      if (course.key == location || location == "Events") {
        setaddContent(true);
        // console.log(location);
      }
    });
    console.log(courses);
    if (courses[0].format == undefined) {
      let val = courses;
      let arr = val[index];
      setCourses(arr);
    }
  };

  function getTaughtCourses() {
    setCourses(taughtCourses);
  }

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
      notifyProfDashboard(
        "The mentioned course doesn't exist. Kindly check the course code and try again!"
      );
    } else {
      setCourses(arr);
    }
    setCourseSearch("");
  };

  const goBack = () => {
    setaddContent(false);
    // setremoveModule(false);
    let locationCourse = location;
    var index = location.indexOf("/");
    if (locationCourse.split("/").length == 2) {
      var courseKey = locationCourse.substring(0, index);
      taughtCourses.map((course) => {
        if (course.key == courseKey) {
          setaddModule(true);
        }
      });
    } else {
      setaddModule(false);
    }

    if (index == -1) {
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

  function addVirtualStudent() {
    console.log(selectedVirtualCourse.value);
    console.log(rollNumber);
    if (selectedVirtualCourse == "") {
      notifyProfDashboard(
        "Kindly add course for the student to be enrolled in!"
      );
      return;
    }
    if (rollNumber == "") {
      notifyProfDashboard("Kindly add roll number of the student");
      return;
    }

    addVStudent(rollNumber, selectedVirtualCourse.value);

    setRollNumber("");
    setSelectedVirtualCourse("");
    setVirtualDialog(false);
  }

  const handleClickOpenAddModule = () => {
    setOpenAddModule(true);
  };

  const handleCloseAddModule = () => {
    setOpenAddModule(false);
  };

  const handleYesAddModule = () => {
    taughtCourses.map((course) => {
      if (course.key == location || location == "Events") {
        let arr = course.data.content;
        let max = 0;
        arr.map((module, i) => {
          max = i > max ? i : max;
        });
        var msg = addModuleFunc(location, max + 1);
        notify();
      }
    });
    setOpenAddModule(false);

    let val = [];
    let arr = accessProf();
    val = val.concat(arr);
    setTaughtCourses(val);
    let taughtCSelect = [];
    val.map((courses) => {
      taughtCSelect.push({
        value: courses.key,
        label: courses.key + " - " + courses.data.name,
        isFixed: true,
      });
    });
    setTaughtCoursesSelect(taughtCSelect);

    let val1 = [];
    let arr1 = fetchCourses();
    let tempArr = [];
    if (arr1.length != 0) {
      tempArr = arr1.filter((course) => {
        return course.key == "Events";
      });
      arr1 = arr1.filter((course) => {
        return course.key != "Events";
      });
    }
    val1 = val1.concat(tempArr);
    val1 = val1.concat(arr1);
    setCourses(val1);
    setAllCourses(val1);
  };

  const handleOpenRemoveOrDownloadDoc = (item) => {
    setOpenRemoveOrDownloadDoc(true);
    setDocKey(item);
  };

  const handleCloseRemoveOrDownloadDoc = () => {
    setOpenRemoveOrDownloadDoc(false);
  };

  const handleDownloadDoc = () => {
    setOpenRemoveOrDownloadDoc(false);

    var getCourse = allCourses.filter(
      (course) => course.key == location.substring(0, location.indexOf("/"))
    );

    console.log(getCourse[0]);
    var name =
      getCourse[0].data.content[location.substring(location.indexOf("/") + 1)][
        docKey
      ]["url"];
    getURL(location, name);
  };

  const handleRemoveDoc = () => {
    setOpenRemoveOrDownloadDoc(false);
    removeDoc(location, docKey);

    let val = [];
    let arr = accessProf();
    val = val.concat(arr);
    setTaughtCourses(val);
    let taughtCSelect = [];
    val.map((courses) => {
      taughtCSelect.push({
        value: courses.key,
        label: courses.key + " - " + courses.data.name,
        isFixed: true,
      });
    });
    setTaughtCoursesSelect(taughtCSelect);

    let val1 = [];
    let arr1 = fetchCourses();
    let tempArr = [];
    if (arr1.length != 0) {
      tempArr = arr1.filter((course) => {
        return course.key == "Events";
      });
      arr1 = arr1.filter((course) => {
        return course.key != "Events";
      });
    }
    val1 = val1.concat(tempArr);
    val1 = val1.concat(arr1);
    var indexKey = "";
    val1.map((course, i) => {
      if (course.key == location.substring(0, location.indexOf("/"))) {
        indexKey = i;
      }
    });
    setCourses(val1[indexKey].data.content[moduleIndex]);
    setAllCourses(val1);

    notifyRemoveDoc();
  };

  const handleClickOpenAddContent = () => {
    setOpenAddContent(true);
  };

  const handleClick = (event) => {
    refContainer.current.click();
  };

  const handleChangeUpload = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);

    handleUploadFile(event.target.files[0], location);
    notifyAddingDoc();
    setTimeout(function () {
      let val = [];
      let arr = accessProf();
      val = val.concat(arr);
      setTaughtCourses(val);
      let taughtCSelect = [];
      val.map((courses) => {
        taughtCSelect.push({
          value: courses.key,
          label: courses.key + " - " + courses.data.name,
          isFixed: true,
        });
      });
      setTaughtCoursesSelect(taughtCSelect);

      let val1 = [];
      let arr1 = fetchCourses();
      let tempArr = [];
      if (arr1.length != 0) {
        tempArr = arr1.filter((course) => {
          return course.key == "Events";
        });
        arr1 = arr1.filter((course) => {
          return course.key != "Events";
        });
      }
      val1 = val1.concat(tempArr);
      val1 = val1.concat(arr1);
      var indexKey = "";
      val1.map((course, i) => {
        if (course.key == location.substring(0, location.indexOf("/"))) {
          indexKey = i;
        }
      });
      setCourses(val1[indexKey].data.content[moduleIndex]);
      setAllCourses(val1);
      notifyAddedDoc();
    }, 5000);
  };

  return (
    <>
      <header
        class="py-6 bg-gray-700 text-white text-center flex justify-around"
        style={{
          height: "12vh",
          backgroundColor: "#FCE2DB",
          alignItems: "center",
        }}
      >
        <a
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
          href="/About"
          target="_blank"
        >
          About OSLO
        </a>
        <a
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
          href="/Contact"
          target="_blank"
        >
          Contact OSLO
        </a>
        <a
          className="text-2xl tracking-wider"
          style={{
            color: "#9656A1",
            fontWeight: "500",
            fontFamily: "Playfair Display",
          }}
          href="/Creators"
          target="_blank"
        >
          Creators
        </a>

        <Dialog
          className="virtualStudentDialog"
          open={openVirtualDialog}
          onClose={handleClose}
        >
          <DialogTitle>Add a virtual student</DialogTitle>
          <DialogContent>
            <DialogContentText mb={2}>
              The added student will not be graded but they will be able to see
              the complete contents of the course.
            </DialogContentText>
            <Select
              required
              name="tags"
              options={taughtCoursesSelect}
              className="basic-multi-select bg-purple-300 text-gray-800"
              classNamePrefix="mySelect"
              onChange={handleVirtualCourse}
              placeholder="Course"
            />
            <TextField
              sx={{
                width: "98%",
                marginLeft: "0.5rem",
              }}
              autoFocus
              margin="dense"
              id="name"
              label="Roll Number"
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => setRollNumber(e.target.value)}
              value={rollNumber}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={addVirtualStudent}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAddModule}
          onClose={handleCloseAddModule}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you really want to add a module?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseAddModule}>No</Button>
            <Button onClick={handleYesAddModule} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openRemoveOrAddModule}
          onClose={handleCloseRemoveOrAddModule}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"What you want to do next?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              mb={2}
              sx={{ color: "red", marginBottom: "0px" }}
            >
              {moduleIndex == 0
                ? eventOpened
                  ? "Please note that removing a module will remove all the content in it."
                  : "Introductory module cannot be deleted"
                : "Please note that removing a module will remove all the content in it."}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-around" }}>
            <Button onClick={handleOpenModule}>Open Module</Button>
            {moduleIndex == 0 ? (
              eventOpened ? (
                <Button onClick={handleRemoveModule}>Remove Module</Button>
              ) : (
                ""
              )
            ) : (
              <Button onClick={handleRemoveModule}>Remove Module</Button>
            )}
            <Button onClick={handleCloseRemoveOrAddModule}>Go Back</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openRemoveOrDownloadDoc}
          onClose={handleCloseRemoveOrDownloadDoc}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"What you want to do next?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              mb={2}
              sx={{ color: "red", marginBottom: "0px" }}
            >
              {/* {moduleIndex == 0
                ? console.log(
                    allCourses.filter((course) => {
                      return course.key == location;
                    })
                  )
                : ""} */}
              {moduleIndex == 0 && location.indexOf("/") != -1
                ? allCourses.filter((course) => {
                    return (
                      course.key == location.substring(0, location.indexOf("/"))
                    );
                  })[0].data["content"][0].length > 1
                  ? "Deleting a content will remove it permanently."
                  : "Introductory module cannot be deleted completely"
                : "Deleting a content will remove it permanently."}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-around" }}>
            <Button onClick={handleDownloadDoc}>Open Content</Button>
            {moduleIndex == 0 && location.indexOf("/") != -1 ? (
              allCourses.filter((course) => {
                return (
                  course.key == location.substring(0, location.indexOf("/"))
                );
              })[0].data["content"][0].length > 1 ? (
                <Button onClick={handleRemoveDoc}>Remove Content</Button>
              ) : (
                ""
              )
            ) : (
              <Button onClick={handleRemoveDoc}>Remove Content</Button>
            )}
            <Button onClick={handleCloseRemoveOrDownloadDoc}>Go Back</Button>
          </DialogActions>
        </Dialog>
      </header>
      <div className="flex flex-row">
        <div
          className={`${open ? "w-0" : "w-64"} flex flex-col`}
          style={{ height: "158vh" }}
        >
          <ToastContainer />
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
                      setShowQueries(false);
                      setLocation("");
                      setCourses(allCourses);
                      setaddModule(false);
                      setaddContent(false);
                      // setremoveModule(false);
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
                        Resources
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
                      getTaughtCourses();
                      setaddModule(false);
                      setaddContent(false);
                      // setremoveModule(false);
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
                        Courses Taught
                      </span>
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                    onClick={() => {
                      // setQueryVisibility(false);
                      // setBackDisplay(false);
                      // setLocation("");
                      // // setOpenedCourseData("");
                      // setShowQueries(false);
                      // setProfileDisplay(false);
                      setaddModule(false);
                      setaddContent(false);
                      // setremoveModule(false);
                    }}
                  >
                    <div className="flex items-center p-2 space-x-3 rounded-md cursor-pointer">
                      <BsFillPersonPlusFill className="w-6 h-6 text-gray-100 fill-white stroke-current" />
                      <span
                        className="text-gray-100 tracking-wider"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                        onClick={handleClickOpen}
                      >
                        Add Virtual Student
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
                        setaddModule(false);
                        setaddContent(false);
                        // setremoveModule(false);
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
                    queries
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
                        setaddModule(false);
                        setaddContent(false);
                        // setremoveModule(false);
                      }}
                    >
                      <BsQuestionCircle className="w-6 h-6 text-gray-100 fill-white stroke-current" />
                      <span
                        className="text-gray-100"
                        style={{
                          fontSize: "17px",
                          color: "#ffffff",
                          fontWeight: "700",
                          fontFamily: "Merriweather",
                        }}
                      >
                        Queries
                      </span>
                    </div>
                  </li>
                  <li
                    className="rounded-sm"
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <div
                      className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                      onClick={handleProfSignOut}
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
          <section
            class="text-gray-600 body-font"
            style={{ marginLeft: "2rem" }}
          >
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
              {addModule ? (
                <button
                  className="saveProfileButton"
                  style={{
                    // height: "4rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    marginRight: eventOpened ? "2rem" : "11rem",
                    display: addModule ? "block" : "none",
                    background: "#C490E4",
                    fontSize: "18px",
                    border: "2px solid #F7E8F6",
                    color: "#F7E8F6",
                    fontFamily: "Playfair Display",
                  }}
                  onClick={handleClickOpenAddModule}
                >
                  Add Module
                </button>
              ) : (
                <div className="flex justify-around">
                  <button
                    className="saveProfileButton"
                    style={{
                      // height: "4rem",
                      marginTop: "1rem",
                      // padding: "0.4rem",
                      marginBottom: "1rem",
                      marginRight: eventOpened ? "2rem" : "11rem",
                      display: addContent ? "block" : "none",
                      background: "#C490E4",
                      fontSize: "18px",
                      border: "2px solid #F7E8F6",
                      color: "#F7E8F6",
                      fontFamily: "Playfair Display",
                    }}
                    onClick={handleClick}
                  >
                    Add Content
                  </button>
                  <input
                    ref={refContainer}
                    onChange={handleChangeUpload}
                    type="file"
                    style={{ display: "none" }}
                    // multiple={false}
                  />
                </div>
              )}
            </div>
            <RiFolderReceivedFill
              className="cursor-pointer"
              onClick={goBack}
              style={{
                color: "black",
                float: "right",
                marginTop: "0.5rem",
                marginRight: eventOpened ? "2rem" : "11rem",
                width: "2rem",
                height: "2rem",
                display: backDisplay ? "block" : "none",
              }}
            ></RiFolderReceivedFill>

            <div class="container px-5 py-4 mx-auto">
              <div class="flex flex-wrap -m-4">
                {showQueries ? (
                  <ProfQuery allCourses={allCourses}></ProfQuery>
                ) : profileDisplay ? (
                  <ProfProfile taughtCourses={taughtCourses}>
                    {console.log(profileDisplay)}
                  </ProfProfile>
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
                          <div
                            class="p-6 rounded-lg cursor-pointer"
                            onClick={() => {
                              taughtCourses.filter((course) => {
                                return (
                                  course.key == location || location == "Events"
                                );
                              }).length > 0
                                ? removeOrOpenModule(i)
                                : openFCourse(i);
                            }}
                          >
                            <div class="w-15 h-15 inline-flex items-center justify-center text-indigo-500 mb-4">
                              <img
                                src={enrolledFolder}
                                id={`Module${i}`}
                                style={{ width: "5rem", height: "5rem" }}
                              />
                            </div>
                            {eventOpened ? (
                              <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                                {i == 0 ? "Seminar" : "Conferences"}
                              </h2>
                            ) : (
                              <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                                Module {i}
                              </h2>
                            )}
                          </div>
                        </div>
                      )))
                    ) : (
                      (openDetail == false ? setOpenDetail(true) : "",
                      courses.map((course, i) =>
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
                              onClick={() => {
                                taughtCourses.filter((course) => {
                                  return (
                                    course.key ==
                                      location.substring(
                                        0,
                                        location.indexOf("/")
                                      ) ||
                                    location.substring(
                                      0,
                                      location.indexOf("/")
                                    ) == "Events"
                                  );
                                }).length > 0
                                  ? handleOpenRemoveOrDownloadDoc(i)
                                  : getDownloadURL(course.url);
                              }}
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
                                ) : course.format == "ppt" ||
                                  course.format == "pptx" ? (
                                  <GrDocumentPpt
                                    style={{ width: "5rem", height: "5rem" }}
                                  />
                                ) : course.format == "mp4" ||
                                  course.format == "mov" ||
                                  course.format == "wmv" ||
                                  course.format == "mkv" ||
                                  course.format == "video" ? (
                                  <MdOndemandVideo
                                    style={{ width: "5rem", height: "5rem" }}
                                  />
                                ) : (
                                  <AiOutlineFileUnknown
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
                      ))
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
                          <p
                            class="leading-relaxed text-base"
                            style={{
                              fontStyle: course.key == "Events" ? "italic" : "",
                            }}
                          >
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
            openDetail && !eventOpened
              ? open == false
                ? "w-72"
                : "w-60"
              : "w-0"
          } flex flex-col h-screen`}
          style={{ height: "158vh" }}
        >
          <div
            style={{ backgroundColor: "#C490E4", height: "158vh" }}
            className={` ${
              openDetail && !eventOpened ? "translate-x-0" : "translate-x-full"
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

export { notifyProfDashboard };
