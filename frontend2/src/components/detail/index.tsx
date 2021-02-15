import { RouteComponentProps } from "react-router-dom";
import Info from "./Info";


type MatchParams = {
    assetSeq: string
}

const Detail = ({ match }: RouteComponentProps<MatchParams>) => {

    const { assetSeq } = match.params;

    return (
        <>
            <Info assetSeq={assetSeq} />
        </>
    )
}

export default Detail;