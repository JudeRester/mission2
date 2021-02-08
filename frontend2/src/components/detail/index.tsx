import { RouteComponentProps } from "react-router-dom";
import Sidebar from "../commons/Sidebar";
import Info from "./Info";


type MatchParams = {
    assetSeq:string
}

const Detail = ({match}:RouteComponentProps<MatchParams>) => {

    const {assetSeq} = match.params;
    
    return (
        <>
            <Sidebar>
                <Info/>
            </Sidebar>
        </>
    )
}

export default Detail;