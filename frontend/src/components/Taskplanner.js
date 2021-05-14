import { useEffect, useState } from 'react'
import taskActions from "../redux/actions/taskActions"
import { connect } from "react-redux"
import Task from "./Task"

const TaskPlanner = (props) => {
    const [allTasks, setAllTasks] = useState([])
    const [preloader, setPreloader] = useState(true)
    const [open, setOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newTask, setNewTask] = useState('')

    const [editTitle, setEditTitle] = useState(true)

    useEffect(() => {
        fetchAllTasks()
        const reloadTaskPlanner = setInterval(() => {
            fetchAllTasks()
        }, 5000)
        return () => { clearInterval(reloadTaskPlanner) }
    }, [])

    const fetchAllTasks = async () => {
        const response = await props.tasksFromTaskplanner(props.taskplanner._id)
        setAllTasks(response)
        setPreloader(false)
    }

    const enter = (e, condition) => {
        if (condition === 'task' && e.key === 'Enter') {
            sendValues()
        } else if (condition === 'edit' && e.key === 'Enter') {
            props.edit(props.taskplanner._id, newTitle)
        }
    }

    const sendValues = async () => {
        if (newTask.trim() !== "") {
            await props.addTask({ title: newTask, taskplannerId: props.taskplanner._id }, props.userLogged.token)
            const tasks = await props.tasksFromTaskplanner(props.taskplanner._id)
            setAllTasks(tasks)
            setNewTask('')
        }
    }

    return (
        <div style={{ width: '25vw' }}>
            <div>
                <button onClick={() => props.erase(props.taskplanner._id)}>Delete</button>
            </div>
            {editTitle && <h1 style={{cursor:'pointer'}} onClick={( props.imOwner || props.imAdmin) && (() => {setEditTitle(!editTitle); setNewTitle(props.taskplanner.title)})}>{props.taskplanner.title}</h1>}
            {!editTitle && <div style={{display:'flex'}}>
                <input onKeyDown={(e) =>{newTitle.trim() && enter(e, 'edit')}} type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                
                <button onClick={newTitle.trim() && (() => props.edit(props.taskplanner._id, newTitle))}>Send</button>
                <h2 style={{cursor:'pointer'}} onClick={() => setEditTitle(!editTitle)}>x</h2>
                
            </div>
            }
            <button onClick={() => setOpen(!open)}>add task</button>
            {
                open && <div>
                    <input onKeyDown={(e) => enter(e, 'task')} type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    <button onClick={sendValues}>Send</button>
                </div>
            }

            <div>
                {
                    preloader
                        ? <span>cargando</span>
                        : allTasks.map(task => <Task imAdmin={props.imAdmin} imOwner={props.imOwner} key={task._id} task={task} allTasks={allTasks} setAllTasks={setAllTasks} />)
                }
            </div>

        </div>
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
    }
}

const mapDispatchToProps = {
    addTask: taskActions.addTask,
    tasksFromTaskplanner: taskActions.tasksFromTaskplanner,
    editTaskPlanner: taskActions.editTaskPlanner
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPlanner)
