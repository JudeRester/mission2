import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Sidebar from "../commons/Sidebar"
import ModInfo from "./ModInfo";

type MatchParams = {
    assetSeq: string
}

const Modify = ({ match }: RouteComponentProps<MatchParams>) => {
    const { assetSeq } = match.params;
    return (
        <div>
            <Sidebar>
                <ModInfo assetSeq={assetSeq} />
            </Sidebar>
        </div>
    )
}

export default Modify;