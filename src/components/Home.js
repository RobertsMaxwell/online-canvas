import "../styles/Home.css"
import { useNavigate} from "react-router-dom";

function Home () {
    const navigate = useNavigate()

    return (
        <div className="home">
            <h1>Welcome to an online<br/><i>collaborative</i> canvas<div className="divider"></div></h1>
            <p>Everyone shares the same 30 by 30 canvas, anyone can place a pixel.<br/></p>
            <button onClick={() => {navigate("/canvas")}}><b>Place a Pixel</b></button>
        </div>
    );
}

export default Home;