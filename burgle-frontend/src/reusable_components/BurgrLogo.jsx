import { useNavigate } from "react-router-dom"

export default function BurgrLogo() {
    const navigate = useNavigate();


    return <h1 id="burgerLogo"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}> Burgl! </h1>
}