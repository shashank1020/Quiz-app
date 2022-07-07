import {useContext, useEffect, useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import styled from "styled-components";
import QuestionAddEditCard from "../component/QuestionAddEditCard";

import {useLocation, useNavigate, useParams} from "react-router-dom";
import {createQuiz, getByPermalink, getByUserPermalink, updateQuiz} from "../service/api";
import {errorToast} from "../lib/common";
import QuestionViewCard from "../component/QuestionViewCard";
import {UserAuthContext} from "../lib/user-auth-context";
import {toast} from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

const initQuestion = {
    type: 'single',
    title: '',
    options: [],
    correctOptions: []
}

const CreateQuizPage = () => {
    const {permalink} = useParams();
    const location = useLocation()
    const [title, setTitle] = useState()
    const [questions, setQuestions] = useState([])
    const [edit, setEdit] = useState({})
    const [isPublished, setIsPublished] = useState(false)
    const [add, setAdd] = useState(false)
    const {user} = useContext(UserAuthContext)
    const navigate = useNavigate()

    const onQuestionUpdate = (newQues) => {
        setQuestions([newQues, ...questions])
        setAdd(false)
        setEdit({})
    }
    const deleteQuestion = (index) => {
        questions.splice(index, 1)
        setQuestions([...questions])
    }

    const handleSaveQuiz = (published = false) => {
        if (location.pathname.includes('create')) {
            createQuiz({title, questions, published}, user.token)
                .then(() => {
                    toast.success('Quiz Created')
                    navigate('/')
                })
                .catch(e => errorToast(e))
        } else {
            console.log('clicked')
            updateQuiz(permalink, {title, questions, published}, user.token).then((data) =>{
                console.log('data came')
                toast.success('Quiz updated')
                setTitle(data.title)
                setQuestions(data.questions)
                setIsPublished(data.published)
            }).catch(e=>errorToast(e))
        }
    }

    useEffect(() => {
        if (permalink && !user)
            getByPermalink({permalink})
                .then(quiz => {
                    setTitle(quiz.title);
                    setQuestions(quiz.questions)
                    setIsPublished(quiz.published)
                }).catch(e => errorToast(e))
        if (permalink && user)
            getByUserPermalink({permalink}, user.token)
                .then(quiz => {
                    setTitle(quiz.title);
                    setQuestions(quiz.questions)
                    setIsPublished(quiz.published)
                }).catch(e => errorToast(e))
        if (location.pathname.includes('create')) {
            setQuestions([])
            setTitle('')
            setIsPublished(false)
        }
    }, [permalink, location.pathname])

    return (
        <Wrapper>
            <div className="center">
                <Typography variant='h5' component='div'>{!permalink ? 'Create Quiz' : 'Edit my Quiz'}</Typography>
            </div>
            <div className="title">
                <Typography variant='h6' component={'div'} className='title-label'>Quiz Title</Typography>
                <TextField className='input-field' id="outlined-basic" variant="outlined" value={title} disabled={isPublished}
                           onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='add-button'>
                {!isPublished && questions.length <= 10 &&
                    <Button variant='contained' className='start' onClick={() => setAdd(true)}><AddIcon/></Button>}
                <div className='end'>
                    {!isPublished && <Button onClick={()=>handleSaveQuiz()} variant='text'>Save</Button>}
                    {!isPublished && <Button onClick={() => handleSaveQuiz(true)} variant='text'>Publish</Button>}
                </div>

            </div>
            {add && <QuestionAddEditCard correctOptions={initQuestion.correctOptions} type={initQuestion.type}
                                         title={initQuestion.title} options={initQuestion.options}
                                         onQuestionUpdate={onQuestionUpdate} setAdd={setAdd}/>}
            {questions.map((ques, index) => !edit[index] ? <QuestionViewCard deleteQuestion={deleteQuestion}
                                                                             question={ques} index={index}
                                                                             isPublished={isPublished}
                                                                             setEdit={setEdit}/> :
                <QuestionAddEditCard correctOptions={ques.correctOptions} type={ques.type} title={ques.title}
                                     options={ques.options} onQuestionUpdate={onQuestionUpdate} setEdit={setEdit}/>
            )}

        </Wrapper>
    )
}

export default CreateQuizPage;

const Wrapper = styled(Box)`
  padding: 30px;
  
  button {
    margin: 2px;
  }
  .gap {
    margin: 10px;
  }

  .center {
    display: flex;
    justify-content: center;
  }

  .title {
    margin-top: 30px;
    margin-left: 30px;
    display: flex;
    align-items: center;
  }

  .title-label {
    margin-right: 30px;
  }
  .input-field {
    width: 80%;
  }
  .add-button {
    margin-top: 50px;
    display: flex;
  }

  .rendered-card {
    display: flex;
    justify-content: space-between;
  }
  .end {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }
`

