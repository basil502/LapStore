import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios  from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();

  const gotoRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('UserName is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post('http://localhost:8086/login', {
          username: values.username,
          password: values.password,
        });

        console.log('Login successful:', response.data);
        toast.success('Login successful!');
        navigate('/home'); 
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.warn('Invalid username or password');
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
      resetForm();
    },
  });

  return (

    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Username"
          />
        </div>
        {formik.touched.username && formik.errors.username && (
          <div className="error">{formik.errors.username}</div>
        )}

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Password"
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}

        <button type="submit" className='login-button'>Submit</button>
       <div className="register-prompt">
      <p>Don't have an account?</p>
      <button type="button" className='register-button' onClick={gotoRegister}>Sign Up</button>
      </div>

      </form>
    </div>
  );
}

export default Login;
