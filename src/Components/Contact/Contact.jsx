import { React, useState } from "react";
import osloStrip from "../../images/osloStrip.png";
import { send } from "emailjs-com";

export default function Contact() {
  const [toSend, setToSend] = useState({
    from_name: "",
    to_name: "",
    message: "",
    reply_to: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    send("service_htvdgkr", "template_k7fshh8", toSend, "7njiqsileUfeKGxNo")
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });

    window.alert("Enquiry Sent!");

    setToSend({
      from_name: "",
      to_name: "",
      message: "",
      reply_to: "",
    });
  };

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center relative"
        style={{ background: "#C490E4", fontFamily: "Merriweather" }}
      >
        <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
        <div
          className="sm:flex sm:flex-row mx-0"
          style={{ marginLeft: "5rem", height: "100vh" }}
        >
          <div className="flex-col flex self-center p-10 z-10">
            <h1
              className="text-2xl tracking-wider"
              style={{
                fontSize: "50px",
                color: "#F7EDDC",
                fontWeight: "bold",
                fontFamily: "Playfair Display",
              }}
            >
              Contact OSLO
            </h1>
            <div
              className="bg-white flex flex-col md:ml-auto md:py-8 mt-8 md:mt-0"
              style={{
                marginTop: "3rem",
                backgroundColor: "#F5EDDC",
                width: "80vw",
                padding: "2rem",
              }}
            >
              <h3
                className="text-gray-900 mb-1 font-medium title-font"
                style={{ fontSize: "25px", letterSpacing: "2px" }}
              >
                Have a query? Submit your details and we will get in touch with
                you!
              </h3>
              <form onSubmit={onSubmit}>
                <div className="relative mb-4">
                  <label for="name" className="leading-7 text-sm text-gray-900">
                    Name
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    value={toSend.from_name}
                    onChange={handleChange}
                    style={{ backgroundColor: "#f7f9f1" }}
                    className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    for="email"
                    className="leading-7 text-sm text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="reply_to"
                    value={toSend.reply_to}
                    onChange={handleChange}
                    style={{ backgroundColor: "#f7f9f1" }}
                    className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label
                    for="message"
                    className="leading-7 text-sm text-gray-900"
                  >
                    Message
                  </label>
                  <textarea
                    type="text"
                    name="message"
                    value={toSend.message}
                    onChange={handleChange}
                    style={{ backgroundColor: "#f7f9f1", height: "90%" }}
                    className="w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  style={{backgroundColor:"#C490E4"}}
                >
                  Send
                </button>
              </form>
            </div>
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">
            <p>© OSLO 2022</p>
          </div>
        </div>
      </div>
    </>
  );
}
