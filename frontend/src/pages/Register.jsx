import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/register.css';

function Register() {

  const navigate = useNavigate();   

  const gotologin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[A-Za-z ]+$/, 'Name must contain only letters')
        .required('Name is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .required('Phone number is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      username: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric')
        .min(4, 'Username must be at least 4 characters')
        .required('Username is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
onSubmit: async (values, { resetForm }) => {
  try {
    const response = await axios.post('http://localhost:8086/register', values);
    console.log('Registered:', response.data);
    toast.success('Registration successful!');
    navigate('/login');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.info("Username already exists");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  }
  resetForm();
},

  });
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="error">{formik.errors.phone}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error">{formik.errors.username}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" className='register-button'>Register</button>


       <div className="login-prompt">
       <p>Already have an account?</p>
       <button type="button" className='login-button' onClick={gotologin}>Sign In</button>
      </div>


      </form>
    </div>
  );
}

export default Register;
