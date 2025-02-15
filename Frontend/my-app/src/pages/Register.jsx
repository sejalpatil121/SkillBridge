import { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Example() {
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const navigate = useNavigate(); 
   async function handlesignin(e){
    e.preventDefault();
    try{
      const {data} = await axios.post("http://localhost:4000/register",{
        email,password
      })
      alert("Login successful");
      localStorage.setItem("token",data.token);
      navigate("/dashboard");
    }catch(error){
      alert(error.response.data.message)  
    }

  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img
            alt="Company Logo"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-10"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in</h2>
        </div>
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e)=>setemail(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password"  value={password} onChange={(e)=>setpassword(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <button className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500" onClick={handlesignin}>Sign in</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Not a member? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up</a>
        </p>
      </div>
    </div>
  );
}