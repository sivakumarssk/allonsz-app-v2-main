import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|in)$/,
      "Please enter a valid email address."
    )
    // .test(
    //   "is-supported-domain",
    //   "Please use one of the supported email providers: Gmail, Yahoo, Outlook, Hotmail, iCloud, or AOL.",
    //   (value) => {
    //     if (!value) return true;

    //     const allowedDomains = [
    //       "gmail.com",
    //       "yahoo.com",
    //       "outlook.com",
    //       "hotmail.com",
    //       "icloud.com",
    //       "aol.com",
    //     ];

    //     const domain = value.split("@")[1];
    //     return allowedDomains.includes(domain);
    //   }
    // )
    .test(
      "no-invalid-start-end",
      "Email cannot start or end with special characters.",
      (value) => value && !/^[^a-zA-Z0-9]|[^a-zA-Z0-9]$/.test(value)
    )
    .test(
      "no-consecutive-dots",
      "Email cannot contain consecutive dots.",
      (value) => value && !/\.\./.test(value)
    )
    .email("Invalid email address.")
    .required("Email is required."),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export const EmailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .test(
      "no-invalid-start-end",
      "Email cannot start or end with special characters.",
      (value) => value && !/^[^a-zA-Z0-9]|[^a-zA-Z0-9]$/.test(value)
    )
    .test(
      "no-consecutive-dots",
      "Email cannot contain consecutive dots.",
      (value) => value && !/\.\./.test(value)
    )
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|in)$/,
      "Please enter a valid email address."
    )
    .test(
      "is-supported-domain",
      "Please use one of the supported email providers: Gmail, Yahoo, Outlook, Hotmail, iCloud, or AOL.",
      (value) => {
        if (!value) return true;

        const allowedDomains = [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
          "icloud.com",
          "aol.com",
        ];

        const domain = value.split("@")[1];
        return allowedDomains.includes(domain);
      }
    )
    .email("Invalid email address.")
    .required("Email is required."),
});

export const passwordValidationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(
      8,
      "Password must be 8-14 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const UserSchema = yup.object().shape({
  photo: yup
    .mixed()
    .test(
      "fileSize",
      "File is too large",
      (value) => (value ? value.fileSize <= 20 * 1024 * 1024 : true) // 2MB limit
    )
    .test("fileType", "Unsupported file format", (value) =>
      value ? ["image/jpeg", "image/png"].includes(value.mimeType) : true
    )
    .required("Photo is required"),

  first_name: yup
    .string()
    .test(
      "no-leading-spaces",
      "First name cannot start with a space.",
      (value) => value && value.trimStart() === value
    )
    .test(
      "first-letter-capital",
      "First name must start with a capital letter.",
      (value) => value && /^[A-Z]/.test(value)
    )
    .matches(/^[^0-9]*$/, "First name should not contain numbers.")
    .matches(/^[A-Za-z\s]*$/, "First name cannot contain special characters.")
    .min(3, "First name must be at least 3 characters long.")
    .max(30, "First name cannot exceed 30 characters.")
    .required("First name is required."),

  last_name: yup
    .string()
    .test(
      "no-leading-spaces",
      "Last name cannot start with a space.",
      (value) => value && value.trimStart() === value
    )
    .test(
      "first-letter-capital",
      "Last name must start with a capital letter.",
      (value) => value && /^[A-Z]/.test(value)
    )
    .matches(/^[^0-9]*$/, "Last name should not contain numbers.")
    .matches(/^[A-Za-z\s]*$/, "Last name cannot contain special characters.")
    .min(1, "Last name must be at least 1 characters long.")
    .max(20, "Last name cannot exceed 20 characters.")
    .required("Last name is required."),

  username: yup
    .string()
    .test(
      "no-starting-space",
      "Username must not start with a space",
      (value) => value && !value.startsWith(" ")
    )
    .test(
      "no-all-digits",
      "Username cannot be all numbers",
      (value) => value && !/^\d+$/.test(value) // Rejects usernames that are only digits
    )
    .min(3, "Username must be at least 3 characters long")
    .max(8, "Username cannot exceed 8 characters")
    .required("Username is required"),

  gender: yup
    .string()
    .oneOf(["Male", "Female", "Others"], "Invalid gender")
    .required("Gender is required"),

  country_name: yup.string().required("Please select one of the country"),
  // country_id: yup.string(),

  state_name: yup.string().required("Please select one of the state"),
  // state_id: yup.string(),

  district_name: yup.string().required("Please select one of the district"),
  // district_id: yup.string(),

  mandal_name: yup.string().required("Please select one of the mandal"),
  // mandal_id: yup.string(),

  address: yup
    .string()
    .test(
      "no-leading-spaces",
      "Address cannot start with a space.",
      (value) => value && value.trimStart() === value
    )
    .test(
      "must-have-letter",
      "Only numbers and only special characters are not allowed please enter some letters also.",
      (value) => value && /[a-zA-Z]/.test(value)
    )
    .min(10, "Address must be at least 10 characters long")
    .max(255, "Address cannot exceed 255 characters")
    .required("Address is required"),

  pincode: yup
    .string()
    .matches(/^[1-9][0-9]{5}$/, "Please enter valid pincode")
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),

  phone: yup
    .string()
    .test(
      "start-with-correct-digit",
      "Phone number must start with 9, 8, 7, or 6.",
      (value) => value && /^[6789]/.test(value)
    )
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  referal_code: yup
    .string()
    // .matches(
    //   /^[A-Z]{3}-\d{9}$/,
    //   "Unique ID must be in the format ABC-123456789"
    // )
    // .length(13, "Unique ID must be exactly 13 characters") // Referral code can be null or string
    .required("unique ID is required"),
  checkbox: yup
    .boolean()
    .oneOf([true], "You must agree")
    .required("This field is required."),
});

export const AADHAR_verificationSchema = yup.object().shape({
  aadhar_no: yup
    .string()
    .matches(
      /^(?!0000-0000-0000)\d{4}-\d{4}-\d{4}$/,
      "Aadhar number must be a valid 12-digit number"
    )
    .required("Aadhar number is required"),
});

export const PAN_verificationSchema = yup.object().shape({
  pan_no: yup
    .string()
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      "Invalid PAN format. Must be 5 letters, 4 digits, 1 letter (e.g.,ABCDE1234F)"
    )
    .length(10, "PAN number must be exactly 10 characters long")
    .required("PAN number is required"),
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),
  dob: yup.string().required("Date of Birth is required"),
});

export const bankSchema = yup.object().shape({
  // bank_name: yup
  //   .string()
  //   .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed")
  //   .required("Bank Name is required"),

  // branch: yup
  //   .string()
  //   .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed")
  //   .required("Branch is required"),

  account_no: yup
    .string()
    .matches(/^\d+$/, "Account number must contain only digits")
    .min(8, "Account number must be at least 8 digits")
    .max(18, "Account number cannot exceed 18 digits")
    .test("not-all-zeros", "Account number cannot be all zeros", (value) => {
      return value !== "0".repeat(value.length); // Check if all characters are '0'
    })
    .required("Account number is required"),

  // account_type: yup
  //   .string()
  //   .oneOf(["Saving", "Current"], "Invalid account type")
  //   .required("Account type is required"),

  ifsc_code: yup
    .string()
    .test(
      "starts-with-number",
      "IFSC code must start with 4 letters followed by 7 digits",
      (value) => {
        return /^[A-Z]{4}/.test(value); // Ensure it doesn't start with a number
      }
    )
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .length(11, "IFSC code must be exactly 11 characters")
    .required("IFSC code is required"),
});
