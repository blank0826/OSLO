import React, { useState, useEffect } from "react";
import Collapse from "@kunukn/react-collapse";
import "./styles.scss";

import Down from "./Down";
import {
  fetchEmailIDProf,
  updateReadFirebase,
  fetchCourses,
} from "../../Firebase";

const initialState = [false, false, false];

const markReadQueries = (courseKey, showArr) => {
  showArr.map((course) => {
    if (course.key == courseKey) {
      console.log(showArr);
      course.read = course.content.length;
      updateReadFirebase(courseKey, course.read);
    }
  });
};

function reducer(state, { type, index, courseKey, showArr }) {
  switch (type) {
    case "expand-all":
      return [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ];
    case "collapse-all":
      state.map((sValue, i) => {
        if (sValue) {
          if (showArr[i] != undefined) {
            markReadQueries(showArr[i].key, showArr);
          }
        }
      });

      return [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
    case "toggle":
      if (state[index]) {
        console.log(showArr);
        markReadQueries(courseKey, showArr);
      }
      state[index] = !state[index];
      return [...state];

    default:
      throw new Error();
  }
}

function Block({ isOpen, title, onToggle, children, courseCode, prevOpen }) {
  return (
    <div className="blockQuery" style={{ fontFamily: "Merriweather" }}>
      <button className="btnQuery toggleQuery" onClick={onToggle}>
        <span>{title}</span>
        {console.log(
          prevOpen + " " + title + " " + courseCode + " " + onToggle
        )}
        {/* {if()} */}
        <Down isOpen={isOpen} />
      </button>
      <Collapse layoutEffect isOpen={isOpen}>
        {children}
      </Collapse>
    </div>
  );
}

export default function ProfQuery() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [email, setEmail] = useState("");
  const [showArr, setShowArr] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    if (allCourses.length == 0) {
      let val = [];
      let arr = fetchCourses();
      val = val.concat(arr);
      setAllCourses(val);
    } else {
      if (email == "") {
        var emailID = fetchEmailIDProf();
        if (emailID == undefined) {
          setEmail("");
        } else {
          setEmail(emailID);
        }
      } else {
        console.log(email);
        console.log(allCourses);
        let arr = [];
        for (var i = 0; i < allCourses.length; i++) {
          var course = allCourses[i].key;
          var title = allCourses[i].data.name;

          console.log(course);
          let contentArr = [];
          console.log(allCourses[i].data.emailFaculty);
          if (allCourses[i].data.emailFaculty == email) {
            for (var j = 0; j < allCourses[i].data.query?.length; j++) {
              var query = allCourses[i].data.query[j];
              var timeStamp = query.date;
              console.log(query);
              var d = new Date(timeStamp);
              var date =
                d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
              var time =
                (("" + d.getHours()).length == 1
                  ? "0" + d.getHours()
                  : d.getHours()) +
                ":" +
                (("" + d.getMinutes()).length == 1
                  ? "0" + d.getMinutes()
                  : d.getMinutes());

              let obj = {
                content: query.content,
                date: date,
                time: time,
                email: query.email,
              };

              contentArr.push(obj);
            }

            if (contentArr.length != 0) {
              let obj = {
                key: course,
                title: title,
                content: contentArr.reverse(),
                read: allCourses[i].data.queryRead,
              };

              arr.push(obj);
            }
          }
        }

        setShowArr(arr);
      }
    }
  }, [allCourses, email]);

  return (
    <>
      <div className="appQuery">
        <header className="headerQuery">
          <button
            className="btnCol"
            onClick={() => dispatch({ type: "expand-all" })}
            disabled={state.every((s) => s === true)}
          >
            Expand All
          </button>
          <button
            className="btnCol"
            onClick={() => dispatch({ type: "collapse-all", showArr: showArr })}
            disabled={state.every((s) => s === false)}
          >
            Collapse All
          </button>
        </header>

        {showArr.length != 0 ? (
          showArr.map((course, i) => {
            return (
              <Block
                title={course.key + " - " + course.title}
                isOpen={state[i]}
                prevOpen={"" + state[i]}
                courseCode={course.key}
                onToggle={() => {
                  dispatch({
                    type: "toggle",
                    index: i,
                    courseKey: course.key,
                    showArr: showArr,
                  });
                }}
              >
                <div className="contentQuery" style={{ fontWeight: "lighter" }}>
                  <table>
                    {console.log(course.read)}
                    {course.content.map((content, j) => {
                      return (
                        <>
                          <tr
                            style={{
                              color:
                                course.content.length - course.read > j
                                  ? "darkblue"
                                  : "",
                            }}
                          >
                            <td>{j + 1}. </td>
                            <td>Query: &nbsp;&nbsp;{" " + content.content}</td>
                          </tr>
                          <tr
                            style={{
                              color:
                                course.content.length - course.read > j
                                  ? "darkblue"
                                  : "",
                            }}
                          >
                            <td></td>
                            <td>
                              Date: &nbsp;&nbsp;
                              {" " + content.date + " " + content.time}
                            </td>
                          </tr>
                          <tr
                            style={{
                              height:
                                j == course.content.length - 1
                                  ? "0rem"
                                  : "5rem",
                              verticalAlign: "text-top",
                              color:
                                course.content.length - course.read > j
                                  ? "darkblue"
                                  : "",
                            }}
                          >
                            <td></td>
                            <td>Email: &nbsp;&nbsp;{" " + content.email}</td>
                          </tr>
                        </>
                        //    <div class="flex mb-4">
                        //   <span>{j + 1}. </span>
                        //   <span>Query: &nbsp;&nbsp;{" " + content.content}</span>
                        //   <span>Date: &nbsp;&nbsp;{" " + content.content}</span>
                        //   <span>Email: &nbsp;&nbsp;{" " + content.content}</span>
                        // </div>
                      );
                    })}
                  </table>
                </div>
              </Block>
            );
          })
        ) : (
          <h1>Fetching.............</h1>
        )}
      </div>
    </>
  );
}
