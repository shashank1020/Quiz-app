import {useContext, useEffect, useState} from "react";
import {getAllQuiz, getAllUserQuiz} from "../service/api";
import styled from "styled-components";
import BriefQuizDetailCard from "../component/brief-quiz-detail-card";
import {Grid, Pagination, Typography} from "@mui/material";
import {useLocation} from "react-router-dom";
import {errorToast} from "../lib/common";
import {UserAuthContext} from "../lib/user-auth-context";


const HomePage = () => {
    const location = useLocation()
    const isMyQuiz = location.pathname.includes('myquiz')
    const [quizList, setQuizList] = useState([])
    const [pages, setPages] = useState({currPage: 1, totalPages: 3});
    const {user} = useContext(UserAuthContext);
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        let p
        if (isMyQuiz) {
            p = getAllQuiz({page: pages.currPage}, user.token)
        } else {
            p = getAllQuiz({page: pages.currPage})
        }
        p.then((data) => {
            setQuizList(data)
            setPages({currPage: data.page, totalPages: data.pageCount})
        }).catch(e => {
                setQuizList([])
                errorToast(e)
            })
        setRefresh(false)
    }, [pages.currPage, location.pathname, refresh])
    return (
        <Wrapper>
            {!isMyQuiz && <Typography variant="h2" component="div" gutterBottom>
                Welcome to Quizzzz
            </Typography>}
            {user && isMyQuiz && <Typography variant='h4' component='div'>All Quizs of {user.name}</Typography>}
            <Typography variant='subtitle1' component='p'>Total Quizs: {quizList?.totalQuiz}</Typography>
            {quizList && quizList?.quizes?.map(quiz => <BriefQuizDetailCard setRefresh={setRefresh} quizObj={quiz}/>)}
            <Grid className="pagination center">
                {quizList.quizes && quizList.quizes.length > 0 && <Pagination
                    count={pages.totalPages}
                    page={pages.currPage}
                    onChange={(_, cpage) => setPages({...pages, currPage: cpage})}
                    color="primary"
                />}
            </Grid>
        </Wrapper>
    )
}
export default HomePage;


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .brief-container {
    width: 80%;
    margin: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
`

