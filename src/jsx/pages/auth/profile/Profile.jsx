import React from "react";
import { Tab, Nav, Card, Row, Col } from "react-bootstrap";
import { authStore } from "../../../store/authStore";
import ProfileHeader from "./components/ProfileHeader";
import EditForm from "./components/EditForm";
import { ToastContainer } from "react-toastify";
import { BsPersonCircle, BsBriefcaseFill, BsShop } from "react-icons/bs"; // Icônes Bootstrap
import UpdatePassword from "./components/UpdatePassword";
const Profile = () => {
  const { currentUser, profile, setActiveTab } = authStore();
  const hiddenFields = [
    "restaurant",
    "isEmailVerified",
    "employee",
    "image",
    "__v",
    "createdAt",
    "updatedAt",
    "verifiedDevices",
    "isVerified",
    "__t",
    "_id",
    "authProvider",
    "color",
    "logo",
    "payCashMethod",
    "images",
  ];
  return (
    <div className="container mt-4">
      <ToastContainer />
      <ProfileHeader />

      <Card className="mt-4 shadow border-0 rounded">
        <div className="card-body">
          <Tab.Container activeKey={profile.tab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link
                  eventKey="About"
                  onClick={() => setActiveTab("About")}
                  style={{
                    color: profile.tab === "About" ? "#EA7B9B" : "#EA7B9B",
                    borderBottom:
                      profile.tab === "About" ? "2px solid #EA7B9B" : "none",
                  }}
                >
                  Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="Settings"
                  onClick={() => setActiveTab("Settings")}
                  style={{
                    color: profile.tab === "Settings" ? "#EA7B9B" : "#EA7B9B",
                    borderBottom:
                      profile.tab === "Settings" ? "2px solid #EA7B9B" : "none",
                  }}
                >
                  Settings
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="Password"
                  onClick={() => setActiveTab("Password")}
                  style={{
                    color: profile.tab === "Password" ? "#EA7B9B" : "#EA7B9B",
                    borderBottom:
                      profile.tab === "Password" ? "2px solid #EA7B9B" : "none",
                  }}
                >
                  Password
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Section About */}
              <Tab.Pane eventKey="About">
                {/* 🧑 User Info */}
                <Card
                  className="mb-4 border-0 p-3 rounded"
                  style={{ borderRadius: "10px", border: "1px solid #EA7B9B" }}
                >
                  <h3
                    className="text-secondary mb-4"
                    style={{
                      borderBottom: "2px solid #EA7B9B",
                      paddingBottom: "10px",
                      display: "inline-block",
                      width: "fit-content",
                    }}
                  >
                    Account Information
                  </h3>
                  <Row className="align-items-center">
                    {/* <Col xs={3} className="text-center">
                      <BsPersonCircle size={60} style={{ color: "#EA7B9B" }} />
                    </Col> */}
                    <Row
                      xs={1}
                      sm={2}
                      lg={3}
                      className="flex-wrap border-primary p-5"
                    >
                      {Object.keys(currentUser.user).map((field) => {
                        if (hiddenFields.includes(field)) return null;

                        return (
                          <Col key={field} className="my-2">
                            <label className="text-capitalize text-primary">
                              {field}:
                            </label>{" "}
                            <input
                              className="form-control border-primary rounded-3 text-black "
                              style={{ height: "41px" }}
                              type="text"
                              readOnly
                              defaultValue={currentUser.user[field]}
                            />
                            {/* {field === "phone" && "+"} {currentUser.user[field]} */}
                          </Col>
                        );
                      })}
                    </Row>
                  </Row>
                </Card>

                {/* 🍽️ Restaurant Info */}
                {/* Comment out Restaurant Info section */}
                {/* {currentUser?.user?.restaurant && (
                  <Card className="mb-4 border-0">
                    <Card.Body className="p-4">
                      <div className="section-header mb-4 d-flex justify-content-between align-items-center">
                        <h4 style={{ 
                          color: '#333', 
                          fontWeight: '600',
                          borderBottom: '2px solid #EA7B9B',
                          paddingBottom: '8px'
                        }}>
                          <BsShop 
                            size={24} 
                            style={{ color: "#EA7B9B", marginRight: '10px' }} 
                          />
                          Restaurant Info
                        </h4>
                        <div style={{ color: '#EA7B9B', cursor: 'pointer' }}>
                          <i className="fas fa-pencil-alt" />
                        </div>
                      </div>
                      <div className="info-grid">
                        {Object.keys(currentUser.user.restaurant).map((field) => {
                          if (hiddenFields.includes(field)) return null;
                          return (
                            <div key={field} className="info-item d-flex align-items-center">
                              <div className="info-label">
                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                              </div>
                              <div className="info-value">
                                {currentUser.user.restaurant[field]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card.Body>
                  </Card>
                )} */}
              </Tab.Pane>
              {/* Section Edit */}
              {/* Update the Tab.Pane eventKey as well */}
              <Tab.Pane eventKey="Settings">
                <EditForm />
              </Tab.Pane>

              {/* Section Password */}
              <Tab.Pane eventKey="Password">
                <UpdatePassword />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
