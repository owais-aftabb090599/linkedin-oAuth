
const UserClickHandler = () => {
    window.location.href = "http://localhost:8000/auth/linkedin/user";
}


const Login = () => {
    return (
        <>
            <div className="container my-5">
                <h1 className="text-center">Login:</h1>
                <div className="text-center d-flex flex-column">
                    <a onClick={UserClickHandler} className="my-5" style={{ fontSize: '2rem', cursor: "pointer" }}>
                        LogIn With Linkedin As User {" "}
                        <i className="fa fa-linkedin"></i>
                    </a>
                </div>
                <hr className="my-5" />
                <form className="my-5" id="loginForm">
                    <div className="form-group">
                        <label htmlFor="email">Enter Your E-Mail:</label>
                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter Your E-Mail" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Enter Your Password:</label>
                        <input type="password" className="form-control" id="password" name="password"
                            placeholder="Enter Your Password" autoComplete="off" />
                    </div>
                    <button type="submit" className="btn btn-primary my-3">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login
