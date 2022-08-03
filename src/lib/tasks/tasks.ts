import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken, postRequest } from "$lib/configuration";
import { addForm } from "$lib/posts/posts";
import { writable } from "svelte/store";

export let creating = writable(false)

/**
 * Create a new task
 * @param topic id of the topic
 * @param difficulty difficulty of the task
 * @param title title of the task
 * @param explanation explanation of the task
 * @param answers answers of the task
 * @param correctAnswer correct answer of the task
 * @param task task of the task
 */
export function createTask(topic: number, difficulty: number, title: string, explanation: string, answers: string[], correctAnswer: string, task: string) {
    creating.set(true)

    // Construct content
    let content = ''
    answers.forEach(e => content += e + ",")
    content = content.substring(0, content.length - 1)
    content += ':' + correctAnswer;

    // Send request to the server
    postRequest('/api/task/create', { // Body of the request
        token: getToken(),
        topic: topic,
        difficulty: difficulty,
        title: title,
        explanation: explanation,
        content: content,
        task: task
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            // Send notification
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

            return;
        }

        // Close add form and show notification
        addForm.set(false)
        showNotification('Deine Aufgabe wurde erstellt!', 'green', 2000)
    })

}
