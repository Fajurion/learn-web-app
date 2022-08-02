import { goto } from "$app/navigation";
import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken } from "$lib/configuration";
import { writable } from "svelte/store";

export let requesting = writable(true)
export let hadError = writable(false)
export let currentPage = writable(0)

export let postList = writable([])

export let addForm = writable(false)

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

export function loadPosts(topic: number, page: number) {
    onRequest()
    
    fetch(basePath + '/api/post/list', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            topic: topic,
            currentScroll: page * 7
        })
    }).then(res => {
        stopRequest()

        if(res.ok) {
            return res.json()
        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
            return 
        }

    }).then(json => {
        console.log(json)

        if(!json.success) {

            switch(json.message) {
                case "server.error":

                    showNotification('Es gab einen Fehler auf dem Server. Bitte berichte einem Admin davon!', 'red', 5000)

                    break;
            }

            hadError.set(true)
            return
        }

        currentPage.set(page)

        json.posts.forEach((element: { date: any; }) => {
            const date = new Date(element.date)
            element.date = customFormat(date, "#DD#/#MM#/#YYYY#");
        });

        json.posts.sort(function(a: any,b: any){return b.likes - a.likes})

        postList.set(json.posts)

    }).catch(() => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
        stopRequest()
        hadError.set(true)
    })

}

export function createPost(topic: number, title: string, content: string) {

    let succ = undefined

    onRequest()
    
    fetch(basePath + '/api/post/create', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            topic: topic,
            title: title,
            content: content
        })
    }).then(res => {
        stopRequest()

        if(res.ok) {
            return res.json()
        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
            throw console.error();
        }

    }).then(json => {

        console.log(json)

        if(!json.success) {

            switch(json.message) {
                case "session.expired.deleted":
                case "session.expired":

                    showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                    document.cookie = "token=test ; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                    goto('/app')

                    break;
                
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

        showNotification('Dein Beitrag wurde erstellt!', 'green', 2000)
        addForm.set(false)

    }).catch(() => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 2000)
        stopRequest()
    })


    return succ
}

export function reloadPage() {

}

function onRequest() {
    requesting.set(true)
}

function stopRequest() {
    requesting.set(false)
}