import {toast} from "react-toastify";

export const warningToast = (e) => toast.warning(e?.response?.data?.message.toString().replace('\\', ''))
export const errorToast = (e) => toast.error(e?.response?.data?.message.toString().replace('\\', ''))

export const validateEmail = (email) => {
    const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    if (!validate) {
        toast.warning('Please enter a correct email')
        return false
    }
    return true
}

export const validatePassword = (pass) => {
    const password = pass.toString()
    const validate = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/.test(password)
    if (!validate) {
        toast.warning('password should be least 6 char,have  one special char, one number and one capital')
        return false
    }
    return true
}


export const quizQuestionsValidator = (questions) => {
    if(hasDuplicates(questions)){
        toast.warning('form have duplicates')
        return false
    }
    if (questions.length > 10) {
        toast.warning('Questions cannot be more then 10');
    }
    for (const ques of questions) {
        return validateQuestion(ques)
    }
};

export const hasDuplicates = (quesArr) => {
    const onlyQues = quesArr.map((q) => q.title);
    for (let i = 0; i < onlyQues.length; i++) {
        const title = onlyQues[i];
        if (onlyQues.includes(title, i + 1)) {
            return false
        }
    }
    return true
};

export const validateQuestion = (question) => {
    if (
        question.options.length > 5 ||
        question.options.length < 2 ||
        question.correctOptions.length > question.options.length
    ) {
        toast.warning('options should be between 2 to 5');
        return false
    }
    if (question.correctOptions.length >= 1) {
        if (question.type === 'single' && question.correctOptions.length !== 1) {
            toast.warning(
                'multiple correct option is given for single type question',
            );
            return false
        }
    } else {
        toast.warning('correct options were not given');
        return false
    }

    for (const option in question.options) {
        if (question.options[option] === ''){
            toast.warning('Option cannot be empty')
            return false
        }
    }
    for (const option in question.correctOptions) {
        if (!question.options.includes(question.correctOptions[option])) {
            toast.warning('Correct option not in options');
            return false
        }
    }
    return true
}