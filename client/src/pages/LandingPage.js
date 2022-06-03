import React, { useContext } from "react"
import "./styles/LandingPage.css"
import { Hero } from "../components"
import Dashboard from "../components/Dashboard/Dashboard"
import { AuthContext } from "../context/authContext"

const LandingPage = ({ setDashSearchResults }) => {
    const { user } = useContext(AuthContext)
    console.log(user)
    return (
        <>
            {user ? (
                <>
                    <Dashboard setDashSearchResults={setDashSearchResults} />
                </>
            ) : (
                <div className="landing-page-wrapper">
                    <Hero />
                </div>
            )}
        </>
    )
}

export default LandingPage
