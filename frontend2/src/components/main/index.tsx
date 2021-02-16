import Posts from "./Posts"
import Sidebar from "../commons/Sidebar"
import { RouteComponentProps } from "react-router-dom"

type MatchParams = {
    pageNum: string
}

const Main = ({ match }: RouteComponentProps<MatchParams>) => {
    const {pageNum} = match.params
    return (
        <div>
                <Posts pageNum={pageNum}/>
        </div>
    )
}

export default Main;