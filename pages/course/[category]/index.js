import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";

function Course() {
    useEffect(() => {
        console.log(router)
    }, [])
    const router = useRouter()
    return (
        <>
            <h1>
                Hi! {JSON.stringify(router.query)}
            </h1>
        </>
    )
}

export default Course
