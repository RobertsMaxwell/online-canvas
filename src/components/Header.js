import "../styles/Header.css"
import { useNavigate } from "react-router-dom";

function Header (props) {
    const navigate = useNavigate();

    return (
        <div className="header">
            <div onClick={() => {navigate("/")}} className={`${props.location.pathname === "/" ? "selected" : ""}`}>
                Home
            </div>
            <div onClick={() => {navigate("/canvas")}}className={`${props.location.pathname === "/canvas" ? "selected" : ""}`}>
                Canvas
            </div>
        </div>
    );
}

export default Header;