import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandleSignupUser, getStudentData } from "../../Firebase";
import logo from "../../images/logo.png";
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import CardProfile from "./CardProfile";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [rollnumber, setRollNumber] = useState("");
  const [studentData, setStudentData] = useState([]);
  const navigate = useNavigate();

  const options = { multi: false };

  const uploader = Uploader({
    apiKey: "free",
  });

  useEffect(() => {
    if (studentData.length == 0) {
      console.log(studentData);
      setStudentData(getStudentData());
    } else {
      console.log(studentData[0]);
    }
  }, [studentData]);

  const convertToDate = (timeStamp) => {
    var time = parseInt(timeStamp);
    console.log(time);
    var d = new Date(time);
    console.log(("" + d.getMinutes()).length);
    return (
      d.getDate() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " " +
      (("" + d.getHours()).length == 1 ? "0" + d.getHours() : d.getHours()) +
      ":" +
      (("" + d.getMinutes()).length == 1
        ? "0" + d.getMinutes()
        : d.getMinutes()) +
      ":" +
      (("" + d.getSeconds()).length == 1
        ? "0" + d.getSeconds()
        : d.getSeconds())
    );
  };

  return (
    <>
      <section class="text-gray-600 body-font" style={{ width: "100%" }}>
        {/* <div class="container px-5 py-24 mx-auto"> */}
        <div class="mx-auto flex flex-wrap">
          {/* <UploadDropzone
            uploader={uploader} // Required.
            options={options} // Optional.
            width="300px" // Optional.
            height="300px" // Optional.
            onUpdate={(files) => {
              // Optional.
              if (files.length === 0) {
                console.log("No files selected.");
              } else {
                console.log("Files uploaded:");
                console.log(files.map((f) => console.log(f.fileUrl)));
              }
            }}
          /> */}
          <CardProfile></CardProfile>
          {studentData.length != 0 ? (
            <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 class="text-sm title-font text-gray-500 tracking-widest">
                {studentData[0].branch}
              </h2>
              <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
                {studentData[0].name}
              </h1>
              <div class="flex mb-4"></div>
              {/* <p class="leading-relaxed">
                Fam locavore kickstarter distillery. Mixtape chillwave tumeric
                sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo
                juiceramps cornhole raw denim forage brooklyn. Everyday carry +1
                seitan poutine tumeric. Gastropub blue bottle austin listicle
                pour-over, neutra jean shorts keytar banjo tattooed umami
                cardigan.
  </p> */}
              <div class="flex items-center border-b-2 border-gray-100 mb-5">
                {/*} <div class="flex">
                  <span class="mr-3">Color</span>
                  <button class="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                  <button class="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                  <button class="border-2 border-gray-300 ml-1 bg-indigo-500 rounded-full w-6 h-6 focus:outline-none"></button>
                </div>
                <div class="flex ml-6 items-center">
                  <span class="mr-3">Size</span>
                  <div class="relative">
                    <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                      <option>SM</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                    </select>
                    <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div> */}
              </div>
              <div class="flex">
                <span class="title-font font-medium text-2xl text-gray-900 w-25">
                  Roll Number:
                </span>
                <span class="title-font font-medium text-2xl text-gray-500">
                  &nbsp;&nbsp;&nbsp;{studentData[0].roll_number}
                </span>
              </div>
              <div class="flex">
                <span class="title-font font-medium text-2xl text-gray-900">
                  Email:
                </span>
                <span class="title-font font-medium text-2xl text-gray-500">
                  &nbsp;&nbsp;&nbsp;{" " + studentData[0].email}
                </span>
              </div>
              <div class="flex">
                <span class="title-font font-medium text-2xl text-gray-900">
                  Enrolled Courses:
                </span>
                <span class="title-font font-medium text-2xl text-gray-500">
                  {" " + studentData[0].courses}
                </span>
              </div>
              <div class="flex">
                <span class="title-font font-medium text-2xl text-gray-900">
                  LastLogin:
                </span>
                <span class="title-font font-medium text-2xl text-gray-500">
                  {" " + convertToDate(studentData[0].lastLogin)}
                </span>
              </div>
            </div>
          ) : (
            <h1>Fetching</h1>
          )}
        </div>
        {/* </div> */}
      </section>
    </>
  );
}
