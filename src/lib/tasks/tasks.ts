import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken } from "$lib/configuration";
import { addForm } from "$lib/posts/posts";
import { writable } from "svelte/store";

export let creating = writable(false)

export function createTask(topic: number, difficulty: number, title: string, explanation: string, answers: string[], correctAnswer: string, task: string) {
    creating.set(true)

    let content = ''
    answers.forEach(e => content += e + ",")
    content = content.substring(0, content.length - 1)
    content += ':' + correctAnswer;

    fetch(basePath + '/api/task/create', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            topic: topic,
            difficulty: difficulty,
            title: title,
            explanation: explanation,
            content: content,
            task: task
        })
    }).then(async res => {
        creating.set(false)

        if(res.ok) {
            const json = await res.json()
            console.log(json)

            if(json.success) {

                addForm.set(false)
                showNotification('Deine Aufgabe wurde erstellt!', 'green', 2000)

            } else {

                switch(json.message) {

                    case "session.expired":
                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        break;

                    case "invalid":
                        showNotification('Deine Aufgabe ist nicht vollständig!', 'red', 2000)
                        break;

                    case "locked":
                        showNotification('Du kannst in diesem Thema keine Aufgaben erstellen!', 'red', 2000)
                        break;
                }

            }

        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
        }

    }).catch(() => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
        creating.set(false)
    })

}
