import { useState, useEffect } from "react"
import { connect } from 'react-redux'
import commentActions from '../redux/actions/commentActions'
import taskActions from '../redux/actions/taskActions'
import Comment from './Comment'

const TaskModal = (props) => {

    const { title, description, _id } = props.task
    const { addComment, setShow, show, userLogged, editTask, getComments } = props

    const [newComment, setNewComment] = useState({ userId: '', userCompleteName: '', message: '' })
    const [commentsState, setCommentsState] = useState([])
    const [editDescription, setEditDescription] = useState(true)
    const [newDescription, setNewDescription] = useState({ description: '' })

    let display = !show ? 'none' : 'block'
    let userName;
    let token = props.userLogged && props.userLogged.token
    if (userLogged) {
        userName = `${userLogged.firstName} ${userLogged.lastName || ''}`
    }

    useEffect(() => {
        if(props.task.comments){
            setCommentsState(props.task.comments)
        }
        setNewDescription({ description: props.task.description })

        const reloadTaskPlanner = setInterval(() => {
            getAllComments()
        }, 2000)
        return () => { clearInterval(reloadTaskPlanner) }
    }, [])

    const getAllComments = async () => {
        const response = await getComments(_id)
        if(response){
            setCommentsState(response)
        }
    }

    const readDataNewComment = (e) => {
        let value = e.target.value;
        setNewComment({
            message: value,
            userCompleteName: userName //aca va el username cuando lo reciba 
        })
    }

    const sendComment = async () => {
        if (Object.values(newComment).some(valor => valor === "")) {
            alert('comentario vacio')
            return false
        }
        let response = await addComment(_id, newComment, token)
        if (response) {
            setCommentsState(response)
        }
        setNewComment({ userId: '', userCompleteName: '', message: '' })
    }

    const sendDescription = async () => {
        const response = await editTask(props.task._id, newDescription)
        setNewDescription({ description: response.description })
        setEditDescription(!editDescription)
    }

    let descriptionText = newDescription.description === '' ? 'Añadir una descripción mas detallada' : newDescription.description
    return (
        <>
            <div className="modal-container" style={{ display: display }}>
                <div className="modal">
                    <div style={{ display: "flex" }}>
                        <div>
                            <h3>{title}</h3>
                            {/* <p>en la lista "nombre de la lista de tarea"</p> */}
                        </div>
                        <button onClick={() => setShow(false)}>X</button>
                    </div>
                    <div>
                        <h3>Descripción</h3>
                        <>
                            {editDescription && <p style={{ cursor: 'pointer' }} onClick={() => { setEditDescription(!editDescription) }}>{descriptionText ? descriptionText : 'Añadir una descripción mas detallada'}</p>}
                            {!editDescription && <div>
                                <textarea placeholder='Añadir una descripción mas detallada' type="text" value={newDescription.description} onChange={(e) => setNewDescription({ description: e.target.value })} />
                                <button onClick={sendDescription} >guardar</button>
                                <button onClick={() => setEditDescription(!editDescription)}>cancelar</button>
                            </div>
                            }
                        </>
                    </div>
                    <div>
                        <h3>Actividad</h3>
                        {commentsState.length === 0
                            ? <h3>Sin comentarios</h3>
                            : commentsState.map(comment => {
                                return <Comment key={comment._id} comment={comment} setCommentsState={setCommentsState} idTask={_id} />
                            })
                        }
                        <div>
                            <div>
                                <p>foto user</p>
                            </div>
                            <div>
                                <input placeholder="Escriba un comentario..." name="message" value={newComment.message} onChange={readDataNewComment}></input>
                                <button onClick={sendComment}>Guardar</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = state => {
    return {
        userLogged: state.authReducer.userLogged,
    }
}
const mapDispatchToProps = {
    addComment: commentActions.addComment,
    getComments: commentActions.getComments,
    editTask: taskActions.editTask,

}

export default connect(mapStateToProps, mapDispatchToProps)(TaskModal)