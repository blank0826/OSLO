import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  getStorage,
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { notifyLoginProf } from "./Components/Login/LoginProf";
import { notifySigninUser } from "./Components/Signin/SigninUser";
import { notifyLoginUser } from "./Components/Login/LoginUser";
import { notifyProfDashboard } from "./Components/Dashboard/ProfDashboard";
import { notifySigninProf } from "./Components/Signin/SigninProf";
import { notifyForgotPassword } from "./Components/ForgotPassword/ForgotPassword";
import { notifyUserDashboard } from "./Components/Dashboard/UserDashboard";

const firebaseConfig = {
  apiKey: "AIzaSyCAkBzXoqjnyZZXs4iZVilta0dyTS2Hoxw",
  authDomain: "e-lib-ab261.firebaseapp.com",
  projectId: "e-lib-ab261",
  storageBucket: "e-lib-ab261.appspot.com",
  messagingSenderId: "896474287319",
  appId: "1:896474287319:web:0f9d093ad440900320f492",
  measurementId: "G-7HW0L0S1HJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
const storage = getStorage();

let countUserActivity = 0;
let countProfActivity = 0;

function validateField(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}

function validateEmail(email) {
  let expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) === true) {
    return true;
  } else {
    return false;
  }
}

function validatePassword(password) {
  //min 6 letter password, with at least a symbol, upper and lower case letters and a number
  let expression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  if (expression.test(password) === false) {
    return false;
  } else {
    return true;
  }
}

const HandleLoginFirebaseUser = (navigate, email, password, isChecked) => {
  if (!validateField(email) || !validateField(password)) {
    notifyLoginUser("Please fill all the fields.");
  } else {
    const studentRef = ref(db, "students/");
    onValue(studentRef, (snapshot) => {
      let data = snapshot.val();
      console.log(data);
      if (data == null) {
        notifyLoginUser("You have not registered!");
        return;
      }

      var val = null;

      for (var key in data) {
        var obj = data[key];
        if (obj.email == email) {
          val = obj;
          break;
        }
      }

      if (val == null) {
        notifyLoginUser("You have not registered!");
        return;
      } else {
        // if (val.email == email && val.password == password) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const fromLogOut = localStorage.getItem("ComingFromLogoutUser");
            if (fromLogOut == undefined || fromLogOut == null) {
              console.log(email);
              console.log(password);
              console.log(auth.currentUser.accessToken);
              if (!auth.currentUser.emailVerified) {
                notifyLoginUser("Verify your email!");
              } else {
                if (isChecked) {
                  console.log("checked");
                  localStorage.setItem("emailUser", email);
                  localStorage.setItem("passwordUser", password);
                } else {
                  localStorage.removeItem("emailUser");
                  localStorage.removeItem("passwordUser");
                }

                set(ref(db, "token/" + auth.currentUser.uid), {
                  token: auth.currentUser.accessToken,
                }).catch((error) => {
                  notifyLoginUser(error.message);
                });

                // localStorage.setItem("Bearer", auth.currentUser.accessToken);
                // localStorage.setItem("OrphanageId", id);
                countUserActivity = 1;
                console.log(fromLogOut);
                notifyLoginUser("Signed in!");
                setTimeout(() => navigate("/DashboardUser"), 1000);
              }
            }
          })
          .catch((error) => {
            const fromLogOut = localStorage.getItem("ComingFromLogoutUser");
            if (fromLogOut == undefined || fromLogOut == null) {
              const errorMessage = error.message;
              notifyLoginUser(errorMessage);
            }
          });
      }
    });
  }
};

const checkRollNumberExists = (rollno, callback) => {
  const mostViewedPosts = query(
    ref(db, "students"),
    orderByChild("roll_number"),
    equalTo(rollno)
  );

  onValue(mostViewedPosts, (snapshot) => {
    if (snapshot.exists()) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

const HandleSignupUser = async (
  navigate,
  email,
  password,
  name,
  rollno,
  repeat,
  checkOnce
) => {
  checkRollNumberExists(rollno, function (results) {
    let flag = true;
    if (!validateEmail(email)) {
      notifySigninUser("Enter a valid email address!");
      flag = false;
    } else if (email.substring(email.indexOf("@")) != "@snu.edu.in") {
      notifySigninUser("Enter SNU email address!");
      flag = false;
    }

    if (!validatePassword(password)) {
      notifySigninUser(
        "Password must contain at least a symbol, an uppercase, a lower case letter and a number!"
      );
      flag = false;
    }

    if (password !== repeat) {
      notifySigninUser("Both passwords must be same!");
      flag = false;
    }

    if (checkOnce == 1) {
      if (flag && !results) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            checkOnce = checkOnce + 1;
            const user = userCredential.user;
            writeUserData(user.uid, name, email, rollno);
            sendEmailVerification(user).then(() => {
              // Email verification sent!
              let msg =
                "An email verification link has been sent to " + user.email;
              notifyLoginUser("User Created");
              notifyLoginUser(msg);
            });

            updateProfile(auth.currentUser, {
              displayName: name,
            })
              .then(() => {
                navigate("/LoginUser");
              })
              .catch((error) => {
                const errorMessage = error.message;
                notifySigninUser(errorMessage);
              });
          })
          .catch((error) => {
            const errorMessage = error.message;
            notifySigninUser(errorMessage);
          });
      } else if (results) {
        notifySigninUser(
          "Roll number already exists! Kindly check and try again"
        );
      }
    }
  });
};

const ForgotPasswordFirebase = async (navigate, email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    notifyForgotPassword("Password reset link sent!");
    let valID = localStorage.getItem("FromFP");
    localStorage.removeItem("FromFP");
    if (valID == 1) {
      navigate("/LoginProf");
    } else if (valID == 2) {
      navigate("/LoginUser");
    }
  } catch (err) {
    console.error(err);
    notifyForgotPassword(err.message);
  }
};

const HandleLoginFirebaseProf = (navigate, email, password, isChecked) => {
  if (!validateField(email) || !validateField(password)) {
    notifyLoginProf("Please fill all the fields.");
  } else {
    const profRef = ref(db, "professors/");
    onValue(profRef, (snapshot) => {
      let data = snapshot.val();

      if (data == null) {
        notifyLoginProf("You have not registered!");
        return;
      }

      var val = null;

      for (var key in data) {
        var obj = data[key];
        if (obj.email == email) {
          val = obj;
          break;
        }
      }

      if (val == null) {
        notifyLoginProf("You have not registered!");
        return;
      } else {
        if (isChecked) {
          console.log("checked");
          localStorage.setItem("emailProf", email);
          localStorage.setItem("passwordProf", password);
        } else {
          localStorage.removeItem("emailProf");
          localStorage.removeItem("passwordProf");
        }

        // if (val.email == email && val.password == password) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const fromLogOut = localStorage.getItem("ComingFromLogoutProf");
            if (fromLogOut == undefined || fromLogOut == null) {
              console.log(auth.currentUser.accessToken);
              if (!auth.currentUser.emailVerified) {
                notifyLoginProf("Verify your email!");
              } else {
                notifyLoginProf("Signed in!");
                set(ref(db, "token/" + auth.currentUser.uid), {
                  token: auth.currentUser.accessToken,
                }).catch((error) => {
                  notifyLoginProf(error.message);
                });

                countProfActivity = 1;
                // localStorage.setItem("Bearer", auth.currentUser.accessToken);
                // localStorage.setItem("OrphanageId", id);
                setTimeout(() => navigate("/DashboardProf"), 1000);
              }
            }
          })
          .catch((error) => {
            const fromLogOut = localStorage.getItem("ComingFromLogoutProf");
            if (fromLogOut == undefined || fromLogOut == null) {
              const errorMessage = error.message;
              notifyLoginProf(errorMessage);
            }
          });
        // } else {
        // if (val.id != id) {
        //   alert("You have not registered!");
        // } else {
        // alert("Incorrect Email or Password");
        //   }
        // }
      }
    });
  }
};

const HandleSignupProf = (navigate, email, password, name, contact, repeat) => {
  let flag = true;
  // localStorage.setItem("SignedIn", "");

  if (!validateEmail(email)) {
    notifySigninProf("Enter a valid email address!");
    flag = false;
  } else if (email.substring(email.indexOf("@")) != "@snu.edu.in") {
    notifySigninProf("Enter SNU email address!");
    flag = false;
  }

  if (!validatePassword(password)) {
    notifySigninProf(
      "Password must contain at least a symbol, an uppercase, a lower case letter and a number!"
    );
    flag = false;
  }

  if (password !== repeat) {
    notifySigninProf("Both passwords must be same!");
    flag = false;
  }

  if (flag) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        writeProfData(user.uid, name, email, contact, password);
        sendEmailVerification(user).then(() => {
          // Email verification sent!
          let msg = "An email verification link has been sent to " + user.email;
          notifyLoginProf("User Created");
          notifyLoginProf(msg);
        });

        updateProfile(auth.currentUser, {
          displayName: name,
        })
          .then(() => {
            // localStorage.setItem("SignedIn", flag);
            navigate("/LoginProf");
            //send email verification
          })
          .catch((error) => {
            const errorMessage = error.message;
            notifySigninProf(errorMessage);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        notifySigninProf(errorMessage);
      });
  }
};

function writeUserData(userId, name, email, rollno) {
  console.log("inside write");
  set(ref(db, "students/" + userId), {
    name: name,
    email: email,
    roll_number: rollno,
  }).catch((error) => {
    notifySigninUser(error.message);
  });
}

function writeProfData(userId, name, email, contact, password) {
  console.log("inside write");
  set(ref(db, "professors/" + userId), {
    name: name,
    email: email,
    contact_number: contact,
    password: password,
  }).catch((error) => {
    notifySigninProf(error.message);
  });
}

//--------LOGOUT---------
const LogoutStudent = (navigate) => {
  if (auth.currentUser.uid != null) {
    // const pathRed

    set(ref(db, "token/" + auth.currentUser.uid), {
      token: null,
    }).catch((error) => {
      notifyUserDashboard(error.message);
    });
  }

  var status = "";

  localStorage.removeItem("loggedInAs");
  localStorage.setItem("ComingFromLogoutUser", auth.currentUser.uid);
  localStorage.setItem("noBackUser", true);

  while (status.length == 0) {
    status = updateUserDetails(auth.currentUser.uid);
    console.log(status);
  }

  notifyUserDashboard("Signed out!");
  signOut(auth);
  setTimeout(() => navigate("/LoginUser"), 1000);
  localStorage.removeItem("Bearer");
};

const LogoutProf = (navigate) => {
  if (auth.currentUser.uid != null) {
    // const pathRed

    set(ref(db, "token/" + auth.currentUser.uid), {
      token: null,
    }).catch((error) => {
      notifyProfDashboard(error.message);
    });
  }

  var status = "";

  localStorage.removeItem("loggedInAs");
  localStorage.setItem("ComingFromLogoutProf", auth.currentUser.uid);
  localStorage.setItem("noBackProf", true);

  while (status.length == 0) {
    status = updateProfDetails(auth.currentUser.uid);
    console.log(status);
  }

  notifyProfDashboard("Signed out!");
  signOut(auth);
  setTimeout(() => navigate("/LoginProf"), 1000);
  localStorage.removeItem("Bearer");
};

const updateUserDetails = (uid) => {
  var timeStamp = new Date();
  var date =
    timeStamp.getDate() +
    "_" +
    (timeStamp.getMonth() + 1) +
    "_" +
    timeStamp.getFullYear();

  let arr;

  onValue(ref(db, "students/" + uid), (snapshot) => {
    arr = snapshot.val();
  });

  const updates = {};
  updates["/students/" + uid + "/lastLogin"] = new Date().getTime();
  updates["/students/" + uid + "/activity/" + date] = {
    work:
      countUserActivity +
      (arr.activity[date] == undefined ? 0 : parseInt(arr.activity[date].work)),
  };

  console.log(updates);

  update(ref(db), updates).then(() => {
    return "Successful!";
  });

  return "Successful!";
};

const updateProfDetails = (uid) => {
  var timeStamp = new Date();
  var date =
    timeStamp.getDate() +
    "_" +
    (timeStamp.getMonth() + 1) +
    "_" +
    timeStamp.getFullYear();

  let arr;

  onValue(ref(db, "professors/" + uid), (snapshot) => {
    arr = snapshot.val();
  });

  const updates = {};
  updates["/professors/" + uid + "/lastLogin"] = new Date().getTime();
  updates["/professors/" + uid + "/activity/" + date] = {
    work:
      countProfActivity +
      (arr.activity[date] == undefined ? 0 : parseInt(arr.activity[date].work)),
  };

  console.log(updates);

  update(ref(db), updates).then(() => {
    return "Successful!";
  });

  return "Successful!";
};

function fetchCourses() {
  let arr = [];
  const snapshot = onValue(ref(db, "courses/"), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const childKey = childSnapshot.key;
      arr.push({ key: childKey, data: childData });
    });
  });
  // console.log(arr);
  return arr;
}

const getURL = (location, name) => {
  console.log(name);
  const pathReference = sRef(storage, location + "/" + name);
  getDownloadURL(pathReference)
    .then((url) => {
      if (localStorage.getItem("loggedInAs") == "User") {
        countUserActivity++;
      } else {
        countProfActivity++;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    })
    .catch((error) => {
      console.log(error);
    });
};

function fetchTags() {
  let arr = [];
  let checkTag = [];
  const snapshot = onValue(ref(db, "courses/"), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      let childData = childSnapshot.val();
      if (childData.tag != undefined && childData.tag != "") {
        let splitTag = childData["tag"].split(", ");
        for (var i = 0; i < splitTag.length; i++) {
          if (!checkTag.includes(splitTag[i])) {
            checkTag.push(splitTag[i]);
            arr.push({
              value: splitTag[i],
              label: splitTag[i],
              isFixed: true,
            });
          }
        }
      }
    });
  });
  return arr;
}

function fetchDept() {
  let arr = [];
  let checkTag = [];
  const snapshot = onValue(ref(db, "courses/"), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      let childData = childSnapshot.val();
      if (!checkTag.includes(childData["dept"])) {
        checkTag.push(childData["dept"]);
        arr.push({
          value: childData["dept"],
          label: childData["dept"],
          isFixed: true,
        });
      }
    });
  });
  return arr;
}

const accessUser = () => {
  var uid = auth.currentUser["uid"];
  let array = [];
  var userRef = ref(db, "students/" + uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    array = data["courses"].split(", ");
  });
  return array;
};

const accessUserName = () => {
  if (auth.currentUser != null && auth.currentUser != "")
    return auth.currentUser["displayName"];
};

const uploadQuery = (locationCourse, queryContent) => {
  const pathRef = ref(db, "courses/" + locationCourse + "/query");
  let index = 0;

  onValue(pathRef, (snapshot) => {
    index = snapshot.val().length;
    console.log(index);
  });

  const pathRef2 = ref(db, "students/" + auth.currentUser.uid);
  let email = "";

  onValue(pathRef2, (snapshot) => {
    email = snapshot.val().email;
  });

  const date = new Date().getTime();

  set(ref(db, "courses/" + locationCourse + "/query/" + index), {
    date: date,
    content: queryContent,
    email: email,
  });
};

const getStudentData = () => {
  var uid = auth.currentUser["uid"];
  let array = [];
  var userRef = ref(db, "students/" + uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    array = array.concat(data);
  });
  return array;
};

const getProfData = () => {
  var uid = auth.currentUser["uid"];
  let array = [];
  var profRef = ref(db, "professors/" + uid);
  onValue(profRef, (snapshot) => {
    var data = snapshot.val();
    array = array.concat(data);
  });
  return array;
};

const getPhotoUrl = () => {
  let url = "";
  var userRef = ref(db, "students/" + auth.currentUser.uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    console.log(data);
    url = data.photoURL;
  });
  // console.log(url);
  return url;
};

const getPhotoUrlProf = () => {
  let url = "";
  var userRef = ref(db, "professors/" + auth.currentUser.uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    console.log(data);
    url = data.photoURL;
  });
  // console.log(url);
  return url;
};

const uploadUserPhoto = (file) => {
  const pathReference = sRef(storage, auth.currentUser.uid + "/" + file.name);
  const uploadTask = uploadBytesResumable(pathReference, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      alert(error);
    },
    () => {
      notifyUserDashboard("Uploaded Successfully!");
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const updates = {};
        updates["/students/" + auth.currentUser.uid + "/photoURL"] =
          downloadURL;
        update(ref(db), updates);
      });
    }
  );
};

const uploadProfPhoto = (file) => {
  console.log(file);
  console.log(auth.currentUser.uid);
  const pathReference = sRef(storage, auth.currentUser.uid + "/" + file.name);
  console.log(file);
  console.log(auth.currentUser.uid);
  const uploadTask = uploadBytesResumable(pathReference, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      console.log(file);
      console.log(auth.currentUser.uid);
      alert(error);
    },
    () => {
      console.log(file);
      console.log(auth.currentUser.uid);
      notifyProfDashboard("Uploaded Successfully!");
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const updates = {};
        updates["/professors/" + auth.currentUser.uid + "/photoURL"] =
          downloadURL;
        update(ref(db), updates);
      });
    }
  );
};

const fetchEmailID = () => {
  let email = "";
  var userRef = ref(db, "students/" + auth.currentUser.uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    email = data.email;
  });
  console.log(email);
  return email;
};

const fetchEmailIDProf = () => {
  let email = "";
  var userRef = ref(db, "professors/" + auth.currentUser.uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    email = data.email;
  });
  console.log(email);
  return email;
};

const accessProf = () => {
  var uid = auth.currentUser["uid"];
  let array = [];
  let email = "";

  console.log(uid);

  var profRef = ref(db, "professors/" + uid);
  onValue(profRef, (snapshot) => {
    email = snapshot.val().email;
  });

  var courseRef = ref(db, "courses/");
  onValue(courseRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      console.log(childSnapshot.val().faculty);
      console.log(email);
      if (childSnapshot.val().emailFaculty == email) {
        const childData = childSnapshot.val();
        const childKey = childSnapshot.key;
        array.push({ key: childKey, data: childData });
      }
    });
  });
  // console.log(array);
  return array;
};

const addVStudent = (rollNumber, course) => {
  console.log(rollNumber);
  console.log(course);
  const studentData = query(
    ref(db, "students"),
    orderByChild("roll_number"),
    equalTo(rollNumber)
  );
  let value = "";
  let uid = "";
  onValue(studentData, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    if (data == null) {
      notifyProfDashboard("Student does not exist!");
      return;
    } else {
      uid = Object.keys(data)[0];
    }
    snapshot.forEach((childSnapshot) => {
      // console.log(childSnapshot.uid);
      value = childSnapshot.val().courses;
    });
  });

  console.log(uid);

  let courseEnr = "";
  console.log(value);
  console.log(course);
  console.log(value.indexOf(course));
  if (value.indexOf(course) == -1) {
    courseEnr = value + ", " + course;
    const updates = {};
    updates["/students/" + uid + "/courses"] = courseEnr;
    update(ref(db), updates);
    notifyProfDashboard("Student Enrolled Successfully!");
  } else {
    notifyProfDashboard("Student is already enrolled in this course!");
  }
};

const updateReadFirebase = (courseKey, read) => {
  const updates = {};
  updates["/courses/" + courseKey + "/queryRead"] = read;
  update(ref(db), updates);
};

const addModuleFunc = (courseKey, newContentKey) => {
  set(ref(db, "courses/" + courseKey + "/content/" + newContentKey + "/0"), {
    format: "New Empty Module",
  });
};

const removeModuleFunc = (moduleNum, courseKey) => {
  const updates = {};
  updates["/courses/" + courseKey + "/content/" + moduleNum] = null;
  update(ref(db), updates);
};

const removeDoc = (location, docKey) => {
  var courseKey = location.substring(0, location.indexOf("/"));
  var moduleNo = location.substring(location.indexOf("/") + 1);
  const updates = {};
  updates["/courses/" + courseKey + "/content/" + moduleNo + "/" + docKey] =
    null;
  update(ref(db), updates);
  console.log("Deleted");
};

const handleUploadFile = (file, location) => {
  var courseKey = location.substring(0, location.indexOf("/"));
  var moduleNo = location.substring(location.indexOf("/") + 1);

  const storageRef = sRef(
    storage,
    courseKey + "/" + moduleNo + "/" + file.name
  );

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      // download url
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log(url);
        var newIndex = "";
        var profRef = ref(db, "courses/" + courseKey + "/content/" + moduleNo);
        onValue(profRef, (snapshot) => {
          newIndex = snapshot.val().length;
        });
        set(
          ref(
            db,
            "courses/" + courseKey + "/content/" + moduleNo + "/" + newIndex
          ),
          {
            format: file["name"].substring(file["name"].lastIndexOf(".") + 1),
            name: file["name"],
            url: file["name"],
          }
        );
      });
    }
  );

  console.log("Uploaded");
};

export {
  HandleLoginFirebaseUser,
  HandleSignupUser,
  HandleLoginFirebaseProf,
  HandleSignupProf,
  LogoutStudent,
  ForgotPasswordFirebase,
  fetchCourses,
  fetchTags,
  accessUser,
  getURL,
  uploadQuery,
  fetchDept,
  getStudentData,
  updateUserDetails,
  uploadUserPhoto,
  getPhotoUrl,
  accessUserName,
  fetchEmailID,
  LogoutProf,
  accessProf,
  addVStudent,
  getProfData,
  getPhotoUrlProf,
  uploadProfPhoto,
  fetchEmailIDProf,
  updateReadFirebase,
  addModuleFunc,
  removeModuleFunc,
  removeDoc,
  handleUploadFile,
};
