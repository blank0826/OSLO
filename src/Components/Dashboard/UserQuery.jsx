import React, { useState, useEffect } from "react";
import Collapse from "@kunukn/react-collapse";
import "./styles.scss";

import Down from "./Down";
import { fetchEmailID } from "../../Firebase";

const initialState = [false, false, false];
function reducer(state, { type, index }) {
  switch (type) {
    case "expand-all":
      return [true, true, true];
    case "collapse-all":
      return [false, false, false];
    case "toggle":
      state[index] = !state[index];
      return [...state];

    default:
      throw new Error();
  }
}

function Block({ isOpen, title, onToggle, children }) {
  return (
    <div className="blockQuery">
      <button className="btnQuery toggleQuery" onClick={onToggle}>
        <span>{title}</span>
        <Down isOpen={isOpen} />
      </button>
      <Collapse layoutEffect isOpen={isOpen}>
        {children}
      </Collapse>
    </div>
  );
}

export default function UserQuery({ allCourses }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [email, setEmail] = useState("");
  const [showArr, setShowArr] = useState([]);

  useEffect(() => {
    if (email == "") {
      var emailID = fetchEmailID();
      if (emailID == undefined) {
        setEmail("");
      } else {
        setEmail(emailID);
      }
    } else {
      console.log(allCourses);
      let arr = [];
      for (var i = 0; i < allCourses.length; i++) {
        var course = allCourses[i].key;
        console.log(course);
        let contentArr = [];
        for (var j = 0; j < allCourses[i].data.query?.length; j++) {
          var query = allCourses[i].data.query[j];
          if (query.email == email) {
            contentArr.push(query.content);
          }
        }

        if (contentArr.length != 0) {
          let obj = {
            key: course,
            content: contentArr,
          };

          arr.push(obj);
        }
      }

      setShowArr(arr);
    }
  }, [email]);

  return (
    <>
      <div className="appQuery">
        <header className="headerQuery">
          <button
            className="btnCol"
            onClick={() => dispatch({ type: "expand-all" })}
            disabled={state.every((s) => s === true)}
          >
            Expand all
          </button>
          <button
            className="btnCol"
            onClick={() => dispatch({ type: "collapse-all" })}
            disabled={state.every((s) => s === false)}
          >
            Collapse all
          </button>
        </header>

        {showArr.length != 0 ? (
          showArr.map((course, i) => {
            return (
              <Block
                title={course.key}
                isOpen={state[i]}
                onToggle={() => dispatch({ type: "toggle", index: i })}
              >
                <div className="contentQuery">
                  {console.log(course.content)}
                  {course.content.map((content, j) => {
                    return (
                      <p>
                        {j + 1}. {content}
                      </p>
                    );
                  })}
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
