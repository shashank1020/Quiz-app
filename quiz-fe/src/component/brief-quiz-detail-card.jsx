import {Box, Button, CardActions, CardContent, Tooltip, Typography} from "@mui/material";
import styled from "styled-components";
import {useLocation, useNavigate,} from "react-router-dom";
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditIcon from '@mui/icons-material/Edit';
import {useContext} from "react";
import {UserAuthContext} from "../lib/user-auth-context";
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteQuiz} from "../service/api";
import {toast} from "react-toastify";
import {errorToast} from "../lib/common";
import DraftsIcon from '@mui/icons-material/Drafts';


const BriefQuizDetailCard = ({quizObj, setRefresh}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const isMyQuiz = location.pathname.includes('myquiz')
    const {user} = useContext(UserAuthContext);

    const handleDelete = () => {
        deleteQuiz({id: quizObj.id}, user.token)
            .then(() => {
                toast.success('delete successfully')
                setRefresh(true)
            })
            .catch(e => errorToast(e))
    }

    return (
        <StyledCard>
            <CardContent>
                <Typography variant='h4'>{quizObj.title}</Typography>
                <Typography variant='subtitle1'>Total Ques: {quizObj.questionCount}</Typography>
            </CardContent>
            <CardActions>
                <Box sx={{flexGrow: 1}}>
                    {user && isMyQuiz && !quizObj.published && <Tooltip title='edit'>
                        <IconButton onClick={() => navigate(`/quiz/edit/${quizObj.permalink}`)}>
                            <EditIcon color='success'/>
                        </IconButton>
                    </Tooltip>}
                    {user && isMyQuiz && <Tooltip title='delete'>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>}
                    {quizObj.published ? <Tooltip title='Published'>
                        <IconButton>
                            <DoneAllIcon/>
                        </IconButton>
                    </Tooltip> : <Tooltip title='draft'>
                        <IconButton>
                            <DraftsIcon/>
                        </IconButton>
                    </Tooltip>}
                </Box>
                {quizObj.published &&
                    <Button onClick={() => navigate(`/quiz/${quizObj.permalink}`)}>Play this quiz</Button>}
            </CardActions>
        </StyledCard>
    )
}
export default BriefQuizDetailCard;

const StyledCard = styled(Card)`
  width: 600px;
  margin: 5px;
`