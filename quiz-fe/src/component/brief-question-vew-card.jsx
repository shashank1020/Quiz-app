import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styled from "styled-components";


const BriefQuestionVewCard = ({question, deleteQuestion, index, isPublished, setEdit}) => {
    return (
        <Wrapper>
            <CardContent>
                <Typography variant='h5' component='div'>Q.{index + 1} {question.title}</Typography>
                {question.options.map((option, index) => (
                    <div className="gap">{index + 1}) {option}</div>
                ))}
            </CardContent>
            {!isPublished && <CardActions>
                <Button variant='contained' color='error'
                        onClick={() => deleteQuestion(index)}><DeleteIcon/>
                </Button>
                <Button variant='contained' color='success'
                        onClick={() => setEdit(index)}><EditIcon/>
                </Button>
            </CardActions>}
        </Wrapper>
    )
}

export default BriefQuestionVewCard;

const Wrapper = styled(Card)`
  margin: 10px;
`