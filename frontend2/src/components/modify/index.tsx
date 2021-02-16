import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ModInfo from "./ModInfo";

type MatchParams = {
    assetSeq: string
}

const Modify = ({ match }: RouteComponentProps<MatchParams>) => {
    const { assetSeq } = match.params;
    return (
        <div>
                <ModInfo assetSeq={assetSeq} />
        </div>
    )
}

export default Modify;