import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { uploadUserPhoto, getPhotoUrl } from "../../Firebase";
// const ImgUpload = ({ onChange, src }) => (

// );

export default function CardProfile() {
  const [file, setFile] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // console.log(imageUrl);
    if (imageUrl == undefined || imageUrl.length == 0) {
      var url = getPhotoUrl();
      //   console.log(url);
      if (url == undefined) {
        setImageUrl("");
      } else {
        setImageUrl(url);
      }
    } else {
      //   console.log(imageUrl);
      if (imageUrl == "NIL") {
        setImageUrl(
          "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
        );
      }
    }
  }, [imageUrl]);

  const onChange = (e) => {
    var reader = new FileReader();
    setFile(e.target.files[0]);
    reader.onload = function () {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const uploadPhoto = (e) => {
    uploadUserPhoto(file);
  };

  return (
    <>
      <div>
        <div className="card">
          <label htmlFor="photo-upload" className="custom-file-upload fas">
            <div className="img-wrap img-upload relative">
              <img for="photo-upload" src={imageUrl} />
            </div>
            <input id="photo-upload" type="file" onChange={onChange} />
          </label>
          {/* <ImgUpload src={imageUrl} /> */}
          <button
            type="submit"
            className="saveProfileButton"
            onClick={uploadPhoto}
          >
            Upload{" "}
          </button>
        </div>
      </div>
    </>
  );
}
