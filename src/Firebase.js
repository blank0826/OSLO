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
    window.alert("Please fill all the fields.");
  } else {
    const studentRef = ref(db, "students/");
    onValue(studentRef, (snapshot) => {
      let data = snapshot.val();
      console.log(data);
      if (data == null) {
        alert("You have not registered!");
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
        alert("You have not registered!");
        return;
      } else {
        // if (val.email == email && val.password == password) {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(email);
            console.log(password);
            console.log(auth.currentUser.accessToken);
            if (!auth.currentUser.emailVerified) {
              window.alert("Verify your email!");
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
                window.alert(error.message);
              });

              // localStorage.setItem("Bearer", auth.currentUser.accessToken);
              // localStorage.setItem("OrphanageId", id);
              countUserActivity = 1;
              window.alert("Signed in!");
              navigate("/DashboardUser");
            }
          })
          .catch((error) => {
            const errorMessage = error.message;
            window.alert(errorMessage);
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
      window.alert("Enter a valid email address!");
      flag = false;
    }

    if (!validatePassword(password)) {
      window.alert(
        "Password must contain at least a symbol, an uppercase, a lower case letter and a number!"
      );
      flag = false;
    }

    if (password !== repeat) {
      window.alert("Both passwords must be same!");
      flag = false;
    }

    if (checkOnce == 1) {
      if (flag && !results) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            window.alert("User Created");
            checkOnce = checkOnce + 1;
            const user = userCredential.user;
            writeUserData(user.uid, name, email, rollno);
            sendEmailVerification(user).then(() => {
              // Email verification sent!
              let msg =
                "An email verification link has been sent to " + user.email;
              window.alert(msg);
            });

            updateProfile(auth.currentUser, {
              displayName: name,
            })
              .then(() => {
                // localStorage.setItem("SignedIn", flag);
                navigate("/LoginUser");
                //send email verification
              })
              .catch((error) => {
                const errorMessage = error.message;
                window.alert(errorMessage);
              });
          })
          .catch((error) => {
            const errorMessage = error.message;
            window.alert(errorMessage);
          });
      } else if (results) {
        window.alert("Roll number already exists! Kindly check and try again");
      }
    }
  });
};

const ForgotPasswordFirebase = async (navigate, email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
    let valID = localStorage.getItem("FromFP");
    if (valID == 1) {
      navigate("/LoginProf");
    } else if (valID == 2) {
      navigate("/LoginUser");
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const HandleLoginFirebaseProf = (navigate, email, password, isChecked) => {
  if (!validateField(email) || !validateField(password)) {
    window.alert("Please fill all the fields.");
  } else {
    const profRef = ref(db, "professors/");
    onValue(profRef, (snapshot) => {
      let data = snapshot.val();

      if (data == null) {
        alert("You have not registered!");
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
        alert("You have not registered!");
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
            console.log(auth.currentUser.accessToken);
            if (!auth.currentUser.emailVerified) {
              window.alert("Verify your email!");
            } else {
              window.alert("Signed in!");
              set(ref(db, "token/" + auth.currentUser.uid), {
                token: auth.currentUser.accessToken,
              }).catch((error) => {
                window.alert(error.message);
              });

              // localStorage.setItem("Bearer", auth.currentUser.accessToken);
              // localStorage.setItem("OrphanageId", id);
              navigate("/DashboardProf");
            }
          })
          .catch((error) => {
            const errorMessage = error.message;
            window.alert(errorMessage);
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
    window.alert("Enter a valid email address!");
    flag = false;
  }

  if (!validatePassword(password)) {
    window.alert(
      "Password must contain at least a symbol, an uppercase, a lower case letter and a number!"
    );
    flag = false;
  }

  if (password !== repeat) {
    window.alert("Both passwords must be same!");
    flag = false;
  }

  if (flag) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.alert("User Created");
        const user = userCredential.user;
        writeProfData(user.uid, name, email, contact, password);
        sendEmailVerification(user).then(() => {
          // Email verification sent!
          let msg = "An email verification link has been sent to " + user.email;
          window.alert(msg);
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
            window.alert(errorMessage);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        window.alert(errorMessage);
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
    window.alert(error.message);
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
    window.alert(error.message);
  });
}

//--------LOGOUT---------
const LogoutStudent = (navigate) => {
  if (auth.currentUser.uid != null) {
    // const pathRed

    set(ref(db, "token/" + auth.currentUser.uid), {
      token: null,
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  window.alert("Signed out!");
  signOut(auth);
  navigate("/LoginUser");
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
      (arr.activity[date] == undefined ? 0 : arr.activity[date].work),
  };

  console.log(updates);

  // arr.activity[date] = {
  //   work:
  //     ,
  // };

  // arr.lastLogin = new Date().getTime();

  // console.log(arr.activity);
  // console.log(arr.lastLogin);
  // let obj = {
  //   activity: arr.activity,
  //   branch: arr.branch,
  //   courses: arr.courses,
  //   email: arr.email,
  //   lastLogin: arr.lastLogin,
  //   name: arr.name,
  //   roll_number: arr.roll_number,
  // };

  // console.log(obj);

  update(ref(db), updates);

  return;
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
      countUserActivity++;
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
        // if (!checkTag.includes(childData["dept"])) {
        //   checkTag.push(childData["dept"]);
        //   arr.push({
        //     value: childData["dept"],
        //     label: childData["dept"],
        //     isFixed: true,
        //   });
        // }
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

  set(ref(db, "courses/" + locationCourse + "/query/" + index), {
    content: queryContent,
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
      window.alert("Uploaded Successfully!");
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const updates = {};
        updates["/students/" + auth.currentUser.uid + "/photoURL"] =
          downloadURL;
        update(ref(db), updates);
      });
    }
  );
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
};
