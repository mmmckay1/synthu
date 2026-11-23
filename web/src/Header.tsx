import { Link, NavLink } from "react-router";

export function Header (){
    return <header>
        <Link to="/">
        <span className="site-title">SynthU</span>
        </Link>
        <nav>
            <NavLink to="/" end>SynthDude</NavLink>
            <NavLink to="/courses">Learn</NavLink>
            <NavLink to="/about">About</NavLink>
        </nav>
    </header>
}