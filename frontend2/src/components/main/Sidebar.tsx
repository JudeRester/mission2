import React from "react";
import {
    FormControl,
    InputLabel,
    Input,
    Button,
    TextField
} from "@material-ui/core";

const Sidebar = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin: 20,
                padding: 20
            }}
        >
            <form style={{ width: "50%" }}>
                <h1>검색</h1>

                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="name">제목</InputLabel>
                    <Input id="name" type="text" />
                </FormControl>

                <Button variant="contained" color="primary" size="medium">
                    검색
          </Button>
            </form>
        </div>
    );
}

export default Sidebar;