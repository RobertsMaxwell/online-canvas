import { useEffect, useRef, useState } from "react";
import "../styles/Canvas.css"

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

import red from "../images/red.png";
import green from "../images/green.png";
import blue from "../images/blue.png";
import white from "../images/white.png";
import black from "../images/black.png";

import spinner from "../images/spinner.gif";

const firebaseConfig = {
  apiKey: "AIzaSyCbDBtKdClp4DMx5CazNhlWehout_VnsUg",
  authDomain: "canvas-445b1.firebaseapp.com",
  projectId: "canvas-445b1",
  storageBucket: "canvas-445b1.appspot.com",
  messagingSenderId: "1068124395400",
  appId: "1:1068124395400:web:8e03d7ddb46af0aed7cc3d"
};

function Canvas () {
    const [selected, setSelected] = useState(null)
    const [btnHover, setBtnHover] = useState(null)
    const [color, setColor] = useState("#FF0000")
    const [gridValues, setGridValues] = useState(null)
    const [lastPlace, setLastPlace] = useState(0)
    const [currentTime, setCurrentTime] = useState(Date.now())
    const [loading, setLoading] = useState(false)

    const colors = [{img: red, value: "#FF0000"}, {img: green, value: "#00FF00"}, {img: blue, value: "#0000FF"}, {img: white, value: "#FFFFFF"}, {img: black, value: "#000000"}]
    const canv = useRef()
    const grid = 30;
    const cooldownMS = 2000;

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getDatabase(app)

    const draw = (data, background=false) => {
        const ctx = canv.current.getContext("2d")
        ctx.fillStyle = data.color;

        if (background) {
            ctx.fillRect(0, 0, 600, 600)
            return
        }

        ctx.fillRect(data.x * (600 / grid), data.y * (600 / grid), (600 / grid), (600 / grid))
    }

    useEffect(() => {
        if (gridValues === null) {
            setLoading(true)
            return
        }

        setLoading(false)

        draw({color: "#FFFFFF"}, true)

        for (const val in gridValues) {
            draw(gridValues[val])
        }

        if (selected !== null) {
            const ctx = canv.current.getContext('2d')
            ctx.strokeStyle = "#000000"
            ctx.beginPath()
            ctx.rect(selected.x * (600 / grid), selected.y * (600 / grid), (600 / grid), (600 / grid))
            ctx.stroke()
            ctx.closePath()
        }

    }, [gridValues, selected])

    useEffect(() => {
        signInAnonymously(auth)
        .then(() => {
            const canvDbRef = ref(db, "canvas")
            onValue(canvDbRef, s => {
                setGridValues(s.val())
            })

            const cooldownDbRef = ref(db, "cooldowns/" + auth.currentUser.uid)
            onValue(cooldownDbRef, s => {
                try {
                    setLastPlace(s.val().time)
                } catch (e) {
                    console.log("new User")
                }
            })
        })
        .catch(e => {
            console.log("Failed to authenticate")
        })

        const timer = setInterval(() => {
            setCurrentTime(Date.now())
        }, 100)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <div className="canvas">
            <h1>Place a Pixel</h1>
            <p>{`${selected === null ? "Select a coordinate on the canvas" : `Selected coordinate: (${selected.x}, ${selected.y})`}`}</p>

            {loading ? <div className="spinner"><img src={spinner} alt="spinner" /></div> : <></>}
            <div className={`colors ${loading ? "hidden" : ""}`}>
                {colors.map((ele, i) => <div key={i}><input className={`${color === ele.value ? "color_selected" : ""}`} onClick={() => {setColor(ele.value)}} type="image" src={ele.img} alt="color" /></div>)}
            </div>
            <canvas ref={canv} className={`${loading ? "hidden" : ""}`} id="canvas" width="600" height="600" onClick={e => {
                const rect = canv.current.getBoundingClientRect()
                const units = rect.width / grid;
                const x = Math.floor((e.clientX - rect.left) / units)
                const y = Math.floor((e.clientY - rect.top) / units)

                setSelected({x: x, y: y})
            }} />

            <button disabled={selected === null || currentTime - lastPlace < cooldownMS} onClick={() => {
                const canvDbRef = ref(db, "canvas/" + selected.x + "," + selected.y)
                set(canvDbRef, {x: selected.x, y: selected.y, color: color})

                const cooldownDbRef = ref(db, "cooldowns/" + auth.currentUser.uid)
                set(cooldownDbRef, {time: new Date().getTime()})

                setSelected(null)
            }} onMouseEnter={() => {setBtnHover(true)}} onMouseLeave={() => {setBtnHover(false)}} className={`${btnHover === null ? "" : btnHover ? "hover" : "unhover"}`}><b>{currentTime - lastPlace < cooldownMS ? `00:${String(Math.floor((cooldownMS - (currentTime - lastPlace)) / 1000)).padStart(2, "0")}` : "Place"}</b></button>
        </div>
    );
}

export default Canvas;