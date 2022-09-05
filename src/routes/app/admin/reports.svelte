<script lang="ts">
import { goto } from "$app/navigation";
import { showNotification } from "$lib/components/notificationStore";

import { getToken, postRequest } from "$lib/configuration";

import { onMount } from "svelte";
import { slide, fly } from "svelte/transition";

let reportList: any[] = []
let currentOffset = 0, currentOpen = 0

    onMount(() => loadReports())

    function loadReports() {

        if(reportList.length >= 20) {
            currentOffset += 20
        }

        postRequest('/api/report/list', {
            token: getToken(),
            offset: 0
        }, (json: any) => {

            if(!json.success) {
                if(json.message === 'no_permission') {
                    goto('/app')
                    showNotification('Du hast keine Rechte für das Admin Panel!', 'red', 2000)
                }
                return;
            }

            if(json.reports[0]) {

                if(reportList.length < 20) {
                    reportList = json.reports
                    return;
                }

                if(reportList[0] && currentOffset != 0) {
                    reportList = reportList.concat(json.reports)
                } else reportList = json.reports
            } else {
                currentOffset -= 20;
            }

        })

    }

    function deleteReport(report: any) {

        postRequest('/api/report/delete', {
            token: getToken(),
            report: report.id
        }, (json: any) => {
            if(!json.success) return
            console.log(json)

            reportList.splice(reportList.indexOf(report), 1)
            reportList = reportList;
        })
    }

</script>

<div class="reports">

    {#if !reportList[0]}
    <div in:fly style="margin-top: 3em;" class="cc">
        <h2>Keine Meldungen gefunden!</h2>
    </div>
    {/if}

    {#each reportList as report}
    <div class="report">
        <div on:click={() => {
            if(currentOpen == report.id) {
                currentOpen = -1
            } else currentOpen = report.id
        }} class="row">
            <h4><span class="material-icons">link</span>{report.url}</h4>
            <span style="font-size: 40px;" class="material-icons arrow {currentOpen == report.id ? 'rotate' : ''}">expand_more</span>
        </div>

        {#if currentOpen == report.id}
        <div in:slide={{duration: 250}} out:slide={{duration: 250}} class="content" style="margin-bottom: 4px;">
            <p style="margin-bottom: 10px;">{report.description}</p>

            <div class="flex cc-space">
                <button on:click={() => {
                    window.open(report.url, '_blank')
                }}>Öffnen</button>
                <button on:click={() => deleteReport(report)}>Löschen</button>
            </div>
        </div>
        {/if}
    </div>
    {/each}

</div>

<style lang="scss">

    .report {
        cursor: pointer;
        margin: 0.4em;
        border-radius: 0.5em;
        padding: 0.3em 1em;
        background-color: var(--menu-color);
    }

    h4 {
        display: flex;
        align-items: center;
        gap: 0.5em;

        span {
            color: var(--highlight-color);
        }
    }

    span {
        user-select: none;
    }

    .arrow {
        transition: 250ms ease;
        transform: rotate(0deg);
    }

    .rotate {
        transform: rotate(180deg);
    }

    button {
        background-color: var(--box-color);

        &:hover {
            background-color: var(--hover-color);
        }
    }

</style>