import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import DropZone from './DropZone';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import { remove, reset } from '../../modules/fileList';

//style 

let DivWrapper = styled.div`
width:100%;
margin: 0 auto;
padding: 0px;
justify-content: center;
align-items: center;
box-sizing: border-box;
`;

let DivContainer = styled.div`
width: 100%;
min-height: 100vh;
display:block;
//flex-wrap: wrap;
margin-right: auto;
margin-left: auto;
padding-left: 15px;
padding-right: 15px;
padding-top: 15px;
// justify-content: center;
// align-items: center;
// padding: 15px;
background: #ebeeef;
`;

let DivTitleContainer = styled.div`
// width:100%;
display:flex;
margin-bottom: 20px;
border-bottom: 1px solid #eaeaea;
`;

let DivBox = styled.div`
max-width: 80%;
// min-width: 670px;
margin: auto;
background: #fff;
// padding:10px;
// overflow: hidden;
position: relative;
padding: 20px;
border-radius: 3px;
box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px;
`;

const DivInputGroup = styled.div`
width: 100%;
  position: relative;
  border-bottom: 1px solid #b2b2b2;
  margin-bottom: 26px;
`;

const DivTagGroup = styled.div`
width:100%;
position:relative;
margin-bottom:26px;
display:block;
`;

const SpanInputLabel = styled.span`
font-family: Poppins-Regular;
  font-size: 15px;
  color: #808080;
  line-height: 1.2;
  text-align: right;
  position: absolute;
  top: 14px;
  left: -105px;
  width: 80px;
`;
const InputText = styled.input`
font-family: Poppins-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;
  height: 45px;
  display: block;
  width: 100%;
  background: transparent;
  padding: 0 5px;
  outline:none;
  border:none;
`;
const FormLogin = styled.form`
width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 43px 88px 93px 150px;
`;

const SpanTag = styled.span`
display:inline-block;
background:#4abdff;
margin-right:5px;
margin-top:2px;
margin-bottom:2px;
padding:5px 7px 5px 7px;
border-radius:4px;
color:#fff;
`;

const SpanTimes = styled.span`
margin: 3px;
margin-left 5px;
font-weight: bolder;
color:#fff;
&:hover{
    cursor:pointer;
    color:#cccccc;
}
&:active{
    color:#7a7a7a;
}
`;

//style end
const Upload = () => {
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionUser).token;
    }
    let [title, setTitle] = useState<string>();
    let [currentInputTag, setCurrentInputTag] = useState<string>('');
    let [tags, setTags] = useState<Array<string>>([]);
    let [filesState, setFilesState] = useState<Array<File>>([]);
    let [assetSeq, setAssetSeq] = useState<number>(0);

    const dispatch = useDispatch();
    const fileList = useSelector((state: RootState) => state.fileList)


    // useEffect(() => {
    //     if (assetSeq!=0) {
    //         fileUpload();
    //     }

    // }, [assetSeq, files]);

    const fileUpload = () => {
        if (filesState.length!==0) {
            const formData = new FormData();
            formData.append("file", fileList[0]);
            formData.append("assetSeq", '' + assetSeq);
            axios.post(`/api/file`,
                formData,
                {
                    // 토스트 위치
                    // onUploadProgress: (ProgressEvent) => {
                    // }
                }
            ).then(() => {
                dispatch(remove(0))
                if(fileList.length===0){
                    fileUploadComplete(assetSeq).then(()=>{
                        setAssetSeq(0);
                        dispatch(reset)
                    })
                }
            })
        }else{
            console.log('파일이 없어요!')
        }
    }
    const fileUploadComplete = (seq:number) =>{
        return axios.post(`/api/complete`,
        {assetSeq: seq, tags: tags},
        {
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }
    // const files = (state:Array<File>, action: any) => {
    //     if (action.type === "UPDATE") {
    //         return action.payload;
    //     }
    //     if (action.type === "RESET") {
    //         return [];
    //     }
    //     return [...state];
    // }
    // let fileStore = createStore(files);
    const submitFiles = async (e: FormEvent) => {
        e.preventDefault();
        if (fileList.length != 0) {
            let data = { assetTitle: title }
            try {
                const response = await axios.post(`/api/asset`,
                    data,
                    {
                        headers: {
                            'Content-type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                setAssetSeq(response.data.result.assetSeq);
                console.log(response.data.result)
                fileUpload();
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            let inputTag = currentInputTag.trim();
            if (inputTag != "") {
                if (tags.filter(tag => tag == inputTag).length <= 0) {
                    let tmp: Array<string> = [...tags].concat(currentInputTag);
                    setTags(tmp);
                }
            }
            setCurrentInputTag('');
        }
    }

    const removeTag = (targetTag: string) => {
        const targetTagIndex = tags.findIndex(e => e === targetTag);
        tags.splice(targetTagIndex, 1);
        setTags([...tags]);
    }

    return (
        <DivWrapper>
            <DivContainer>
                <DivBox>
                    <DivTitleContainer>
                        <h2 className="h3 mb-2 text-gray-800">업로드</h2>
                    </DivTitleContainer>
                    <FormLogin 
                    // onSubmit={submitFiles}
                    >
                        <DivInputGroup>
                            <SpanInputLabel>재목</SpanInputLabel>
                            <InputText type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="logininput" />
                        </DivInputGroup>
                        <DivInputGroup>
                            <SpanInputLabel>태그</SpanInputLabel>
                            <InputText type="text" value={currentInputTag} onChange={(e) => { setCurrentInputTag(e.target.value) }} onKeyPress={(e) => { addTag(e) }} placeholder="태그 입력 후 엔터" />
                        </DivInputGroup>
                        <DivTagGroup>

                            {tags.map((data, i) =>
                                <SpanTag key={i}>{data}<SpanTimes onClick={() => { removeTag(data) }}>×</SpanTimes></SpanTag>
                            )}
                        </DivTagGroup>
                        <DivInputGroup>
                            <DropZone filesState={filesState} setFilesState={setFilesState}/>
                        </DivInputGroup>
                        <DivTagGroup>
                            <button onClick={submitFiles}>저장</button>
                            <button>취소</button>
                        </DivTagGroup>

                    </FormLogin>
                </DivBox>
            </DivContainer>
        </DivWrapper>
    )
}

export default Upload;