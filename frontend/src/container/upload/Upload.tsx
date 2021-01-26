import React, { useState } from 'react';
//import axios from 'axios';
import styled from 'styled-components';
import DropZone from './DropZone';

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

const DivLoginGroup = styled.div`
width: 100%;
  position: relative;
  border-bottom: 1px solid #b2b2b2;
  margin-bottom: 26px;
`;

const SpanLoginLabel = styled.span`
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
const InputLogin = styled.input`
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


//style end
const Upload = () => {
    let [tags, setTages] = useState<Array<string>>([]);
    
    return (
        <div>
            <DivWrapper>
                <DivContainer>
                    <DivBox>
                        <DivTitleContainer>
                            <h2 className="h3 mb-2 text-gray-800">업로드</h2>
                        </DivTitleContainer>
                        <FormLogin>
                        <DivLoginGroup>
                                <SpanLoginLabel>재목</SpanLoginLabel>
                                <InputLogin type="text" placeholder="" className="logininput" />
                            </DivLoginGroup>

                            <DivLoginGroup>
                                <SpanLoginLabel>태그</SpanLoginLabel>
                                <InputLogin type="text" placeholder="" className="logininput"/>
                            </DivLoginGroup>
                            <DivLoginGroup>
                                <DropZone />
                            </DivLoginGroup>
                            
                        </FormLogin>
                    </DivBox>
                </DivContainer>
            </DivWrapper>
        </div>
    )
}

export default Upload;