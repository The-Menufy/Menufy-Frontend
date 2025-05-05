import React, { useState } from "react";
import { Form, Button, Card, Row, Col, InputGroup } from "react-bootstrap";
import { authStore } from "../../../../store/authStore";
import Swal from "sweetalert2";
import { updatePasswordFormSchema } from "./validators/UpdatePasswordFormValidator";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { currentUser, updatePassword, setActiveTab } = authStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setSuccess("");

      updatePasswordFormSchema.validateSync(passwordData);
      const result = await updatePassword(currentUser.token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setSuccess("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Redirect to profile page after 1 second
        setTimeout(() => {
          setActiveTab("About");
        }, 1000);
      } else {
        setError(result.error || "Failed to update password");
      }
    } catch (error) {
      setError(error.message || "Failed to update password");
    }
  };

  return (
    <Card
      className="p-4 shadow-sm"
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
        Change Password
      </h3>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-3" role="alert">
          {success}
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="border-primary rounded-3"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  className="border-primary rounded-3"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="border-0"
                >
                  {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="border-primary rounded-3"
                />
                <Button
                  variant="outline-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="border-0"
                >
                  {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Button
          type="submit"
          style={{ 
            backgroundColor: "#EA7B9B",
            border: "none",
            color: "white"
          }}
          className="mt-4 px-4 py-2 rounded-pill shadow"
        >
          Update Password
        </Button>
      </Form>
    </Card>
  );
};

export default UpdatePassword;
