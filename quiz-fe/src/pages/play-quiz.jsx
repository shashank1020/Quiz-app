import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {evaluateQuiz, getByPermalink} from "../service/api";
import {errorToast} from "../lib/common";
import styled from 'styled-components';
import {toast} from "react-toastify";

const PlayQuizPage = () => {
    const {permalink} = useParams();
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState([])
    const [result, setResult] = useState({})
    useEffect(() => {
        if (permalink)
            getByPermalink({permalink})
                .then(data => {
                    setTitle(data.title);
                    setQuestions(data.questions)
                })
                .catch(e => errorToast(e))
    }, [permalink])

    const updateChosenOption = (questionIndex, value, add) => {
        const newQuestion = questions.map((ques, index) => {
            if (questionIndex === index) {
                const changedQues = ques
                if (changedQues.type === 'single') {
                    if (add)
                        changedQues.chosenOptions = [value]
                    else changedQues.chosenOptions = []
                } else {
                    if (add)
                        if (Array.isArray(changedQues.chosenOptions) && changedQues.chosenOptions.length > 0)
                            changedQues.chosenOptions.push(value)
                        else changedQues.chosenOptions = [value]
                    else {
                        if (Array.isArray(changedQues.chosenOptions)) {
                            const indexOfValue = changedQues.chosenOptions.indexOf(value)
                            changedQues.chosenOptions.splice(indexOfValue, 1)
                        } else changedQues.chosenOptions = []
                    }
                }
                return changedQues
            }
            return ques
        })
        setQuestions(newQuestion)
    }

    const handleSubmit = () => {
        if (permalink)
            evaluateQuiz({permalink, questions}).then(data => {
                setResult(data)
                toast.info(data.msg)
            }).catch(e => errorToast(e))
    }

    if (result !== {})
        return (
            <Wrapper>
                <div className="center">
                    <Alert severity="info">Thanks for Playing the Quiz. Below is your report</Alert>
                    <List className='list-wrapper' component="nav" aria-label="mailbox folders">
                        <ListItem span>
                            <ListItemText primary="Total Questions: 100"></ListItemText>
                        </ListItem>
                        <Divider/>
                        <ListItem span divider>
                            <ListItemText primary="Drafts"/>
                        </ListItem>
                        <ListItem span>
                            <ListItemText primary="Trash"/>
                        </ListItem>
                        <Divider light/>
                        <ListItem span>
                            <ListItemText primary="Spam"/>
                        </ListItem>
                    </List>
                </div>
            </Wrapper>
        );
    return (
        <Wrapper>
            {title && questions.length > 0 && <Box className='center'>
                <div className='center'>
                    <Typography variant='h3'>{title}</Typography>
                </div>
                {questions.map((ques, index) => {
                    return (
                        <Card className='card'>
                            <CardContent>
                                <div className='flex end'>
                                    <Typography>Q{index + 1}. {ques.title}</Typography>
                                    <Typography variant='caption'><Chip
                                        label={ques.type === "single" ? "Single Correct Option" : "Multiple Correct Option"}/></Typography>
                                </div>

                                {ques.options.map(option => (
                                    <div className='flex'>
                                        <Checkbox checked={ques?.chosenOptions?.includes(option) || false}
                                                  onChange={(e) => updateChosenOption(index, option, e.target.checked)}/>
                                        <Typography>{option}</Typography>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )
                })}
                <div className='submit-button'>
                    <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                </div>
            </Box>}
        </Wrapper>
    )
}

export default PlayQuizPage;

const Wrapper = styled.div`

  .card {
    margin: 1rem;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .end {
    justify-content: space-between;
  }

  .center {
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }

  .submit-button {
    display: flex;
    justify-content: space-around;
    padding-right: 30px;
    margin-bottom: 30px;

    button {
      width: 300px;
    }
  }
  .list-wrapper {
    max-width: 360px;
    width: 100%;
  }
`