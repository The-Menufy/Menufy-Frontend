import React, { useState } from "react";
import { Button, Card, Stack } from "react-bootstrap";
import backgroundImage from "@assets/images/backgroundRestaurant.jpg";
import { authStore } from "../../../../store/authStore";
import { BiCamera } from "react-icons/bi"; // Import de l'icône de caméra
import { toast } from "react-toastify";
const ProfileHeader = () => {
  const { currentUser, updateProfile } = authStore();
  const [previewImage, setPreviewImage] = useState(
    currentUser.user.image || "favicon.ico"
  );

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setPreviewImage(newImageUrl);

      try {
        await updateProfile(currentUser.token, {
          ...currentUser.user,
          image: newImageUrl,
        });

        toast.success("Image Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error("Failed to update image");
        setPreviewImage(currentUser.user.image || "favicon.ico");
      }
    }
  };

  const handleButtonClick = () => {
    document.getElementById("imageInput").click();
  };

  return (
    <div className="mt-4">
      <Card className="profile card-body px-3 pt-3 pb-0 shadow">
        <div className="profile-head">
          <div
            className="photo-content"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              height: "400px",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          ></div>
          <div className="profile-info">
            <div className="profile-photo">
              <Stack className="justify-content-around align-items-center position-relative">
                <img
                  src={currentUser.user.image || "favicon.ico"}
                  className="rounded-circle"
                  width={140}
                  height={140}
                  alt="profile"
                />
                {/* Icône caméra pour changer l'image */}
                <Button
                  onClick={handleButtonClick}
                  className="position-absolute bottom-0 end-0 p-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor:
                      "rgba(var(--bs-primary-rgb), var(--bs-bg-opacity))",
                    border: "1px solid ##EA7B9B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BiCamera size={20} color="#EA7B9B" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="imageInput"
                  style={{ display: "none" }}
                />
              </Stack>
            </div>
            <div className="profile-details">
              <div className="profile-name px-3 pt-2">
                <h4 className="text-primary mb-0">
                  {currentUser.user.firstName} {currentUser.user.lastName}
                </h4>
                <p>{currentUser.user.role}</p>
              </div>
              <div className="profile-email px-2 pt-2">
                <h4 className="text-muted mb-0">{currentUser.user.email}</h4>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;
