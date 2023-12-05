

const InvestorClickHandler = () => {
    window.location.href = "http://localhost:8000/auth/linkedin/investor";
}

const Signup = () => {
    return (
        <>
            <div className="container my-5">
                <h1 className="text-center">Sign Up</h1>
                <div className="text-center">
                    <a onClick={InvestorClickHandler} className="my-5" style={{ fontSize: '2rem', cursor: "pointer" }}>
                        LogIn With Linkedin As Investor {" "}
                        <i className="fa fa-linkedin"></i>
                    </a>
                </div>
                <hr className="my-5" />
                <form className="my-5" id="registerForm">
                    <div className="form-group">
                        <label htmlFor="name">Enter Your Name:</label>
                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter Your Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Enter Your E-Mail:</label>
                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter Your E-Mail" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Enter Your Password:</label>
                        <input type="password" className="form-control" id="password" name="password"
                            placeholder="Enter Your Password" autoComplete="off" />
                    </div>
                    <button type="submit" className="btn btn-success my-3">Register</button>
                </form>
            </div>
        </>
    )
}

export default Signup
