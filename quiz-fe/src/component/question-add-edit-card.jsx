import {
    Button,
    Card,
    CardActions,
    Fab,
    FormControl,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import styled from "styled-components";
import {toast} from "react-toastify";
import SaveIcon from '@mui/icons-material/Save';
import {hasDuplicateOptions, trim, validateQuestion} from "../lib/common";
import DangerousSharpIcon from '@mui/icons-material/DangerousSharp';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import CloseIcon from '@mui/icons-material/Close';


const QuestionAddEditCard = ({onQuestionUpdate, ...props}) => {
    const [title, setTitle] = useState(props.title);
    const [options, setOptions] = useState(props.options)
    const [correctOptions, setCorrectOptions] = useState(props.correctOptions)
    const [type, setType] = useState(props.type || 'single');

    return <Wrapper>
        <Card className='quiz-card'>
            <FormControl className='type'>
                <Select
                    sx={{width: 300}}
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <MenuItem value={'single'}>Single Choice</MenuItem>
                    <MenuItem value={'multiple'}>Multi Choice</MenuItem>
                </Select>
                {(props?.setAdd || props?.setEdit) &&
                    <Button onClick={() => props.setAdd ? props.setAdd(false) : props.setEdit(null)}><CloseIcon
                        color='error'/></Button>}
            </FormControl>
            <div className="space">
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={title}
                    placeholder='E.g: What is your name?'
                    onChange={e => setTitle(trim(e.target.value))}
                />
            </div>
            <Stack spacing={2}>
                {options && options?.map((option, index) => {
                    return <FormControl sx={{m: 1, width: '80%', minWidth: "420px"}} variant="outlined">
                        <OutlinedInput
                            type={'text'}
                            value={option}
                            placeholder='E.g: Android'
                            onChange={e => {
                                const newOptions = [...options];
                                newOptions[index] = trim(e.target.value);
                                setOptions(newOptions)
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => {
                                            if (option === '') {
                                                toast.warning('add some text')
                                            } else {
                                                if (correctOptions.includes(option)) {
                                                    const index = correctOptions.indexOf(option)
                                                    const newCorrectOptions = correctOptions
                                                    newCorrectOptions.splice(index, 1)
                                                    setCorrectOptions([...newCorrectOptions])
                                                } else {
                                                    if (type === 'multiple') {
                                                        correctOptions.push(option)
                                                        setCorrectOptions([...correctOptions])
                                                    } else {
                                                        setCorrectOptions([option])
                                                    }
                                                }
                                            }
                                        }}
                                        edge="end"
                                    >
                                        {correctOptions.includes(option) ? <DangerousSharpIcon color={"success"}/> :
                                            <DangerousSharpIcon color={"error"}/>}
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        options.splice(index, 1);
                                        setOptions([...options])
                                    }}>
                                        <DeleteForeverSharpIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>{correctOptions.includes(option) ? 'This is correct option' : 'This is wrong option'}</FormHelperText>
                    </FormControl>
                })}
            </Stack>
            <CardActions className='action-button'>

                {options && options?.length < 5 && <Button variant='contained' aria-label="add" onClick={() => {
                    setOptions([...options, ''])
                }}>
                    Add Option
                </Button>}
                <Fab color="secondary" aria-label="edit" onClick={() => {
                    if (validateQuestion({title, options, type, correctOptions}) && hasDuplicateOptions(options))
                        onQuestionUpdate({title, options, type, correctOptions})
                }}>
                    <SaveIcon/>
                </Fab>
            </CardActions>
        </Card>
    </Wrapper>
}

export default QuestionAddEditCard;

const Wrapper = styled.div`
  padding: 20px;

  .quiz-card {
    padding: 10px;
  }

  .type {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }

  .space {
    margin: 10px 0;
  }

  .action-button {
    display: flex;
    justify-content: space-between;
  }
`