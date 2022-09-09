import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export let currentExam = writable<any>({})

/**
 * Load an exam from the backend
 * 
 * @param id id of the exam
 */
export function loadExam(id: number) {

    // Send a request to get it
    postRequest("/api/group/exam/get", { // Body of the request
        token: getToken(),
        exam: id
    }, (json: any) => {

        // Return if request failed
        if(!json.success) {
            console.log(json.message)
            return
        }

        // Put exam into store
        currentExam.set(json.exam)

    })

}