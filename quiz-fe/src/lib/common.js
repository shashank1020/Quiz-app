import {toast} from "react-toastify";

export const trim = (string) => string.toString().replace(/ +/g, ' ')

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
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(pass)) {
        toast.warning("Password must not contain Whitespaces.");
        return false;
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(pass)) {
        toast.warning("Password must have at least one Uppercase Character.");
        return false;
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(pass)) {
        toast.warning("Password must have at least one Lowercase Character.");
        return false;
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(pass)) {
        toast.warning("Password must contain at least one Digit.");
        return false;
    }

    const isContainsSymbol =
        /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(pass)) {
        toast.warning("Password must contain at least one Special Symbol.");
        return false;
    }

    const isValidLength = /^.{6,16}$/;
    if (!isValidLength.test(pass)) {
        toast.warning("Password must be 10-16 Characters Long.");
        return false;
    }
    return true;
}

export const quizQuestionsValidator = (questions) => {
    if (questions.length > 10) {
        toast.warning('Questions cannot be more then 10');
    }
    return hasDuplicatesQuestions(questions)
};

export const hasDuplicatesQuestions = (quesArr) => {
    const onlyQues = new Set(quesArr.map((q) => q.title))
    if (onlyQues.size !== quesArr.length) {
        toast.warning('Duplicate questions found')
        return false
    }
    return true
};
export const hasDuplicateOptions = (options) => {
    const filtered = new Set(options)
    if (filtered.size !== options.length) {
        toast.warning('Duplicate options found')
        return false
    }
    return true
}
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

    for (const optionIndex in question.options) {
        const optionValue = question.options[optionIndex]
        if (optionValue === '') {
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