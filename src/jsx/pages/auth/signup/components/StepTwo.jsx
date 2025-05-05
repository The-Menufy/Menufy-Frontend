import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { signupStore } from "../../../../store/signupStore";
import { format } from "date-fns";
import PhoneInput from "react-phone-input-2";
const StepTwo = () => {
  const { setStep, step, setCurrentUser, currentUser } = signupStore();
  // Define the validation schema using Yup
  const schema = yup.object().shape({
    phone: yup
      .string()
      .matches(/^\+?[0-9]{8,15}$/, "Invalid phone number")
      .required("Phone number is required"),
    address: yup.string().required("Address is required"),
    birthday: yup
      .date()
      .max(new Date(), "Birthday cannot be in the future")
      .required("Birthday is required"),
  });
  // Initialize useForm with the resolver and default values
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: currentUser.phone,
      address: currentUser.address,
      birthday: currentUser.birthday,
    },
  });
  // Handle form submission
  const onSubmit = (data) => {
    data.birthday = format(data.birthday, "yyyy-MM-dd");
    console.log(data);
    setCurrentUser(data);
    setStep(3);
  };
  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Phone Field */}
          <div className="col-lg-6 mb-2">
            <div className="form-group mb-3">
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>

              <Controller
                name={"phone"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    country={"tn"}
                    value={value?.toString() || ""}
                    onChange={onChange}
                    inputClass="form-control  rounded-3 w-100"
                    containerClass="w-100 h-100 p-0"
                    inputStyle={{ height: "41px" }}
                    containerStyle={{ height: "41px" }}
                    buttonStyle={{ height: "41px" }}
                    buttonClass="bg-white  rounded-start-3"
                  />
                )}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone.message}</div>
              )}
            </div>
          </div>
          {/* Address Field */}
          <div className="col-lg-6 mb-2">
            <div className="form-group mb-3">
              <label className="form-label">
                Address <span className="required">*</span>
              </label>
              <input
                type="text"
                {...register("address")}
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                placeholder="123 Main St"
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address.message}</div>
              )}
            </div>
          </div>
          {/* Birthday Field */}
          <div className="col mb-2">
            <div className="form-group mb-3">
              <label className="form-label">
                Birthday <span className="required">*</span>
              </label>
              <input
                type="date"
                {...register("birthday")}
                format="yyyy-MM-dd"
                className={`form-control ${
                  errors.birthday ? "is-invalid" : ""
                }`}
              />
              {errors.birthday && (
                <div className="invalid-feedback">
                  {errors.birthday.message}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <Row sm={3} className="gap-2 justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setStep(step - 1)}
          >
            <FaArrowLeft size={20} />
          </button>
          <button type="submit" className="btn btn-primary">
            <FaArrowRight size={20} />
          </button>
        </Row>
      </form>
    </section>
  );
};
export default StepTwo;
