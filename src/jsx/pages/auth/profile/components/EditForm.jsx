import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, Stack } from "react-bootstrap";
import { authStore } from "../../../../store/authStore";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { editFormSchema } from "./validators/EditFormValidator";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
const EditForm = () => {
  const navigate = useNavigate();
  try {
    const { currentUser, setActiveTab, updateProfile } = authStore();
    if (!currentUser.user && !currentUser.token) navigate("/login");
    // Fields to exclude from the form
    const excludedFields = [
      "_id",
      "__v",
      "__t",

      "createdAt",
      "updatedAt",
      "isEmailVerified",
      "authProvider",
      "verifiedDevices",
      "isVerified",
      "role",
      "images",
      "logo",
      "color",
      "image",
      "payCashMethod",
    ];
    const {
      register,
      handleSubmit,
      control,
      getValues,

      formState: { errors },
    } = useForm({
      resolver: yupResolver(editFormSchema),
      defaultValues: currentUser.user,
    });
    console.log(errors);
    const onSubmit = async (values) => {
      try {
        await updateProfile(currentUser.token, values);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile Updated",
        });
        setTimeout(() => {
          setActiveTab("About");
        }, 500);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Error While Updating Profile",
        });
      }
    };

    const renderInput = (key, value, prefix = "") => {
      if (excludedFields.includes(key)) return null;

      const fieldName = prefix ? `${prefix}.${key}` : key;
      const label =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

      if (key === "phone") {
        return (
          <Col key={fieldName}>
            <label className="form-label">{label}</label>
            <Controller
              name={fieldName}
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  country={"tn"}
                  value={value?.toString() || ""}
                  onChange={onChange}
                  inputClass="form-control border-primary rounded-3 w-100"
                  containerClass="w-100 h-100 p-0"
                  inputStyle={{ height: "41px" }}
                  containerStyle={{ height: "41px" }}
                  buttonStyle={{ height: "41px" }}
                  buttonClass="bg-white border-primary rounded-start-3"
                />
              )}
            />
            <p className="text-danger">{errors[fieldName]?.message}</p>
          </Col>
        );
      }

      if (key === "birthday") {
        return (
          <Col key={fieldName}>
            <label className="form-label">{label}</label>
            <input
              type="date"
              {...register(fieldName)}
              className="form-control border-primary rounded-3"
              style={{ height: "41px" }}
            />
            <p className="text-danger">{errors[fieldName]?.message}</p>
          </Col>
        );
      }

      return (
        <Col key={fieldName}>
          <label className="form-label">{label}</label>
          <input
            {...register(fieldName)}
            type={typeof value === "number" ? "number" : "text"}
            className="form-control border-primary rounded-3"
            style={{ height: "41px" }}
          />
          <p className="text-danger">{errors[fieldName]?.message}</p>
        </Col>
      );
    };

    const renderUserInfo = () => {
      const userFields = Object.entries(currentUser.user)
        .filter(
          ([key]) => !excludedFields.includes(key) && key !== "restaurant"
        )
        .map(([key, value]) => renderInput(key, value));

      return (
        <>
          <h3
            className="text-secondary mb-4"
            style={{
              borderBottom: "2px solid #EA7B9B",
              paddingBottom: "10px",
              display: "inline-block",
            }}
          >
            Personal Information
          </h3>
          <Row xs={1} sm={2} md={3} className="g-3">
            {userFields}
          </Row>
        </>
      );
    };

    // Comment out renderRestaurantInfo function and its call
    /* const renderRestaurantInfo = () => {
      if (!currentUser.user?.restaurant) return null;

      const restaurantFields = Object.entries(currentUser.user.restaurant)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, value]) => renderInput(key, value, "restaurant"));

      return (
        <Stack className="mt-4">
          <h3 className="text-secondary mb-3" style={{
            borderBottom: "2px solid #EA7B9B",
            paddingBottom: "10px",
            display: "inline-block",
            width: "fit-content",
          }}>
            Restaurant Information
          </h3>
          <Row xs={1} sm={2} md={3} className="g-3">
            {restaurantFields}
          </Row>
        </Stack>
      );
    }; */

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 rounded"
        style={{
          border: "2px solid #EA7B9B",
          borderRadius: "10px",
        }}
      >
        {renderUserInfo()}
        {/* {renderRestaurantInfo()} */}
        <button
          type="submit"
          className="btn btn-primary mt-4 px-4 py-2 rounded-pill shadow"
        >
          Update Profile
        </button>
      </form>
    );
  } catch (error) {
    navigate("/login");
  }
};

export default EditForm;
