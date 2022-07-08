import {useContext, useEffect, useState} from "react";
import {Alert, Box, Button, TextField, Typography} from "@mui/material";
import styled from "styled-components";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {createQuiz, getByPermalink, updateQuiz} from "../service/api";
import {errorToast, quizQuestionsValidator, trim} from "../lib/common";
import {UserAuthContext} from "../lib/user-auth-context";
import {toast} from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import {isNumber} from 'lodash';
import BriefQuestionVewCard from "../component/brief-question-vew-card";
import QuestionAddEditCard from "../component/question-add-edit-card";

const CreateQuizPage = () => {
    const {permalink} = useParams();
    const location = useLocation()
    const [title, setTitle] = useState()
    const [questions, setQuestions] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [isPublished, setIsPublished] = useState(false)
    const [add, setAdd] = useState(false)
    const {user} = useContext(UserAuthContext)
    const navigate = useNavigate()
    const onQuestionUpdate = (newQues) => {
        if (isNumber(editIndex)) {
            questions[editIndex] = newQues
            setQuestions(questions)
        } else setQuestions([newQues, ...questions])
        setAdd(false)
        setEditIndex(null)
    }
    const deleteQuestion = (index) => {
        questions.splice(index, 1)
        setQuestions([...questions])
    }
    const handleSaveQuiz = (published = false) => {
        if (title === ' ')
            toast.warning('Quiz title cannot be empty')
        else if (quizQuestionsValidator(questions))
            if (location.pathname.includes('create')) {
                createQuiz({title, questions, published}, user.token)
                    .then(() => {
                        toast.success('Quiz Created')
                        navigate('/')
                    })
                    .catch(e => errorToast(e))
            } else {
                if (permalink)
                    updateQuiz(permalink, {title, questions, published}, user.token).then((data) => {
                        toast.success('Quiz updated')
                        setTitle(data.title)
                        setQuestions(data.questions)
                        setIsPublished(data.published)
                    }).catch(e => errorToast(e))
            }
    }

    useEffect(() => {
        if (permalink)
            getByPermalink({permalink}, user.token)
                .then(quiz => {
                    setTitle(quiz.title);
                    setQuestions(quiz.questions)
                    setIsPublished(quiz.published)
                }).catch(e => errorToast(e))
        else {
            setQuestions([])
            setTitle('')
            setIsPublished(false)
        }
    }, [permalink, location.pathname])

    if (!user) {
        navigate('/')
    }
    return (
        <Wrapper>
            {isPublished && <Alert severity="info" sx={{mb: 2}}>Quiz is Published</Alert>}
            <div className="center">
                <Typography variant='h5'
                            component='div'>{!permalink ? 'Create Quiz' : isPublished ? 'Preview Quiz' : 'Edit my Quiz'}</Typography>
            </div>
            <div className="title">
                <Typography variant='h6' component={'div'} className='title-label'>Quiz Title</Typography>
                <TextField className='input-field' id="outlined-basic" variant="outlined" value={title}
                           disabled={isPublished}
                           placeholder='E.g: This is Quiz Title'
                           onChange={(e) => setTitle(trim(e.target.value))}/>
            </div>
            <div className='add-button'>
                {!isPublished && questions.length <= 10 &&
                    <Button variant='contained' className='start' onClick={() => setAdd(true)}><AddIcon/></Button>}
                <div className='end'>
                    {!isPublished && questions.length > 0 &&
                        <Button onClick={() => handleSaveQuiz()} variant='text'>Save</Button>}
                    {!isPublished && questions.length > 0 &&
                        <Button onClick={() => handleSaveQuiz(true)} variant='text'>Publish</Button>}
                </div>

            </div>
            {add && <QuestionAddEditCard correctOptions={[]} type={'single'}
                                         title={''} options={[]}
                                         onQuestionUpdate={onQuestionUpdate} setAdd={setAdd}/>}
            {questions.map((ques, index) => (editIndex !== index ? <BriefQuestionVewCard deleteQuestion={deleteQuestion}
                                                                                         question={ques} index={index}
                                                                                         isPublished={isPublished}
                                                                                         setEdit={setEditIndex}/> :
                    <QuestionAddEditCard correctOptions={ques.correctOptions} type={ques.type} title={ques.title}
                                         options={ques.options} onQuestionUpdate={onQuestionUpdate}
                                         setEdit={setEditIndex}/>
            ))}
        </Wrapper>
    )
}

export default CreateQuizPage;

const Wrapper = styled(Box)`
  padding: 30px;

  button {
    margin: 2px;
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

