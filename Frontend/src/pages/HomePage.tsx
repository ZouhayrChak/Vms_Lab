// src/pages/Home.tsx
import React, { useState } from 'react';
import '../styles/Home.css'
import { toast } from 'sonner';
import { loginReq } from '../services/authApi';

const Home: React.FC = () => {

    const [login, setLogin] = useState({
        email: '',
        password: '',
    });


const handleLoginFieldsChange = (e:any) => {
    const {id,value} = e.target;
    setLogin(prev => (
        {
        ...prev,
        [id] : value, 
        }
    )
)
}
 
const handleLoginSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    
    try{  
        const response = await loginReq(login);
        window.localStorage.setItem("role",response.role);
        window.localStorage.setItem("token",response.token);
        window.location.href ="/p/".concat(response.token);
    }
    catch(error:any){
        toast.warning(error.message);
    }
    
    
    
}


  return (
    <div className='container'>
        <div id='home-container'>
                <h1>Login</h1>
                <form onSubmit={handleLoginSubmit}>
                    <div>
                        <input className="form-item" id="email" type="email" placeholder='test@example.com' name='email' required value={login.email} onChange={handleLoginFieldsChange}
                        />
                    </div>
                    <div>
                        <input className="form-item" id="password" type="password" name="password" required value={login.password} onChange={handleLoginFieldsChange} placeholder='password' />
                    </div>
                    <div>            
                        <button className="form-item">Login</button>
                    </div>

                </form>
                

        </div>
    </div>
    
  );

};

export default Home;