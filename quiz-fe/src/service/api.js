import axios from "axios";

const BASEURL = 'http://localhost:3001'

const headerConfig = (jwt) => {
    return {
        headers: {jwt}
    }
}

export const loginUserService = async ({email, password}) => {
    // return  {data: {name: 'Shas', email: 'shas@email.com', id: 1, token: 'random-token'}}
    return axios.post(`${BASEURL}/user/login`, {email, password})
}

export const signUpService = ({name, email, password}) => axios.post(`${BASEURL}/user/signup`, {
    name,
    email,
    password
}).then(response => response.data)

export const getAllQuiz = ({page}) => axios.get(`${BASEURL}/quiz?page=${page}`).then(response => response.data)

export const getAllUserQuiz = ({page}, token) => axios.get(`${BASEURL}/quiz/user-quiz?page=${page}`, headerConfig(token)).then(response => response.data)

export const getByPermalink = ({permalink}) => {
    return axios.get(`${BASEURL}/quiz/${permalink}`).then(response => response.data)
}
export const getByUserPermalink = ({permalink}, token) => {
    return axios.get(`${BASEURL}/quiz/edit/${permalink}`, headerConfig(token)).then(response => response.data)
}
export const deleteQuiz = ({id}, token) => {
    return axios.delete(`${BASEURL}/quiz/${id}`, headerConfig(token)).then(response => response.data)
}

export const updateQuiz = (permalink, {
    questions, title, published
}, token) => {
    return axios.patch(`${BASEURL}/quiz/${permalink}`, {
        questions, title, published
    }, headerConfig(token)).then(response => response.data)
}

export const createQuiz = ({title, questions, published}, token) => {
    return axios.post(`${BASEURL}/quiz/create`, {
        title, questions, published
    }, headerConfig(token)).then(response => response.data)
}

export const evaluateQuiz = ({permalink, questions}) => {
    console.log(questions, 'api')
    return axios.post(`${BASEURL}/quiz/evaluate/${permalink}`, {questions}).then(response => response.data)
}