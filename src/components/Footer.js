import "../styles/Footer.css"
import github from "../images/github-mark.png"

function Footer () {
    return (
        <div className="footer">
            <p>Maxwell Roberts</p>
            <a href="https://github.com/RobertsMaxwell" target="_blank" rel="noreferrer">
                <img src={github} alt="github" />
            </a>
        </div>
    );
}

export default Footer;