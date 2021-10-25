import { ButtonBase, Card, FormControlLabel, IconButton, Input, Radio, RadioGroup, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Button from 'reactstrap/lib/Button';
import patientData from "../resources/input.json";
// import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

export default function Feedbackform(props) {
    const [data, setData] = useState({ response: "" });

    const [formDetails, setFormDetails] = useState(
        {
            name: patientData.entry[0].resource.name[0].text,
            patientId: patientData.entry[0].resource.id,
            recommendation: null,
            managediagonsis: "",
            feedback: ""
        });
    console.log(patientData.id);

    const handleRecommendationChange = (e) => {
        setFormDetails({ ...formDetails, recommendation: e.target.value });
    }

    const handleDiagnosisChange = (e) => {
        setFormDetails({ ...formDetails, managediagonsis: e.target.value });
    }

    const handleFeedBackFieldChange = (e) => {
        setFormDetails({ ...formDetails, feedback: e.target.value });
    }

    const handleConfirm = (e) => {
        const mesg = document.getElementById("mesg");
        mesg.style.display = "block";
        const confirm = document.getElementById("confirm");
        confirm.style.display = "none";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const route = `http://localhost:8080/api/v1/patientfeedback/add`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formDetails),
        };
        const response = await fetch(route, requestOptions);
        const result = await response.json();
        setData({ response: result.response });
        // console.log(data.response);
    }
    useEffect(() => {
        if (data.response) {
            const result = document.getElementById("result");
            result.style.display = "block";
        }
    }, [data.response]);

    return (
        <div className="feedback-form">
            <h2 className="question">Patient Feedback</h2>
            {data.response &&
                <Card style={{ padding: "32px", color: "green", backgroundColor: "#d4f1d4" }}>
                    <div id="result" className="hide">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" color="green" /><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>
                        <strong style={{ marginLeft: "8px" }}>
                            {data.response}
                        </strong>
                    </div>
                </Card>
            }
            {data.response == "" &&
                <Card>
                    <form onSubmit={handleSubmit}>
                        <div className="col question" >
                            <strong>
                                Hi {patientData.entry[0].resource.name[0].text}, on a scale of 1-10, would you recommend Dr {patientData.entry[1].resource.name[0].family} to a friend or family member? 1 = Would not recommend, 10 = Would strongly recommend
                            </strong>
                            <div>
                                <TextField
                                    required={true}
                                    type="number"
                                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                                    value={formDetails.recommendation ? formDetails.recommendation : 0}
                                    onChange={handleRecommendationChange}
                                />
                            </div>
                        </div>
                        {formDetails.recommendation &&
                            <div className="col question">
                                <strong>
                                    Thank you. You were diagnosed with {patientData.entry[3].resource.code.coding[0].name}. Did Dr {patientData.entry[1].resource.name[0].family} explain how to manage this diagnosis in a way you could understand?
                                </strong>
                                <div>
                                    <RadioGroup
                                        value={formDetails.managediagonsis}
                                        onChange={handleDiagnosisChange}
                                    >
                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </div>
                            </div>

                        }
                        {
                            formDetails.managediagonsis != "" &&
                            <div className="col question">
                                <strong>
                                    We appreciate the feedback, one last question: how do you feel about being diagnosed with {patientData.entry[3].resource.code.coding[0].name}?
                                </strong>
                                <div>
                                    <TextField
                                        value={formDetails.feedback}
                                        onChange={handleFeedBackFieldChange}
                                    />
                                </div>
                                <div className="col" style={{ marginTop: '16px', marginLeft: 'auto' }}>
                                    <Button id="confirm" variant="contained" color="primary" onClick={handleConfirm}>Confirm</Button>
                                </div>
                            </div>
                        }
                        {
                            formDetails.feedback != "" &&
                            <div id="mesg" className="col hide question">
                                <strong>
                                    Thanks again! Here’s what we heard:
                                </strong>
                                <br />
                                Recommendation : {formDetails.recommendation}
                                <br />
                                Managed Diagnosis : {formDetails.managediagonsis}
                                <br />
                                Feedback : {formDetails.feedback}
                                <div>
                                </div>
                                <div className="col" style={{ marginTop: '16px', marginLeft: 'auto' }}>
                                    <Button variant="contained" color="primary" type="submit">Submit</Button>
                                </div>
                            </div>

                        }


                    </form>
                </Card>
            }
        </div>

    )
}
