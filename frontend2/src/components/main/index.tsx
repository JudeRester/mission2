import Posts from "./Posts"
import Sidebar from "../commons/Sidebar"

const Main = () => {
    return (
        <div>
            <Sidebar>
                <Posts />
            </Sidebar>
        </div>
    )
}

export default Main;