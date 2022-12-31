import { useState } from "react";
import Link from "next/link";
import useRequest from "../../hooks/use-request";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: {
          email,
          password,
        },
        onSuccess: () => Router.push("/"),
      });
    

    const onSubmit = async(e) => {
        e.preventDefault();
        
        await doRequest()
    }


    return(
        <div style={{backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe_sXx7aiSMXPaq2YlEpBfkBiw4IM5qPeV7Q&usqp=CAU)`, width: '100vw', height: '100vh', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', display: 'flex' }}>
            <div className="card" style={{width: '30vw', height: '60vh', marginLeft: '10vw', alignSelf: 'center'}}>
                <div className="card-body" style={{display: 'flex'}}>
                    <div style={{alignSelf: 'center', margin: 'auto'}}>
                        <h2 className="card-title">Sign in</h2>
                        <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <Link href="/auth/signup">Do not have an account? Register!</Link>
                        </div>
                        {errors}
                        <button type="submit" className="btn btn-primary">Signin</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Signin