import { useRouter } from "next/router";
import React, {useEffect, useState, useRef} from "react";
import globals from "../../../../../src/globals";
import styles from "./styles.module.css";
import axios from "axios";
import { Image } from "react-bootstrap";
import Footer from "../../../../../src/components/Footer/Footer";
import HeaderTeacher from "../../../../../src/components/HeaderTeacher/HeaderTeacher";
import classnames from 'classnames';
import socket from "../../../../../src/socket";
import ACTIONS from "../../../../../src/socket/actions";
import useWebRTC, {LOCAL_VIDEO} from '../../../../../src/hooks/useWebRTC';

function Lesson(props) {
	
	const router = useRouter()
	const teacherUrl = router.query.url
    const room = router.query.room
    const [teacher, setTeacher] = useState([])
    const [rooms, updateRooms] = useState([])
    const {clients, provideMediaRef} = useWebRTC(room)
    const rootNode = useRef();
    
    console.log('teacherUrl',teacherUrl)
    console.log('room',room)
    console.log('clients',clients)

    useWebRTC(room)

    useEffect(() => {
        loadBaseData()
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
            if (rootNode.current){
                updateRooms(rooms);
            }
        })
    }, []) 

    const loadBaseData = async () => {
        let data = props.url 
        let getTeacherByUrl = await axios.post(`${globals.productionServerDomain}/getTeacherByUrl/` + data)
        setTeacher(getTeacherByUrl['data'][0])
    }

	return ( 
        <>
            <div style={{backgroundColor: "#f1faff", width: "100vw"}} ref={rootNode}>
                <HeaderTeacher white={true} teacher={teacher}/>

              	<div className={styles.cantainer}>
              		{room}
                    <div>
                        {clients.map((clientID) => {
                            return (
                                <div key={clientID}>
                                    <video
                                        ref={instance => {
                                            provideMediaRef(clientID, instance);
                                        }}
                                        autoPlay
                                        playsInline
                                        muted={clientID === LOCAL_VIDEO}
                                    />
                                </div>
                                )
                        })}
                    </div>
              	</div>
              	
              	<Footer />
            </div>
        </>
       )
}

Lesson.getInitialProps = async (ctx) => {
	console.log('lol',ctx)
    if(ctx.query.url !== undefined) {
        return {
            url: ctx.query.url,
        }
    }else{
        return {};
    }
}

export default Lesson