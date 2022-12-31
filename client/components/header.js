import Link from "next/link";

const Header = ({ currentUser }) => {
    
    
    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{backgroundColor: '#6715a6'}}>
            <div className="container-fluid">
            <a className="navbar-brand" href="/" style={{color: 'white'}}>TicketHub</a>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                {currentUser ? (
                    <ul className="navbar-nav">
                        <a className="nav-link" href="/" style={{color: 'white'}}>Welcome {currentUser.email}</a>
                        <a className="nav-link" href="/auth/signout" style={{color: 'white'}}>Signout</a>
                    </ul>
                ) : (
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/auth/signin" style={{color: 'white'}}>Signin</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/auth/signup" style={{color: 'white'}}>Signup</a>
                        </li>
                    </ul>
                )}
            </div>
            </div>
        </nav>
    )
}

export default Header