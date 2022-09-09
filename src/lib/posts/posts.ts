import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export let hadError = writable(false) // if request had an error
export let currentPage = writable(0) // current page of post section

export let postList = writable<any[]>([]) // List of posts on current page

export let addForm = writable(false) // if adding post/task form is open or not

export let uploading = writable(false) // if the post is currently uploading
export let uploadStatus = writable('') // the current upload status

//*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
// (only this function)
export function customFormat(date: Date, formatString: any){
    let YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=date.getFullYear())+"").slice(-2);
    MM = (M=date.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=date.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=date.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=date.getMinutes())<10?('0'+m):m;
    ss=(s=date.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
  };

/**
 * Loads posts for a page
 * @param topic id of the topic
 * @param page page number
 */
export function loadPosts(query: string, filter: number, topic: number, page: number) {

    // Send a request to the server
    postRequest('/api/post/list', {  // Body of the request
        query: query == '' ? '' : '%' + query + "%",
        filter: filter,
        token: getToken(),
        topic: topic,
        currentScroll: page * 7
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) return;
    
        // Update current page
        currentPage.set(page)

        // Sort posts by likes/dates
        if(filter == 0) {
            json.posts.sort(function(a: any,b: any){return b.likes - a.likes})
        } else {
            json.posts.sort(function(a: any,b: any){return b.date - a.date})
        }

        // Add dates to each post
        json.posts.forEach((element: { date: any; }) => {
            const date = new Date(element.date)
            element.date = customFormat(date, "#DD#.#MM#.#YYYY#");
        });

        // Set posts
        postList.set(json.posts)

    })

}

/**
 * Creates a new post
 * @param topic id of the topic
 * @param title title of the post
 * @param content content of the post
 */
export function createPost(topic: number, title: string, content: string, close: boolean | undefined) {
    
    // Send a request to the server
    postRequest('/api/post/create', { // Body of the request
        token: getToken(),
        topic: topic,
        title: title,
        content: content
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            // Send notification
            switch(json.message) {
                case "topic.locked":
                    showNotification('Du hast keine Rechte in diesem Thema Beiträge zu erstellen!', 'red', 2000)
                    break;

                case "topic.not_found":
                    showNotification('Dieses Thema existiert nicht!', 'red', 2000)
                    break;

                case "content.too_long":
                    showNotification('Dein Text darf nicht länger als 6000 Zeichen sein!', 'red', 2000)
                    break;

                case "title.too_long":
                    showNotification('Dein Titel darf nicht länger als 50 Zeichen sein!', 'red', 2000)
                    break;
            }

            return
        }

        // Send notification and close adding post form
        showNotification('Dein Beitrag wurde erstellt!', 'green', 2000)

        if(close) {
            addForm.set(true)
        }
    })
}