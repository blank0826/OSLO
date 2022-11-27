import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useEffect } from "react";
import { BsWindowSidebar } from "react-icons/bs";

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

const HandleSignupUser = (navigate, email, password, name, rollno, repeat) => {
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
        writeUserData(user.uid, name, email, rollno);
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
  }
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
    set(ref(db, "token/" + auth.currentUser.uid), {
      token: null,
    }).catch((error) => {
      window.alert(error.message);
    });
  }
  navigate("/LoginUser");
  signOut(auth);
  window.alert("Signed out!");
  //localStorage.removeItem("Bearer");
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

function updateCourse(location) {
  console.log(location);
}

const accessUser = () => {
  var uid = auth.currentUser["uid"];
  console.log(uid);
  let array = [];
  var userRef = ref(db, "students/" + uid);
  onValue(userRef, (snapshot) => {
    var data = snapshot.val();
    array = data["courses"].split(", ");
  });
  return array;
};

export {
  HandleLoginFirebaseUser,
  HandleSignupUser,
  HandleLoginFirebaseProf,
  HandleSignupProf,
  LogoutStudent,
  ForgotPasswordFirebase,
  fetchCourses,
  updateCourse,
  accessUser,
};
