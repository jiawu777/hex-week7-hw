import axios from 'axios';
import '../../assets/styles.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import validation from '../../utils/validation';
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../../slice/messageSlice';

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;

//上傳要改
const Login = () => {
const {register,handleSubmit,formState:{isValid,errors}} = useForm({
  mode:"onBlur",
  defaultValues:{
    username:'',
    password:''
  }
})

const navigate= useNavigate();
const dispatch = useDispatch;
const onSubmit = async (formData) => {

  try {
    const res = await axios.post(`${API_BASE}/admin/signin`,formData);
    const {token,expired}=res.data;  
    //把token寫入cookie
    document.cookie=`hexToken=${token};expires=${new Date(expired)};`;


    // 修改實體建立時所指派的預設配置
    axios.defaults.headers.common['Authorization'] = token;

    navigate("/admin/products");
  } catch (error) {
    dispatch(createAsyncMessage(error.response.data));
  }
} 





  return (
   <div className="container login">
      <h1>請先登入</h1>
      <form action="submit" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input id="username" type="email" className="form-control" name="username" placeholder="name@example.com"
             {...register("username",validation.email)} />
                <label htmlFor="username">Username</label>
                <p className="text-danger">{errors.email?.message}</p>
                </div>
                <div className="form-floating">
            <input id="password" type="password" className="form-control" name="password" placeholder="Password"  
            {...register("password",validation.password)} />
                <label htmlFor="password">Password</label>
                <p className="text-danger">{errors.password?.message}</p>
          </div>
            <button type="submit" className="btn btn-primary w-100 mt-3" disabled={!isValid} >登入</button>
      </form>
  </div>
  );
};

export default Login;