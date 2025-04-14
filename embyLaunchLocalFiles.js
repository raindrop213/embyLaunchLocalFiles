// ==UserScript==
// @name         embyFile
// @name:en      embyFile
// @name:zh      emby打开文件夹和视频
// @name:zh-CN   emby打开文件夹和视频
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  emby/jellfin打开媒体文件夹及使用本地播放器播放视频
// @description:zh-cn emby/jellfin打开媒体文件夹及使用本地播放器播放视频
// @description:en  open media folder and play videos with local players in emby/jellfin
// @license      MIT
// @author       @bpking
// @match        *://*/web/index.html
// @match        *://*/web/
// ==/UserScript==

(function () {
    'use strict';
    
    // 标记和常量
    const mark = "embyFile";
    const playBtnsWrapperId = "FileButtonsWrapper";
    const potplayerIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAexAAAHsQEGxWGGAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA0LTE1VDAwOjM5OjU5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wNC0xNVQwMTowMSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wNC0xNVQwMTowMSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNjcxYmIyYS1hNGQ1LWU4NDItOWVhOC1lN2YzOGY1YzZlZTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozYTBiMGFhNS05Nzc4LTcyNGMtOThmNy04NzExZTcyYTA5NTUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNGUwMDcyYS0zZTJjLTZjNGEtYmFiNC1lNDQyZmIxNGRiM2UiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0ZTAwNzJhLTNlMmMtNmM0YS1iYWI0LWU0NDJmYjE0ZGIzZSIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xNVQwMDozOTo1OSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjcxYmIyYS1hNGQ1LWU4NDItOWVhOC1lN2YzOGY1YzZlZTUiIHN0RXZ0OndoZW49IjIwMjUtMDQtMTVUMDE6MDErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz65rbbCAAACb0lEQVRIx61WzWsTQRQfD5KD9CxoBaGW2qKoRWi8eKrizbvJpTkUepZESQ7tH+FJEA9C01t70oOoAe+C4EFtk+6uiTa1ahM/kp3Z3fG9mc26u93Zj9qFRyDz5vebeb/3MYRzfixkRJgzINbe3Sn6aabG2peeUf2ERnWyL21MY+3LT2Gtij7o6+0L4ZEocLv3cJIZF9Zok3C6TbjZgl8NTHdNc/+DNeFjXKzb/UfnokhIENwmbKdQMj+Sobnlghk+4LC5a+hrbpIB6xYWEMNPQv6Bm4R1rlfMDymAVUSwFzDKiDUi8QisvaXC8H0GUIUhBmDd8RMQZ9AYhysG4+yeDGNtNjPcSBPhAt1fn0ZsQcA6c+uCwDjozL5c47ST56CLPICRHC7EYp/z64LA/lWfECeMcEZHu/+A42d9rYqbeOInGPo6f55PQNbcWo4jsL6X+ehzhm9BxHlxG5GmRjwB25lfhvDMvhTOSoL7PPzZvccQrpOxYUNMwH5FqJ7TlKdQEEiWH9zaXZI1oEyCnE7c8s9O4IXtHQh6kyuisP/fBCIBdhe5QkckyOmHJZBanIoJ0XEDRW5kFdkZvgEBb0iRWwkiQ5qupE1T7vyGeijLethMrgNI05X4QoMT2j1ZaHZ/FcJxNnVFe4UmW8XVjahWgde0urdBxJI8cTNDq+jMbXi9yBm8OKNqdhjjtO0h2Owa4yMCt10vFo+wXRcOzAMcErSdv3cEA6cSNXBcEkZYt1iCKx5yZBaVIzM49PtPJqlxZY22Ugx9UQezdfvnauLQDz5bhC4VeLacr4knij627Xu2tOSzZbpqfatN+feE8f4C5cap1dxap6QAAAAASUVORK5CYII="
    const dandanplayIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAexAAAHsQEGxWGGAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTA0LTE1VDAwOjM5OjU5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wNC0xNVQwMTowMTowOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wNC0xNVQwMTowMTowOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOTJjNWM3Yy0xMzM0LTMyNDQtYjY2ZC04ZDBlYjEzMTc1MzEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZjEzOTk4MC0zZGExLThhNGYtODNjYi02YjYxMDQwNDhkYTAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxYTJkODY3MC0xNzM3LTU2NDUtODI3Mi0yODNiZDgwOTIxOWQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFhMmQ4NjcwLTE3MzctNTY0NS04MjcyLTI4M2JkODA5MjE5ZCIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xNVQwMDozOTo1OSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyOTJjNWM3Yy0xMzM0LTMyNDQtYjY2ZC04ZDBlYjEzMTc1MzEiIHN0RXZ0OndoZW49IjIwMjUtMDQtMTVUMDE6MDE6MDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6xK0vZAAAEJ0lEQVRIx61WWUycVRS+KrVVgTKSorbVos4wIhgfjNHYmDRNNFGDD6YPJiamYow++uCLvpiaWBMTNbUu1GrZK7NJQQotiGhdEptaxmpFZl/ZyswwUyjD+vmdf5bIAKON3OTkn5l7//Od853vnDuq6PCEzmD5q8NoDSQMZv8ULfo/bcpo9ib0ttH2ojqvTpU3hXurOvzQm/0wbJDpLQFUd4yivHGoRxlt3mW9KbDuYaPFjwo+y9t8uONLH3atY7fT7jLxrCUNYg7AaPUtqDQtqxxXWgPYcdwHddSlma7Jg20tXpQ2r223tHq1M3ebUkEZzD5aIKbSvGUd32NJ0aWOOFHW4kHt9+NodiZw7lISFyJzGJxMrrLztOGpeXQFZnArgXa1+TL+JlcA3MuoyxilOuJA7XfjcMbncTWrNzSDLcfcGlWrAMR5KVPc9LkLDY7Eihf7gjN4cWAcr/w4gYP2GA6cj+LAr1G8xedr/O2kf1o7t++bUajPnBoLKwCkiDtZJNk8RWeZJbTsPRFE4RcuPHN6BLpGD9Q7F6E+ceBaBiI0qveGYHFf1s6/9MMEFH835gJI9OpTB979LZZ13k0+BVC9P4Sn6FxWcnEZb5ydhK7BzT2X5kRHzoem5vIDlJCa+22BrHMpWAGVs5UR30ir6R1ZQdmfsTk89+0YtlE9xY1urcjrAvBLVFJ92x7NOni2f4wZOVFN0C317mwGuWvncS+uYyB5ASSDTax8V7pQ0eSS1lCieanN9dx7OieDn8Zm8WR3GDczg63MPi8ANR+VKPtCqeKGZxY1qe4giDRNAQv8WE84vbeAFwbGUrU56tS6u5gAg5F/o4gv1A3FtUOLS8t4mMq5iaB3tvlxQ70H21t9qKXj26RHPhzWqJEghP8i1mgwXwakISo0/LOQba4E1MGLeJkaPzuRhJkyfPXnCbSwo3so40N/xNDpm9aoeeJkCL1padeeWacGhvRoGBi5kgV5vCuM3R1BjJKWdu9lHPo9RjnO4wQ/f3AhxqhnYSc1D7YH0R9Ovbevj41W52DT5gBI54kkt1PTkeRiFuT1Xy6hQJrp42GUcF/OyCgobfagkL2wuT7VD5V0Nj67iAECqbpUbSpyM6hms4nkKgkWnF7IgvSHrmA/x8QDttRIv49PMWnOKtojnSGow8PY83VIOy/jQzpd9lcNuyq+eA1VU8YIW52J/zzkIpS2PV1oWQ9RJMXMtiIXIJOJzHVRVs2pEbSy4FKHq5qqLLpQxctncs0LJzMNpQcyen+UFOxlc+3pWtt2k6qa3lG8eS6C5znq5QKij5gyWj1LelMw73Upl4jovbBhfRMBbD7m1jKXs0K30RRcUOUNgdPVnRtz2VdkgpJL3xZGuc3ZrQo/iukMNvdXRqs/zkPxDfjbEq8w+eP6pqCtqMVe8jcrhqVsvp2yxQAAAABJRU5ErkJggg=="
    
    // 初始化变量
    let isEmby = "";
    
    // Python服务器地址
    const serverUrl = "http://localhost:38096";
    
    // 选择器，用于确定DOM中的位置
    const selectors = {
        // 详情页评分，上映日期信息栏
        embyMediaInfoDiv: "div[is='emby-scroller']:not(.hide) .mediaInfo:not(.hide)",
        jellfinMediaInfoDiv: ".itemMiscInfo-primary:not(.hide)",
        // 详情页播放收藏那排按钮
        embyMainDetailButtons: "div[is='emby-scroller']:not(.hide) .mainDetailButtons",
        jellfinMainDetailButtons: "div.itemDetailPage:not(.hide) div.detailPagePrimaryContainer",
    };

    // 初始化界面，添加按钮
    function init() {
        let buttonWrapper = document.getElementById(playBtnsWrapperId);
        if (buttonWrapper) {
            buttonWrapper.remove();
        }
        
        let mainDetailButtons = document.querySelector(selectors.embyMainDetailButtons);
        
        // 创建按钮组HTML
        let buttonHtml = `
        <div id="${playBtnsWrapperId}" class="detailButtons flex align-items-flex-start flex-wrap-wrap detail-lineItem">
            <!-- 打开文件夹按钮 -->
            <button id="embyOpenFolder" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="打开文件夹">
                <div class="detailButton-content">
                    <i class="md-icon detailButton-icon button-icon button-icon-left material-icons">folder_open</i>
                    <span class="button-text">打开文件夹</span>
                </div>
            </button>
            
            <!-- PotPlayer播放按钮 -->
            <button id="embyOpenPotPlayer" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="PotPlayer播放">
                <div class="detailButton-content">
                    <img src="${potplayerIcon}" alt="PotPlayer播放" class="md-icon detailButton-icon button-icon button-icon-left material-icons">
                    <span class="button-text">PotPlayer</span>
                </div>
            </button>
            
            <!-- 弹弹play播放按钮 -->
            <button id="embyOpenDandanplay" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="弹弹play播放">
                <div class="detailButton-content">
                    <img src="${dandanplayIcon}" alt="弹弹play播放" class="md-icon detailButton-icon button-icon button-icon-left material-icons">
                    <span class="button-text">弹弹play</span>
                </div>
            </button>
        </div>`;

        // 如果不是Emby，而是Jellyfin
        if (!isEmby) {
            mainDetailButtons = document.querySelector(selectors.jellfinMainDetailButtons);
        }

        // 添加按钮到DOM
        mainDetailButtons.insertAdjacentHTML("afterend", buttonHtml);

        // 为Jellyfin添加特殊类
        if (!isEmby) {
            let buttonWrapper = document.getElementById(playBtnsWrapperId);
            buttonWrapper.style.display = "flex";
            buttonWrapper.classList.add("detailPagePrimaryContainer");
            let btns = buttonWrapper.getElementsByTagName("button");
            for (let i = 0; i < btns.length; i++) {
                btns[i].classList.add("button-flat");
            }
        }

        // 添加点击事件
        const openFolderBtn = document.getElementById("embyOpenFolder");
        if (openFolderBtn) {
            openFolderBtn.onclick = () => sendToServer("folder");
        }
        
        const openPotPlayerBtn = document.getElementById("embyOpenPotPlayer");
        if (openPotPlayerBtn) {
            openPotPlayerBtn.onclick = () => sendToServer("potplayer");
        }
        
        const openDandanplayBtn = document.getElementById("embyOpenDandanplay");
        if (openDandanplayBtn) {
            openDandanplayBtn.onclick = () => sendToServer("dandanplay");
        }
    }

    // 发送请求到Python服务器
    async function sendToServer(action) {
        // 获取视频文件路径
        const fullPathEle = document.querySelector(".mediaSources .mediaSource .sectionTitle > div:not([class]):first-child");
        let fullPath = fullPathEle ? fullPathEle.innerText : "";

        if (new RegExp('^[a-zA-Z]:').test(fullPath)) {
            try {
                // 编码路径
                const encodedPath = encodeURIComponent(fullPath);
                const url = `${serverUrl}/open?action=${action}&path=${encodedPath}`;
                
                // 发送请求到Python服务器
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.status === "success") {
                    console.log(data.message);
                } else {
                    console.error(data.message);
                    alert(data.message);
                }
            } catch (error) {
                console.error("请求失败:", error);
                alert(`请求失败: ${error.message}\n请确保Python服务器正在运行。`);
            }
        } else {
            console.log("无法处理: 该媒体文件不是本地Windows路径");
            alert("无法处理: 该媒体文件不是本地Windows路径");
        }
    }

    // 检查是否显示按钮的条件
    function showFlag() {
        let mediaInfoDiv = document.querySelector(selectors.embyMediaInfoDiv);
        if (!isEmby) {
            mediaInfoDiv = document.querySelector(selectors.jellfinMediaInfoDiv);
        }
        return !!mediaInfoDiv;
    }

    // 监听DOM变化
    document.addEventListener("viewbeforeshow", function (e) {
        console.log("viewbeforeshow", e);
        if (isEmby === "") {
            isEmby = !!e.detail.contextPath;
        }
        let isItemDetailPage;
        if (isEmby) {
            isItemDetailPage = e.detail.contextPath.startsWith("/item?id=");
        } else {
            isItemDetailPage = e.detail.params && e.detail.params.id;
        }
        if (isItemDetailPage) {
            const mutation = new MutationObserver(function() {
                if (showFlag()) {
                    init();
                    mutation.disconnect();
                }
            })
            mutation.observe(document.body, {
                childList: true,
                characterData: true,
                subtree: true,
            })
        }
    });
})();
