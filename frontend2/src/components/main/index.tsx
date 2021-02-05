import Posts from "./Posts"
import Sidebar from "./Sidebar"

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