(e => {
    "use strict";
    e.BookmarkHelper = function (t) {
        this.removeEntry = a => new Promise(l => {
            const r = t.helper.entry.getDataById(a);
            r && r.url ? (Object.values(t.elm.bookmarkBox).some(a => {
                if (a.hasClass(e.cl.active)) {
                    const l = a.find("a[" + e.attr.id + "='" + r.id + "']");
                    l.data("restore", r);
                    const o = e("<span />").addClass(e.cl.sidebar.removeMask).append("<em>" + t.helper.i18n.get("sidebar_deleted") + "</em>").append("<span>" + t.helper.i18n.get("sidebar_undo_deletion") + "</span>").appendTo(l);
                    return e.delay(100).then(() => {
                        l.addClass(e.cl.sidebar.removed), o.children("span")[0].offsetTop > 0 && o.children("em").remove()
                    }), !0
                }
            }), this.performDeletion(r).then(l)) : (t.helper.overlay.create("delete", t.helper.i18n.get("contextmenu_delete_dir"), r), l())
        }), this.editEntry = e => new Promise(a => {
            const l = t.helper.model.getData("u/additionalInfo");
            l[e.id] = {
                desc: e.additionalInfo
            }, Promise.all([t.helper.model.call("updateBookmark", {
                id: e.id,
                title: e.title,
                url: e.url,
                preventReload: !0
            }), t.helper.model.setData({
                "u/additionalInfo": l
            })]).then(a)
        }), this.restoreEntry = a => new Promise(l => {
            if (a && a.length() > 0) {
                const r = a.data("restore");
                a.removeClass(e.cl.sidebar.removed).addClass(e.cl.sidebar.restored), e.delay(500).then(() => (a.children("span." + e.cl.sidebar.removeMask).remove(), t.helper.model.call("createBookmark", r))).then(l => {
                    const o = [];
                    if (l && l.created) {
                        a.attr(e.attr.id, l.created);
                        const i = t.helper.model.getData("u/additionalInfo");
                        i[r.id] && (i[l.created] = i[r.id], o.push(t.helper.model.setData({
                            "u/additionalInfo": i
                        })))
                    }
                    return o.push(t.helper.entry.init()), Promise.all(o)
                }).then(() => {
                    l()
                })
            } else l()
        }), this.performDeletion = (e, a = !1) => new Promise(l => {
            t.helper.model.call("deleteBookmark", {
                id: e.id,
                preventReload: a
            }).then(() => {
                l()
            })
        }), this.pinEntry = e => new Promise(l => {
            const r = t.helper.model.getData("u/pinnedEntries");
            let o = -1;
            Object.values(r).forEach(e => {
                o = Math.max(o, e.index)
            }), r[e.id] = {
                index: o + 1
            }, a(r).then(l)
        }), this.unpinEntry = e => new Promise(l => {
            const r = t.helper.model.getData("u/pinnedEntries");
            delete r[e.id], a(r).then(l)
        }), this.reorderPinnedEntries = e => new Promise(l => {
            const r = t.helper.model.getData("u/pinnedEntries");
            let o = 0;
            if (e.prevId) {
                const a = t.helper.entry.getDataById(e.prevId);
                o = a.pinnedIndex + 1
            }
            Object.keys(r).forEach(a => {
                +a == +e.id ? (r[a].index = o, t.helper.entry.addData(a, "pinnedIndex", o)) : r[a].index >= o && (r[a].index++, t.helper.entry.addData(a, "pinnedIndex", r[a].index))
            }), a(r).then(l)
        });
        const a = e => new Promise(a => {
            Promise.all([t.helper.model.call("removeCache", {
                name: "htmlList"
            }), t.helper.model.call("removeCache", {
                name: "htmlPinnedEntries"
            }), t.helper.model.setData({
                "u/pinnedEntries": e
            })]).then(a)
        })
    }, e.CheckboxHelper = function (t) {
        const a = {};
        this.get = (t, a, l = "checkbox", r = "default") => {
            const i = e("<div />").html("<input type='checkbox' />").data("uid", Math.random().toString(36).substr(2, 12)).attr(e.attr.type, l).attr(e.attr.style, r).addClass(e.cl.checkbox.box);
            return a && (i.children("input[type='checkbox']").attr(a), a[e.attr.name] && i.attr(e.attr.name, a[e.attr.name])), this.isChecked(i) && i.addClass(e.cl.active), o(i, t), i
        }, this.isChecked = e => e.find("input[type='checkbox']")[0].checked;
        const l = (a, l) => {
                const r = a.children("input[type='checkbox']");
                r.trigger("change"), t.helper.utility && t.helper.utility.triggerEvent("checkboxChanged", {
                    container: a,
                    checkbox: r,
                    checked: a.hasClass(e.cl.active)
                }, l.document()[0])
            },
            r = (t, o) => {
                t.addClass(e.cl.checkbox.clicked), t.removeClass(e.cl.checkbox.focus), t.toggleClass(e.cl.active);
                const i = t.hasClass(e.cl.active),
                    n = t.children("input[type='checkbox']");
                if ("radio" === t.attr(e.attr.type) && t.attr(e.attr.name))
                    if (o) {
                        const a = t.attr(e.attr.name);
                        t.addClass(e.cl.active), i && (n.attr("checked", !0), l(t, o)), o.find("div." + e.cl.checkbox.box + "[" + e.attr.type + "='radio'][" + e.attr.name + "='" + a + "']").forEach(a => {
                            const l = e(a);
                            a !== t[0] && this.isChecked(l) && r(l)
                        })
                    } else n.attr("checked", !1);
                else n.attr("checked", i), l(t, o);
                const s = t.data("uid");
                a[s] && clearTimeout(a[s]), a[s] = setTimeout(() => {
                    t.removeClass(e.cl.checkbox.clicked)
                }, 300)
            },
            o = (t, a) => {
                t.on("mousedown", t => {
                    t.preventDefault(), t.stopPropagation(), e(t.currentTarget).addClass(e.cl.checkbox.focus)
                }).on("click", t => {
                    t.preventDefault(), t.stopPropagation(), r(e(t.currentTarget), a)
                }), a.on("click", () => {
                    t.removeClass(e.cl.checkbox.focus)
                })
            }
    }, e.ContextmenuHelper = function (t) {
        let a = null,
            l = 0,
            r = null;
        const o = {};
        this.create = (r, o) => {
            const p = t.helper.model.getData(["b/sidebarPosition", "a/styles"]);
            if (a = p.sidebarPosition, p.styles && p.styles.sidebarWidth && (l = parseInt(p.styles.sidebarWidth)), t.helper.toggle.addSidebarHoverClass(), t.helper.tooltip.close(), i(r, o)) "menu" !== r && "sort" !== r || this.close();
            else {
                this.close(), o.addClass(e.cl.active);
                const a = e("<div />").addClass(e.cl.contextmenu.wrapper).html("<ul class='" + e.cl.contextmenu.list + "'></ul><ul class='" + e.cl.contextmenu.icons + "'></ul>").attr(e.attr.type, r).data("elm", o).appendTo(t.elm.sidebar);
                let l = r;
                const i = o.attr(e.attr.id);
                switch (i && a.attr(e.attr.id, i), r) {
                    case "list": {
                        c(a, o);
                        const e = t.helper.entry.getDataById(i);
                        l = e && e.isDir ? "directory" : "bookmark";
                        break
                    }
                    case "separator":
                        d(a, o);
                        break;
                    case "menu":
                        s(a, o);
                        break;
                    case "sort":
                        n(a, o)
                }
                u(a), h(a, o, r), e.delay().then(() => {
                    a.addClass(e.cl.visible)
                })
            }
        }, this.close = () => {
            const a = t.elm.iframeBody.find("div." + e.cl.contextmenu.wrapper);
            a.forEach(t => {
                e(t).removeClass(e.cl.visible), e(t).data("elm").removeClass(e.cl.active)
            }), e.delay(500).then(() => {
                a.remove(), t.helper.toggle.removeSidebarHoverClass()
            })
        };
        const i = (a, l) => {
                const r = l.attr(e.attr.id),
                    o = l.attr(e.attr.value);
                let i = "div." + e.cl.contextmenu.wrapper + "[" + e.attr.type + "='" + a + "']";
                return r ? i += "[" + e.attr.id + "='" + r + "']" : o && (i += "[" + e.attr.value + "='" + o + "']"), t.elm.sidebar.find(i).length() > 0
            },
            n = a => {
                const l = t.helper.utility.getSortList(),
                    r = t.helper.list.getSort(),
                    o = a.children("ul." + e.cl.contextmenu.list);
                a.children("ul." + e.cl.contextmenu.icons).remove(), Object.keys(l).forEach(l => {
                    const i = l.replace(/([A-Z])/g, "_$1").toLowerCase();
                    e("<li />").append(t.helper.checkbox.get(t.elm.iframeBody, {
                        [e.attr.name]: "sort",
                        [e.attr.value]: l
                    }, "radio")).append("<a " + e.attr.name + "='sort'>" + t.helper.i18n.get("sort_label_" + i) + "</a>").appendTo(o), l === r.name && a.find("input[" + e.attr.name + "='sort'][" + e.attr.value + "='" + l + "']").parent("div." + e.cl.checkbox.box).trigger("click")
                })
            },
            s = a => {
                const l = a.children("ul." + e.cl.contextmenu.list),
                    r = a.children("ul." + e.cl.contextmenu.icons);
                e("<li />").append(t.helper.checkbox.get(t.elm.iframeBody, {
                    [e.attr.name]: "toggleHidden"
                })).append("<a " + e.attr.name + "='toggleHidden'>" + t.helper.i18n.get("contextmenu_toggle_hidden") + "</a>").appendTo(l), t.helper.model.getData("u/showHidden") && a.find("input[" + e.attr.name + "='toggleHidden']").parent("div." + e.cl.checkbox.box).trigger("click"), e("<li />").append("<a " + e.attr.name + "='reload'>" + t.helper.i18n.get("contextmenu_reload_sidebar") + "</a>").appendTo(l);
                const o = t.elm.bookmarkBox.all.children("ul"),
                    i = o.hasClass(e.cl.sidebar.hideRoot);
                let n = !1;
                o.find("a." + e.cl.sidebar.dirOpened).forEach(t => {
                    if (!1 === i || e(t).parents("li").length() > 1) return n = !0, !1
                }), n && e("<li />").append("<a " + e.attr.name + "='closeAll'>" + t.helper.i18n.get("contextmenu_close_all_directories") + "</a>").appendTo(l), r.append("<li><a " + e.attr.name + "='settings' title='" + t.helper.i18n.get("settings_title", null, !0) + "'></a></li>").append("<li><a " + e.attr.name + "='bookmarkManager' title='" + t.helper.i18n.get("contextmenu_bookmark_manager", null, !0) + "'></a></li>").append("<li class='" + e.cl.contextmenu.right + "'><a " + e.attr.name + "='keyboardShortcuts' title='" + t.helper.i18n.get("contextmenu_keyboard_shortcuts", null, !0) + "'></a></li>")
            },
            d = (a, l) => {
                const r = l.attr(e.attr.id),
                    o = t.helper.entry.getDataById(r);
                if (o && o.parents && o.parents.length > 0) {
                    const l = a.children("ul." + e.cl.contextmenu.list);
                    l.append("<li><a " + e.attr.name + "='edit'>" + t.helper.i18n.get("contextmenu_edit_separator") + "</a></li>"), l.append("<li><a " + e.attr.name + "='delete'>" + t.helper.i18n.get("contextmenu_delete_separator") + "</a></li>")
                }
                a.children("ul." + e.cl.contextmenu.icons).remove()
            },
            c = (a, l) => {
                const r = l.attr(e.attr.id),
                    o = t.helper.entry.getDataById(r);
                if (o) {
                    const i = o.isDir ? "_dir" : "_bookmark",
                        n = a.children("ul." + e.cl.contextmenu.list),
                        s = a.children("ul." + e.cl.contextmenu.icons);
                    if (t.helper.search.isResultsVisible() && n.append("<li><a " + e.attr.name + "='showInDir'>" + t.helper.i18n.get("contextmenu_show_in_dir") + "</a></li>"), o.isDir) {
                        const a = o.children.filter(e => e.url && "about:blank" !== e.url);
                        n.append("<li><a " + e.attr.name + "='add' " + e.attr.type + "='bookmark'>" + t.helper.i18n.get("contextmenu_add_bookmark") + "</a></li>"), a.length > 0 && n.append("<li><a " + e.attr.name + "='openChildren'>" + t.helper.i18n.get("contextmenu_open_children") + " <span>(" + a.length + ")</span></a></li>"), o.children.length > 0 && n.append("<li><a " + e.attr.name + "='checkBookmarks'>" + t.helper.i18n.get("contextmenu_check_bookmarks") + "</a></li>")
                    } else n.append("<li><a " + e.attr.name + "='newTab'>" + t.helper.i18n.get("contextmenu_new_tab") + "</a></li>"), n.append("<li><a " + e.attr.name + "='newWindow'>" + t.helper.i18n.get("contextmenu_new_window") + "</a></li>"), !1 === chrome.extension.inIncognitoContext && n.append("<li><a " + e.attr.name + "='newIncognito'>" + t.helper.i18n.get("contextmenu_new_tab_incognito") + "</a></li>");
                    if (s.append("<li><a " + e.attr.name + "='infos' title='" + t.helper.i18n.get("contextmenu_infos", null, !0) + "'></a></li>"), o.parents.length > 0 && s.append("<li><a " + e.attr.name + "='edit' title='" + t.helper.i18n.get("contextmenu_edit" + i, null, !0) + "'></a></li>").append("<li><a " + e.attr.name + "='delete' title='" + t.helper.i18n.get("contextmenu_delete" + i, null, !0) + "'></a></li>"), o.isDir) {
                        const a = e("<li />").html("<a " + e.attr.name + "='add' title='" + t.helper.i18n.get("contextmenu_add", null, !0) + "'></a>").appendTo(s);
                        e("<ul />").attr(e.attr.name, "add").append("<li><a " + e.attr.type + "='bookmark' title='" + t.helper.i18n.get("overlay_label_bookmark", null, !0) + "'></a></li>").append("<li><a " + e.attr.type + "='dir' title='" + t.helper.i18n.get("overlay_label_dir", null, !0) + "'></a></li>").append("<li><a " + e.attr.type + "='separator' title='" + t.helper.i18n.get("overlay_label_separator", null, !0) + "'></a></li>").appendTo(a)
                    } else o.pinned ? s.append("<li><a " + e.attr.name + "='unpin' title='" + t.helper.i18n.get("contextmenu_unpin", null, !0) + "'></a></li>") : s.append("<li><a " + e.attr.name + "='pin' title='" + t.helper.i18n.get("contextmenu_pin", null, !0) + "'></a></li>");
                    t.helper.entry.isVisible(r) ? s.append("<li class='" + e.cl.contextmenu.right + "'><a " + e.attr.name + "='hide' title='" + t.helper.i18n.get("contextmenu_hide_from_sidebar", null, !0) + "'></a></li>") : !1 === t.helper.search.isResultsVisible() && l.parents("li." + e.cl.hidden).length() <= 1 && s.append("<li class='" + e.cl.contextmenu.right + "'><a " + e.attr.name + "='showHidden' title='" + t.helper.i18n.get("contextmenu_show_in_sidebar", null, !0) + "'></a></li>")
                }
            },
            h = (r, o, i) => {
                const n = r.realWidth(),
                    s = r.realHeight(),
                    d = o[0].getBoundingClientRect(),
                    c = d.top + d.height;
                if (c + s >= window.innerHeight ? r.css("top", c - s).addClass(e.cl.contextmenu.top) : r.css("top", c + "px"), "sort" !== i && "menu" !== i) {
                    const e = {
                        left: o.parent("li")[0].offsetLeft,
                        right: "auto"
                    };
                    t.helper.i18n.isRtl() ? (e.left = d.width - n, "left" === a && e.left < 0 && (e.left = 0)) : "right" === a && e.left + n > l && (e.left = "auto", e.right = 0), ["left", "right"].forEach(t => {
                        "number" == typeof e[t] && (e[t] += "px"), r.css(t, e[t])
                    })
                }
            };
        o.settings = () => {
            t.helper.model.call("openLink", {
                href: chrome.extension.getURL("html/settings.html"),
                newTab: !0
            })
        }, o.checkbox = t => {
            t.eventObj.stopPropagation(), e(t.elm).prev("div." + e.cl.checkbox.box).trigger("click")
        }, o.bookmarkManager = () => {
            t.helper.model.call("openLink", {
                href: "chrome://bookmarks",
                newTab: !0,
                active: !0
            })
        }, o.newIncognito = e => {
            e.data && t.helper.utility.openUrl(e.data, "incognito")
        }, o.newWindow = e => {
            e.data && (t.helper.utility.openUrl(e.data, "newWindow"), t.helper.toggle.closeSidebar())
        }, o.newTab = e => {
            if (e.data) {
                const a = "foreground" === t.helper.model.getData("b/newTab");
                e.data.reopenSidebar = t.helper.model.getData("b/reopenSidebar"), t.helper.utility.openUrl(e.data, "newTab", a), a && t.helper.toggle.closeSidebar()
            }
        }, o.delete = e => {
            t.helper.bookmark.removeEntry(e.data.id)
        }, o.showHidden = e => {
            t.startLoading();
            const a = t.helper.model.getData("u/hiddenEntries");
            delete a[e.id], t.helper.model.setData({
                "u/hiddenEntries": a
            }).then(() => Promise.all([t.helper.model.call("removeCache", {
                name: "htmlList"
            }), t.helper.model.call("removeCache", {
                name: "htmlPinnedEntries"
            })])).then(() => {
                t.helper.model.call("reload", {
                    type: "Hide"
                })
            })
        }, o.openChildren = e => {
            if (e.data) {
                const a = e.data.children.filter(e => e.url && "about:blank" !== e.url);
                a.length > t.helper.model.getData("b/openChildrenWarnLimit") ? t.helper.overlay.create(e.name, t.helper.i18n.get("contextmenu_open_children"), e.data) : t.helper.utility.openAllBookmarks(a)
            }
        }, o.pin = e => {
            t.helper.bookmark.pinEntry(e.data).then(() => {
                t.helper.model.call("reload", {
                    type: "Pin"
                })
            })
        }, o.unpin = e => {
            t.helper.bookmark.unpinEntry(e.data).then(() => {
                t.helper.model.call("reload", {
                    type: "Unpin"
                })
            })
        }, o.showInDir = a => {
            const l = t.helper.entry.getDataById(a.id);
            if (l && l.parents) {
                const r = o => {
                    if (l.parents[o]) {
                        const a = t.elm.bookmarkBox.all.find("ul > li > a." + e.cl.sidebar.bookmarkDir + "[" + e.attr.id + "='" + l.parents[o] + "']");
                        a.hasClass(e.cl.sidebar.dirOpened) ? r(o + 1) : t.helper.list.toggleBookmarkDir(a, !0, !1).then(() => {
                            r(o + 1)
                        })
                    } else Promise.all([t.helper.list.cacheList(), t.helper.search.clearSearch()]).then(() => {
                        const l = t.elm.bookmarkBox.all.find("ul > li > a[" + e.attr.id + "='" + a.id + "']");
                        t.helper.scroll.setScrollPos(t.elm.bookmarkBox.all, l[0].offsetTop - 50), l.addClass(e.cl.sidebar.mark)
                    })
                };
                r(0)
            }
        }, o.reload = () => {
            t.helper.model.call("reload", {
                type: "Force"
            })
        }, o.closeAll = () => {
            const a = t.elm.bookmarkBox.all.children("ul"),
                l = a.hasClass(e.cl.sidebar.hideRoot),
                r = [];
            a.find("a." + e.cl.sidebar.dirOpened).forEach(a => {
                (!1 === l || e(a).parents("li").length() > 1) && r.push(t.helper.list.toggleBookmarkDir(e(a), !1, !1))
            }), Promise.all(r).then(() => {
                t.helper.list.cacheList()
            })
        };
        const p = t => {
                r && clearTimeout(r), t.find("ul[" + e.attr.name + "='add']").addClass(e.cl.visible)
            },
            m = t => {
                r && clearTimeout(r), r = setTimeout(() => {
                    t.find("ul[" + e.attr.name + "='add']").removeClass(e.cl.visible)
                }, 300)
            },
            u = a => {
                a.find("input[" + e.attr.name + "='sort']").on("change", a => {
                    if (a.currentTarget.checked) {
                        const l = e(a.currentTarget).attr(e.attr.value);
                        t.helper.list.updateSort(l), this.close()
                    }
                }), a.find("input[" + e.attr.name + "='toggleHidden']").on("change", a => {
                    t.startLoading(), Promise.all([t.helper.model.call("removeCache", {
                        name: "htmlList"
                    }), t.helper.model.call("removeCache", {
                        name: "htmlPinnedEntries"
                    }), t.helper.model.setData({
                        "u/showHidden": t.helper.checkbox.isChecked(e(a.currentTarget).parent("div"))
                    })]).then(() => {
                        t.helper.model.call("reload", {
                            type: "ToggleHidden"
                        })
                    }), this.close()
                }), a.on("mouseleave", t => {
                    e(t.currentTarget).find("a").removeClass(e.cl.hover)
                }), a.find("ul[" + e.attr.name + "='add']").on("mouseenter", () => {
                    p(a)
                }).on("mouseleave", () => {
                    m(a)
                }), a.find("> ul > li > a").on("mouseenter", t => {
                    const l = e(t.currentTarget);
                    a.find("a").removeClass(e.cl.hover), l.addClass(e.cl.hover), l.parents("ul." + e.cl.contextmenu.icons).length() > 0 && "add" === l.attr(e.attr.name) && p(a)
                }).on("mouseleave", t => {
                    e(t.currentTarget).removeClass(e.cl.hover), m(a)
                }), a.find("a").on("click", l => {
                    l.preventDefault();
                    let r = l.currentTarget;
                    const i = e(r).parents("ul").eq(0).prev("a");
                    i.length() > 0 && (r = i);
                    const n = {
                        elm: r,
                        eventObj: l,
                        name: e(r).attr(e.attr.name),
                        id: a.attr(e.attr.id)
                    };
                    n.data = n.id ? t.helper.entry.getDataById(n.id) : {}, n.data.overlayType = e(l.currentTarget).attr(e.attr.type), "sort" !== n.name && "toggleHidden" !== n.name || (n.name = "checkbox"), "function" == typeof o[n.name] ? o[n.name](n) : t.helper.overlay.create(n.name, e(n.elm).attr("title") || e(n.elm).text(), n.data)
                })
            }
    }, e.DragDropHelper = function (t) {
        let a = null,
            l = !1,
            r = null,
            o = 0,
            i = null;
        const n = {
            running: !1,
            posY: null,
            previousDelta: 0,
            fpsLimit: 30
        };
        this.init = async () => {
            a = t.helper.model.getData("b/sidebarPosition"), l = t.helper.model.getData("b/dndCreationDialog"), g(), d()
        }, this.cancel = () => {
            const a = t.elm.iframeBody.children("a." + e.cl.drag.helper),
                l = t.elm.bookmarkBox.all.find("li." + e.cl.drag.dragInitial),
                r = a.data("elm");
            r && r.insertAfter(l).removeClass(e.cl.drag.isDragged), l.remove(), a.remove(), t.elm.iframeBody.removeClass([e.cl.drag.isDragged, e.cl.drag.cancel]), e.delay(500).then(() => {
                t.helper.toggle.removeSidebarHoverClass()
            })
        };
        const s = e => {
                let l = 0;
                if ("object" == typeof e) {
                    l = e[0].getBoundingClientRect().left
                } else l = +e;
                return "right" === a && (l = window.innerWidth - l), "object" == typeof e ? .6 * e.realWidth() + l > t.elm.sidebar.realWidth() : l > t.elm.sidebar.realWidth()
            },
            d = async () => {
                t.elm.iframeBody.on("dragenter", () => {
                    t.helper.contextmenu.close(), t.helper.tooltip.close(), t.elm.iframeBody.addClass(e.cl.drag.isDragged), t.helper.toggle.addSidebarHoverClass(), n.running || window.requestAnimationFrame(h)
                }).on("drop dragend", a => {
                    if (a.preventDefault(), a.stopPropagation(), n.posY = null, t.elm.iframeBody.hasClass(e.cl.drag.isDragged)) {
                        if (!s(a.pageX) && !1 === t.helper.search.isResultsVisible()) {
                            const r = t.elm.bookmarkBox.all.find("li." + e.cl.drag.isDragged).eq(0);
                            if (r && r.length() > 0) {
                                const o = a.dataTransfer.getData("URL");
                                let i = a.dataTransfer.getData("text/plain");
                                if (location.href === o) i = e(document).find("head > title").eq(0).text();
                                else if (i === o) {
                                    const t = a.dataTransfer.getData("text/html");
                                    i = t && t.length > 0 ? e("<div />").html(t).text() : ""
                                }
                                const n = {
                                        index: r.prevAll("li").length(),
                                        parentId: r.parent("ul").prev("a").attr(e.attr.id),
                                        title: i.trim(),
                                        url: o
                                    },
                                    s = () => {
                                        t.helper.overlay.create("add", t.helper.i18n.get("contextmenu_add"), {
                                            values: n
                                        })
                                    };
                                !1 === l && n.title && n.url ? t.helper.model.call("createBookmark", n).then(e => {
                                    e.error && s()
                                }) : s()
                            }
                        }
                        t.elm.iframeBody.removeClass([e.cl.drag.isDragged, e.cl.drag.cancel]), t.helper.toggle.removeSidebarHoverClass()
                    }
                })
            }, c = t => {
                let a = "bookmark";
                return "selection" === t ? a = t : t.data("type") ? a = t.data("type") : (t.hasClass(e.cl.sidebar.bookmarkDir) ? a = "directory" : t.parents("div." + e.cl.sidebar.entryPinned).length() > 0 && (a = "pinned"), t.data("type", a)), a
            }, h = e => {
                window.requestAnimationFrame(h);
                const a = e - n.previousDelta;
                if (!(n.fpsLimit && a < 1e3 / n.fpsLimit)) {
                    if (null !== n.posY) {
                        const e = t.elm.bookmarkBox.all[0].offsetTop,
                            a = t.elm.bookmarkBox.all[0].offsetHeight,
                            l = t.helper.scroll.getScrollPos(t.elm.bookmarkBox.all);
                        let r = null;
                        n.posY - e < 60 ? r = l - Math.pow((50 - n.posY + e) / 10, 2) : n.posY + 60 > a && (r = l + Math.pow((n.posY + 50 - a) / 10, 2)), r && t.helper.scroll.setScrollPos(t.elm.bookmarkBox.all, r)
                    }
                    n.previousDelta = e
                }
            }, p = () => {
                m();
                const a = t.elm.iframeBody.children("a." + e.cl.drag.helper),
                    l = t.elm.bookmarkBox.all.find("li." + e.cl.drag.dragInitial),
                    r = a.data("elm"),
                    o = r.children("a"),
                    i = c(o);
                if (s(a)) this.cancel();
                else {
                    a.addClass(e.cl.drag.snap);
                    const o = r.parent("ul").prev("a").attr(e.attr.id);
                    let n = 0;
                    r.prevAll("li").forEach(e => {
                        e !== l && n++
                    }), "pinned" === i ? t.helper.bookmark.reorderPinnedEntries({
                        id: r.children("a").attr(e.attr.id),
                        prevId: r.prev("li").children("a").attr(e.attr.id)
                    }) : t.helper.model.call("moveBookmark", {
                        id: r.children("a").attr(e.attr.id),
                        parentId: o,
                        index: n
                    }), t.elm.iframeBody.removeClass(e.cl.drag.isDragged), e.delay().then(() => {
                        const t = r[0].getBoundingClientRect();
                        return a.css({
                            top: t.top + "px",
                            left: t.left + "px"
                        }), e.delay(200)
                    }).then(() => (r.removeClass(e.cl.drag.isDragged), l.remove(), a.remove(), e.delay(300))).then(() => {
                        t.helper.toggle.removeSidebarHoverClass()
                    })
                }
            }, m = (t = null) => {
                null === i || null !== t && i.id === t.attr(e.attr.id) || (i.elm.removeClass(e.cl.drag.dragHover), clearTimeout(i.instance), i = null)
            }, u = (a, l, d) => {
                let h = null,
                    p = null,
                    u = 0,
                    g = 0;
                if ("dragover" === a) {
                    if (g = l, (u = d - 20) === o) return !1;
                    o = u, t.elm.bookmarkBox.all.find("li." + e.cl.drag.isDragged).remove(), p = e("<li />").html("<a>&nbsp;</a>").addClass(e.cl.drag.isDragged)
                } else {
                    const a = (h = t.elm.iframeBody.children("a." + e.cl.drag.helper)).data("startPos");
                    u = d - a.top, g = l - a.left, h.css({
                        top: u + "px",
                        left: g + "px"
                    }), p = h.data("elm")
                }
                if (s(h || g)) return m(), t.elm.iframeBody.addClass(e.cl.drag.cancel), !1;
                t.elm.iframeBody.removeClass(e.cl.drag.cancel);
                let b = {
                    elm: null
                };
                const f = c(p.children("a"));
                let v = null;
                if ("pinned" === f ? v = [t.elm.pinnedBox.find("> ul > li")] : (n.posY = d, v = [t.elm.bookmarkBox.all.find("a." + e.cl.sidebar.dirOpened + " + ul > li"), t.elm.bookmarkBox.all.find("> ul > li > a." + e.cl.sidebar.dirOpened).parent("li")]), v.some(t => {
                        t && t.forEach(t => {
                            const a = e(t);
                            if (a[0] !== p[0] && !a.hasClass(e.cl.drag.dragInitial)) {
                                const e = a[0].getBoundingClientRect(),
                                    t = u - e.top;
                                if (e.top > u) return !1;
                                (null === b.elm || b.diff > t) && (b = {
                                    elm: a,
                                    height: a[0].offsetHeight,
                                    diff: t
                                })
                            }
                        })
                    }), b.elm && b.elm !== r) {
                    r = b.elm;
                    const a = b.elm.children("a").eq(0),
                        l = a.hasClass(e.cl.sidebar.bookmarkDir),
                        o = b.diff / b.height * 100;
                    if (m(a), 0 === b.elm.nextAll("li:not(." + e.cl.drag.isDragged + ")").length() && o > 80) {
                        const e = b.elm.parents("li").eq(0);
                        if (h && e.parents("ul")[0] !== t.elm.bookmarkBox.all.find("> ul")[0]) {
                            const t = p.insertAfter(e);
                            h.data("elm", t)
                        }
                    } else if (l && o < 60) {
                        if (a.hasClass(e.cl.sidebar.dirOpened)) {
                            const e = p.prependTo(a.next("ul"));
                            h && h.data("elm", e)
                        } else if (a.hasClass(e.cl.sidebar.dirAnimated)) 0 === a.next("ul").length() && (a.addClass(e.cl.sidebar.dirOpened), e("<ul />").insertAfter(a));
                        else if (null === i) {
                            i = {
                                id: a.attr(e.attr.id),
                                elm: a.addClass(e.cl.drag.dragHover)
                            };
                            const l = t.helper.model.getData("b/dndOpenDirDelay");
                            i.instance = setTimeout(() => {
                                t.helper.list.toggleBookmarkDir(a)
                            }, 1e3 * +l)
                        }
                    } else {
                        m();
                        const e = p.insertAfter(b.elm);
                        h && h.data("elm", e)
                    }
                } else if ("pinned" === f) {
                    const e = p.prependTo(t.elm.pinnedBox.children("ul"));
                    h && h.data("elm", e)
                }
            }, g = async () => {
                t.elm.bookmarkBox.all.on("mousedown", "span." + e.cl.drag.trigger, a => {
                    t.helper.toggle.addSidebarHoverClass(), ((a, l, r) => {
                        t.helper.contextmenu.close(), t.helper.tooltip.close();
                        const o = e(a).parent("a").removeClass(e.cl.sidebar.dirOpened),
                            i = t.helper.entry.getDataById(o.attr(e.attr.id));
                        if (null === i) return !1;
                        const s = o.parent("li"),
                            d = s.parent("ul").prev("a");
                        t.elm.iframeBody.addClass(e.cl.drag.isDragged), s.clone().addClass(e.cl.drag.dragInitial).insertAfter(s);
                        const c = o.clone().appendTo(t.elm.iframeBody),
                            p = o[0].getBoundingClientRect();
                        let m = 0;
                        s.prevAll("li").forEach(t => {
                            e(t).hasClass(e.cl.drag.dragInitial) || m++
                        }), c.removeAttr("title").css({
                            top: p.top + "px",
                            left: p.left + "px",
                            width: o.realWidth() + "px"
                        }).data({
                            elm: s,
                            isDir: !!i.isDir,
                            parentId: d.length() > 0 ? d.attr(e.attr.id) : null,
                            index: m,
                            startPos: {
                                top: r - p.top,
                                left: l - p.left
                            }
                        }).addClass(e.cl.drag.helper), s.addClass(e.cl.drag.isDragged), n.running || window.requestAnimationFrame(h)
                    })(a.currentTarget, a.pageX, a.pageY), u(a.type, a.pageX, a.pageY)
                }), t.elm.iframeBody.on("mouseup", a => {
                    n.posY = null, t.elm.iframeBody.hasClass(e.cl.drag.isDragged) && (a.preventDefault(), a.stopPropagation(), 1 === a.which ? p() : e.delay(0).then(() => {
                        this.cancel()
                    }))
                }), t.elm.iframeBody.on("wheel", a => {
                    if (t.elm.iframeBody.hasClass(e.cl.drag.isDragged)) {
                        a.preventDefault(), a.stopPropagation();
                        const e = t.elm.bookmarkBox.all[0].scrollTop;
                        t.helper.scroll.setScrollPos(t.elm.bookmarkBox.all, e - a.wheelDelta, 300)
                    }
                }), t.elm.iframeBody.on("mousemove dragover", a => {
                    t.elm.iframeBody.hasClass(e.cl.drag.isDragged) && 1 === a.which && (a.preventDefault(), a.stopPropagation(), u(a.type, a.pageX, a.pageY))
                }), t.elm.iframeBody.on("contextmenu", "a." + e.cl.drag.helper, e => {
                    e.preventDefault(), e.stopPropagation()
                })
            }
    }, e.EntryHelper = function (e) {
        let t = !1,
            a = {},
            l = {},
            r = {},
            o = {
                bookmarks: {},
                directories: {},
                pinned: {}
            };
        this.init = e => (t = !0, new Promise(t => {
            this.update(e).then(t)
        })), this.initOnce = () => new Promise(e => {
            t ? e() : this.init().then(e)
        }), this.getAmount = t => {
            if (i(), 0 === Object.keys(a).length && (a = e.helper.model.getData("u/entryAmounts")), a && a[t]) {
                let e = a[t].visible;
                return l.showHidden && (e += a[t].hidden), e
            }
            return null
        }, this.getAllDataByType = e => Object.values(o[e] || {}), this.getDataById = e => {
            let t = null;
            return "object" == typeof o.bookmarks[e] ? (t = o.bookmarks[e], "object" == typeof o.pinned[e] && (t.pinnedIndex = o.pinned[e].index)) : "object" == typeof o.directories[e] && (t = o.directories[e]), t
        }, this.getParentsById = e => {
            const t = [];
            try {
                this.getDataById(e).parentId;
                for (; parentId;) {
                    const e = this.getDataById(parentId);
                    e && t.push(e), parentId = e && e.parentId ? e.parentId : null
                }
            } catch (e) {}
            return t
        }, this.addData = (e, t, a) => {
            "object" == typeof o.bookmarks[e] ? ("pinnedIndex" === t && "object" == typeof o.pinned[e] && (o.pinned[e].index = a), o.bookmarks[e][t] = a) : "object" == typeof o.directories[e] && (o.directories[e][t] = a)
        }, this.isSeparator = e => {
            let t = !1;
            return "object" == typeof o.bookmarks[e] && (t = "about:blank" === o.bookmarks[e].url && /^[-_]{3,}/.test(o.bookmarks[e].title) && /[-_]{3,}$/.test(o.bookmarks[e].title)), t
        }, this.isVisible = e => {
            let t = !1;
            return "object" == typeof o.bookmarks[e] ? t = !1 === o.bookmarks[e].hidden : "object" == typeof o.directories[e] && (t = !1 === o.directories[e].hidden), t
        }, this.update = (t = null) => new Promise(l => {
            i();
            const s = [e.helper.model.call("viewAmounts")];
            null === t && s.push(e.helper.model.call("bookmarks", {
                id: 0
            })), Promise.all(s).then(i => {
                r = i[0], null === t && i[1] && i[1].bookmarks && i[1].bookmarks[0] && i[1].bookmarks[0].children && (t = i[1].bookmarks[0].children), o = {
                    bookmarks: {},
                    directories: {},
                    pinned: {}
                }, a = {
                    bookmarks: {
                        visible: 0,
                        hidden: 0
                    },
                    directories: {
                        visible: 0,
                        hidden: 0
                    },
                    pinned: {
                        visible: 0,
                        hidden: 0
                    }
                }, n(t), e.helper.model.setData({
                    "u/entryAmounts": a
                }), l()
            })
        });
        const i = () => {
                l = e.helper.model.getData(["u/hiddenEntries", "u/additionalInfo", "u/pinnedEntries", "u/showHidden"])
            },
            n = (e, t = [], a = !1) => {
                e.forEach(e => {
                    const o = [...t];
                    "0" !== e.parentId && o.push(e.parentId), e.additionalInfo = l.additionalInfo[e.id] || {}, e.hidden = a || !0 === l.hiddenEntries[e.id], e.parents = o, e.views = {
                        startDate: +new Date(Math.max(e.dateAdded, r.counterStartDate)),
                        total: 0
                    }, e.url ? d(e) : e.children && s(e)
                })
            },
            s = e => {
                e.childrenAmount = {
                    bookmarks: 0,
                    directories: 0,
                    total: 0
                }, e.parents.forEach(e => {
                    o.directories[e].childrenAmount.directories++
                }), o.directories[e.id] = e, n(e.children, e.parents, e.hidden), e.isDir = !0, e.childrenAmount.total = e.childrenAmount.bookmarks + e.childrenAmount.directories, e.views.perMonth = Math.round(e.views.total / c(e.views.startDate) * 100) / 100, a.directories[e.hidden ? "hidden" : "visible"]++
            },
            d = e => {
                let t = 0,
                    i = 0;
                if (r.viewAmounts[e.id] && (t = r.viewAmounts[e.id].c, i = r.viewAmounts[e.id].d || 0), e.views.total = t, e.views.lastView = i, e.views.perMonth = Math.round(t / c(e.views.startDate) * 100) / 100, e.parents.forEach(e => {
                        o.directories[e] && (o.directories[e].childrenAmount.bookmarks++, o.directories[e].views.total += t, o.directories[e].views.lastView = Math.max(o.directories[e].views.lastView || 0, i))
                    }), e.pinned = !1, o.bookmarks[e.id] = e, !1 === this.isSeparator(e.id) && a.bookmarks[e.hidden ? "hidden" : "visible"]++, l.pinnedEntries[e.id]) {
                    e.pinned = !0;
                    const t = Object.assign({}, e);
                    t.index = l.pinnedEntries[e.id].index, delete t.parents, delete t.parentId, o.pinned[e.id] = t, a.pinned[e.hidden ? "hidden" : "visible"]++
                }
            },
            c = e => Math.max(1, Math.round((+new Date - e) / 2627999942.4))
    }, e.FontHelper = function (t) {
        const a = {
                custom: {
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 200,
                        Light: 300,
                        Normal: 400,
                        Medium: 500,
                        SemiBold: 600,
                        Bold: 700,
                        ExtraBold: 800,
                        Black: 900
                    }
                },
                general: {
                    name: "Roboto",
                    href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,100i,200i,300i,400i,500i",
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 300,
                        Medium: 400,
                        SemiBold: 400,
                        Bold: 500,
                        ExtraBold: 500,
                        Black: 500
                    }
                },
                fa: {
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 300,
                        Medium: 400,
                        SemiBold: 500,
                        Bold: 600,
                        ExtraBold: 600,
                        Black: 600
                    }
                },
                ar: {
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 300,
                        Medium: 400,
                        SemiBold: 500,
                        Bold: 600,
                        ExtraBold: 600,
                        Black: 600
                    }
                },
                he: {
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 300,
                        Medium: 400,
                        SemiBold: 500,
                        Bold: 600,
                        ExtraBold: 600,
                        Black: 600
                    }
                },
                ja: {
                    name: "Noto Sans Japanese",
                    href: "https://fonts.googleapis.com/earlyaccess/notosansjapanese.css",
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 200,
                        Medium: 300,
                        SemiBold: 400,
                        Bold: 500,
                        ExtraBold: 500,
                        Black: 500
                    }
                },
                zh_CN: {
                    name: "Noto Sans SC",
                    href: "https://fonts.googleapis.com/earlyaccess/notosanssc.css",
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 300,
                        Medium: 400,
                        SemiBold: 400,
                        Bold: 400,
                        ExtraBold: 500,
                        Black: 500
                    }
                },
                zh_TW: {
                    name: "Noto Sans TC",
                    href: "https://fonts.googleapis.com/earlyaccess/notosanstc.css",
                    fontWeights: {
                        Thin: 100,
                        ExtraLight: 100,
                        Light: 100,
                        Normal: 300,
                        Medium: 400,
                        SemiBold: 400,
                        Bold: 400,
                        ExtraBold: 500,
                        Black: 500
                    }
                }
            },
            l = {
                default: {},
                config: {}
            };
        this.init = () => {
            const e = t.helper.model.getData("a/styles");
            l.default = this.getDefaultFontInfo(), l.default.fontWeights = this.getFontWeights(l.default.name), e.fontFamily && "default" !== e.fontFamily && e.fontFamily !== l.default.name ? l.config = {
                name: e.fontFamily,
                fontWeights: this.getFontWeights(e.fontFamily)
            } : l.config = l.default
        }, this.isLoaded = () => !!l.default.name, this.getFontInfo = (e = "config") => l[e], this.getFontWeights = e => {
            const l = t.helper.i18n.getLanguage(),
                r = {};
            return a[l] && void 0 === a[l].name && (a[l].name = a.general.name), Object.entries(a.custom.fontWeights).forEach(([t, o]) => {
                a[l] && a[l].fontWeights && a[l].fontWeights[t] && a[l].name === e ? o = a[l].fontWeights[t] : a.general.fontWeights[t] && a.general.name === e && (o = a.general.fontWeights[t]), r["fontWeight" + t] = o
            }), r
        }, this.addStylesheet = (t, a = "config") => {
            l[a] && l[a].href && e("<link />").attr({
                rel: "stylesheet",
                type: "text/css",
                href: l[a].href
            }).appendTo(t.find("head"))
        }, this.getDefaultFontInfo = () => {
            const e = t.helper.i18n.getLanguage();
            return a[e] && a[e].name && a[e].href ? Object.assign({}, a[e]) : Object.assign({}, a.general)
        }
    }, e.I18nHelper = function (t) {
        let a = null,
            l = {},
            r = null;
        this.init = () => new Promise(e => {
            t.helper.model.call("langvars").then(t => {
                a = t.language, l = t.vars, r = t.dir, e()
            })
        }), this.getLanguage = () => a, this.isRtl = () => "rtl" === r, this.getUILanguage = () => {
            let e = chrome.i18n.getUILanguage();
            return e = e.replace("-", "_")
        }, this.getDefaultLanguage = () => e.opts.manifest.default_locale, this.getLocaleSortCollator = () => new Intl.Collator([this.getUILanguage(), this.getDefaultLanguage()]), this.getLocaleDate = e => e.toLocaleDateString([this.getUILanguage(), this.getDefaultLanguage()], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }), this.parseHtml = t => {
            e(t).find("[" + e.attr.i18n + "]").forEach(t => {
                let a = null;
                const l = e(t).attr(e.attr.i18n);
                if (l) {
                    let r = [];
                    const o = e(t).attr(e.attr.i18nReplaces);
                    o && (r = o.split(",")), a = this.get(l, r)
                }
                a ? (e(t).removeAttr(e.attr.i18n), e(t).html(a)) : e(t).remove()
            })
        }, this.get = (e, t = [], a = !1) => {
            let r = "";
            const o = l[e];
            return o && o.message && (r = o.message, t && t.length > 0 && t.forEach((e, t) => {
                r = r.replace(new RegExp("\\{" + (t + 1) + "\\}"), e)
            }), r = (r = (r = r.replace(/\[b\](.*)\[\/b\]/, "<strong>$1</strong>")).replace(/\[a\](.*)\[\/a\]/, "<a href='#'>$1</a>")).replace(/\[em\](.*)\[\/em\]/, "<em>$1</em>")), a && (r = r.replace(/'/g, "&#x27;")), r
        }
    }, e.KeyboardHelper = function (t) {
        let a = !1;
        this.init = async () => {
            r()
        }, this.initOverlayEvents = a => {
            e(a[0].contentDocument).on("keydown", e => {
                if ("Escape" === e.key || "Esc" === e.key) e.preventDefault(), t.helper.overlay.closeOverlay();
                else if ("Enter" === e.key) {
                    const t = a[0].contentDocument.activeElement;
                    null !== t && "TEXTAREA" === t.tagName || (e.preventDefault(), o(a))
                } else "Tab" === e.key && (e.preventDefault(), s(a))
            })
        };
        const l = () => {
                let a = !1;
                return t.elm.iframe.hasClass(e.cl.page.visible) && document && document.activeElement && (a = document.activeElement === t.elm.iframe[0]), a
            },
            r = () => {
                e([document, t.elm.iframe[0].contentDocument]).on("keydown.bs", a => {
                    if (l()) {
                        const l = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", "Space"],
                            r = t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']"),
                            o = t.elm.sidebar.find("div." + e.cl.contextmenu.wrapper).length() > 0,
                            s = t.elm.iframeBody.hasClass(e.cl.drag.isDragged);
                        if (l.indexOf(a.key) > -1 || l.indexOf(a.code) > -1) t.helper.scroll.focus(), e.delay(300).then(() => {
                            c()
                        });
                        else if ("Tab" === a.key)
                            if (a.preventDefault(), o) d();
                            else {
                                h(a.shiftKey ? "prev" : "next");
                                const l = t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']");
                                l[0] && l[0].blur()
                            }
                        else "Enter" === a.key ? (a.preventDefault(), o ? i() : n(a.shiftKey, a.ctrlKey || a.metaKey)) : "Escape" === a.key || "Esc" === a.key ? (a.preventDefault(), s ? t.helper.dragndrop.cancel() : o ? t.helper.contextmenu.close() : t.helper.toggle.closeSidebar()) : "Delete" === a.key && r.length() > 0 && r[0] !== t.elm.iframe[0].contentDocument.activeElement ? (a.preventDefault(), p()) : "f" !== a.key || !a.ctrlKey && !a.metaKey || a.ctrlKey === a.metaKey || a.shiftKey ? "c" === a.key && (a.ctrlKey || a.metaKey) ? (a.preventDefault(), m()) : "Shift" !== a.key && "Control" !== a.key && "Command" !== a.key && r.length() > 0 && r[0] !== t.elm.iframe[0].contentDocument.activeElement && r[0].focus() : (a.preventDefault(), t.helper.search.showSearchField())
                    }
                }).on("keyup.bs", () => {
                    if (l()) {
                        const a = t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']");
                        if (a && a.length() > 0) {
                            a[0].value.length > 0 && !t.elm.header.hasClass(e.cl.sidebar.searchVisible) && (t.helper.contextmenu.close(), t.helper.tooltip.close(), t.elm.header.addClass(e.cl.sidebar.searchVisible))
                        }
                    }
                })
            },
            o = a => {
                const l = a.find("menu[" + e.attr.name + "='select'] > a." + e.cl.hover);
                l.length() > 0 ? l.trigger("click") : t.helper.overlay.performAction()
            },
            i = () => {
                const a = t.elm.sidebar.find("div." + e.cl.contextmenu.wrapper).find("a." + e.cl.hover);
                a.length() > 0 && a.trigger("click")
            },
            n = (a, l) => {
                Object.values(t.elm.bookmarkBox).some(r => {
                    if (r.hasClass(e.cl.active)) {
                        const o = r.find("ul > li > a." + e.cl.hover + ", ul > li > a." + e.cl.sidebar.mark);
                        if (o.length() > 0)
                            if (a) {
                                let a = "list";
                                o.hasClass(e.cl.sidebar.separator) && (a = "separator"), t.helper.contextmenu.create(a, o)
                            } else t.helper.sidebarEvents.handleEntryClick(o, {
                                ctrlKey: l
                            });
                        return !0
                    }
                })
            },
            s = t => {
                const a = t.find("menu[" + e.attr.name + "='select'] > a." + e.cl.hover),
                    l = t[0].contentDocument;
                if (a.length() > 0) {
                    let l = null;
                    l = a.next("a").length() > 0 ? a.next("a") : t.find("menu[" + e.attr.name + "='select'] > a").eq(0), t.find("menu[" + e.attr.name + "='select'] > a." + e.cl.hover).removeClass(e.cl.hover), l.addClass(e.cl.hover)
                } else if ("INPUT" === l.activeElement.tagName) {
                    const a = e(l.activeElement).parent("li");
                    let r = null;
                    (r = a.length() > 0 && a.next("li").length() > 0 ? a.next("li").find("input,text,area,select").eq(0) : t.find("input,text,area,select").eq(0)) && r.length() > 0 && r[0].focus()
                } else t.find("input").length() > 0 ? t.find("input")[0].focus() : t.find("menu[" + e.attr.name + "='select']").length() > 0 && t.find("menu[" + e.attr.name + "='select'] > a").eq(0).addClass(e.cl.hover)
            },
            d = () => {
                const a = t.elm.sidebar.find("div." + e.cl.contextmenu.wrapper);
                let l = null,
                    r = null;
                a.find("a." + e.cl.hover).length() > 0 && (r = a.find("a." + e.cl.hover).eq(0)), l = null === r ? a.find("a").eq(0) : r.parent("li").next("li").length() > 0 ? r.parent("li").next("li").children("a") : r.parents("ul").eq(0).next("ul").length() > 0 ? r.parents("ul").eq(0).next("ul").find("> li > a").eq(0) : a.find("a").eq(0), a.find("a." + e.cl.hover).removeClass(e.cl.hover), l.addClass(e.cl.hover)
            },
            c = () => {
                Object.values(t.elm.bookmarkBox).some(a => {
                    if (a.hasClass(e.cl.active)) {
                        const l = t.helper.scroll.getScrollPos(a);
                        return a.find("ul > li").forEach(t => {
                            if (t.offsetTop > l + 50) return a.find("ul > li > a." + e.cl.hover).removeClass(e.cl.hover), a.find("ul > li > a." + e.cl.sidebar.mark).removeClass(e.cl.sidebar.mark), e(t).children("a").addClass([e.cl.hover, e.cl.sidebar.lastHover]), !1
                        }), !0
                    }
                })
            },
            h = a => {
                Object.values(t.elm.bookmarkBox).some(l => {
                    if (l.hasClass(e.cl.active)) {
                        const r = t.helper.scroll.getScrollPos(l);
                        let o = null;
                        if (l.find("ul > li > a." + e.cl.sidebar.mark).length() > 0 ? o = l.find("ul > li > a." + e.cl.sidebar.mark).eq(0).parent("li") : l.find("ul > li > a." + e.cl.hover).length() > 0 ? o = l.find("ul > li > a." + e.cl.hover).eq(0).parent("li") : l.find("ul > li > a." + e.cl.sidebar.lastHover).length() > 0 ? o = l.find("ul > li > a." + e.cl.sidebar.lastHover).eq(0).parent("li") : l.find("ul > li").forEach(t => {
                                if (t.offsetTop >= r) return o = e(t), !1
                            }), o) {
                            const i = o.children("a");
                            let n = null;
                            if (i.hasClass(e.cl.hover) || i.hasClass(e.cl.sidebar.mark) ? "prev" === a ? n = (t => {
                                    let a = null;
                                    if (t.prev("li").length() > 0) {
                                        let l = t.prev("li").children("a");
                                        for (; l.hasClass(e.cl.sidebar.dirOpened) && l.next("ul").length() > 0;) l = l.next("ul").find("> li:last-child > a");
                                        a = l
                                    } else {
                                        const e = t.parents("li").eq(0);
                                        e.length() > 0 && (a = e.children("a"))
                                    }
                                    return a
                                })(o) : "next" === a && (n = (t => {
                                    const a = t.children("a");
                                    let l = null;
                                    if (a.hasClass(e.cl.sidebar.dirOpened) && a.next("ul").length() > 0) l = a.next("ul").find("> li:first-child > a");
                                    else if (t.next("li").length() > 0) l = t.next("li").children("a");
                                    else {
                                        let e = !1,
                                            a = 0;
                                        for (; !1 === e;) {
                                            const r = t.parents("li").eq(a);
                                            r.length() > 0 ? r.next("li").length() > 0 ? (l = r.next("li").children("a"), e = !0) : a++ : e = !0
                                        }
                                    }
                                    return l
                                })(o)) : n = i, n) {
                                l.find("ul > li > a." + e.cl.hover).removeClass(e.cl.hover), l.find("ul > li > a." + e.cl.sidebar.mark).removeClass(e.cl.sidebar.mark), n.addClass([e.cl.hover, e.cl.sidebar.lastHover]);
                                const a = n[0].offsetTop - r,
                                    o = window.innerHeight - a,
                                    i = 150 + t.elm.pinnedBox[0].offsetHeight;
                                a < 0 ? t.helper.scroll.setScrollPos(l, n[0].offsetTop) : o < i && t.helper.scroll.setScrollPos(l, r + (i - o))
                            }
                        }
                        return !0
                    }
                })
            },
            p = () => {
                a || (a = !0, Object.values(t.elm.bookmarkBox).some(l => {
                    if (l.hasClass(e.cl.active)) {
                        const r = l.find("> ul a." + e.cl.hover).eq(0);
                        return r.length() > 0 && 0 === r.children("span." + e.cl.sidebar.removeMask).length() && t.helper.bookmark.removeEntry(r.attr(e.attr.id)).then(() => {
                            a = !1
                        }), !0
                    }
                }))
            },
            m = () => {
                Object.values(t.elm.bookmarkBox).some(a => {
                    if (a.hasClass(e.cl.active)) {
                        const l = a.find("> ul a." + e.cl.hover).eq(0);
                        if (l.length() > 0) {
                            const a = t.helper.entry.getDataById(l.attr(e.attr.id));
                            if (a && a.url && t.helper.utility.copyToClipboard(a.url)) {
                                e(l).children("span." + e.cl.sidebar.copied).remove();
                                const a = e("<span />").addClass(e.cl.sidebar.copied).text(t.helper.i18n.get("sidebar_copied_to_clipboard")).appendTo(l);
                                e.delay(100).then(() => (e(l).addClass(e.cl.sidebar.copied), e.delay(1500))).then(() => (e(l).removeClass(e.cl.sidebar.copied), e.delay(500))).then(() => {
                                    a.remove()
                                })
                            }
                        }
                        return !0
                    }
                })
            }
    }, e.Linkchecker = function (t) {
        const a = {};
        let l = !1;
        this.run = (e, l) => {
            a.modal = e, a.body = e.parents("body"), "default" !== t.helper.model.getUserType() ? o(l) : r()
        };
        const r = () => {
                const l = e("<p />").addClass(e.cl.premium).html("<span>" + t.helper.i18n.get("premium_restricted_text") + "</span>").appendTo(a.modal);
                e("<a />").text(t.helper.i18n.get("more_link")).appendTo(l).on("click", e => {
                    e.preventDefault(), t.helper.model.call("openLink", {
                        href: chrome.extension.getURL("html/settings.html#premium"),
                        newTab: !0
                    })
                }), t.helper.overlay.setCloseButtonLabel("close")
            },
            o = l => {
                a.buttonWrapper = a.modal.find("menu." + e.cl.overlay.buttonWrapper), a.loader = t.helper.template.loading().appendTo(a.modal), a.desc = e("<p />").text(t.helper.i18n.get("overlay_check_bookmarks_loading")).appendTo(a.modal), t.helper.model.call("websiteStatus").then(t => {
                    if ("available" === t.status) {
                        const t = k(l);
                        a.progressBar = e("<div />").addClass(e.cl.overlay.progressBar).html("<div />").appendTo(a.modal), a.progressLabel = e("<span />").addClass(e.cl.overlay.checkUrlProgressLabel).html("<span>0</span>/<span>" + t.bookmarks.length.toLocaleString() + "</span>").appendTo(a.modal), e.delay(200).then(() => {
                            a.modal.addClass(e.cl.overlay.urlCheckLoading)
                        }), h();
                        const r = {
                            count: 0,
                            changed: [],
                            broken: [],
                            duplicate: [],
                            empty: []
                        };
                        f(t.directories, r).then(() => v(t.bookmarks, r)).then(() => {
                            n(r)
                        })
                    } else i()
                })
            },
            i = () => {
                a.progressBar.remove(), a.progressLabel.remove(), a.loader.remove(), a.desc.remove(), e("<div />").addClass(e.cl.error).append("<h3>" + t.helper.i18n.get("status_service_unavailable_headline") + "</h3>").append("<p>" + t.helper.i18n.get("status_check_bookmarks_unavailable_desc") + "</p>").appendTo(a.modal), t.helper.overlay.setCloseButtonLabel("close")
            },
            n = l => {
                if (a.modal.children("div." + e.cl.error).length() > 0) return;
                const r = l.count > 0;
                delete l.count, a.desc.remove(), a.progressBar.remove(), a.progressLabel.remove(), r && a.modal.addClass(e.cl.overlay.urlCheckResults), e.delay(r ? 500 : 0).then(() => {
                    if (a.loader.remove(), a.modal.removeClass(e.cl.overlay.urlCheckLoading), t.helper.overlay.setCloseButtonLabel("close"), !1 === r) b();
                    else {
                        a.menu = e("<menu />").addClass(e.cl.overlay.urlCheckCategories).appendTo(a.modal), a.results = {}, a.actions = {};
                        let r = null;
                        Object.entries(l).forEach(([l, o]) => {
                            const i = e("<li />").html("<a>" + t.helper.i18n.get("overlay_check_bookmarks_menu_" + l) + "<span></span></a>").attr(e.attr.name, l).appendTo(a.menu);
                            if (o.length > 0 && null === r && (r = i.children("a")), "duplicate" !== l) {
                                let r = "overlay_check_bookmarks_update";
                                "broken" !== l && "empty" !== l || (r = "overlay_check_bookmarks_remove"), a.actions[l] = e("<a />").addClass(e.cl.overlay.urlCheckAction).attr(e.attr.name, l).text(t.helper.i18n.get(r + "_selected")).appendTo(a.buttonWrapper)
                            }
                            a.results[l] = t.helper.scroll.add(e.opts.ids.overlay.urlCheckResult + "_" + l, e("<ul />").appendTo(a.modal)), o.forEach(t => {
                                const r = e("<li />").data("entry", t).appendTo(a.results[l].children("ul"));
                                switch (l) {
                                    case "broken":
                                    case "changed":
                                        c(t, r);
                                        break;
                                    case "duplicate":
                                        d(t, r);
                                        break;
                                    case "empty":
                                        s(t, r)
                                }
                            })
                        }), g(), p(), r && r.trigger("click")
                    }
                })
            },
            s = (l, r) => {
                const o = t.helper.entry.getParentsById(l.id);
                if (o.length > 0) {
                    t.helper.checkbox.get(a.body, {
                        checked: "checked"
                    }).appendTo(r);
                    const i = e("<ul />").addClass(e.cl.sidebar.breadcrumb).appendTo(r);
                    o.forEach(t => {
                        e("<li />").text(t.title).prependTo(i)
                    }), e("<li />").text(l.title).appendTo(i)
                } else r.remove();
                e("<a />").addClass(e.cl.overlay.urlCheckAction).appendTo(r)
            },
            d = (a, l) => {
                const r = e("<a />").addClass(e.cl.info).attr({
                        href: a.url,
                        title: a.label,
                        target: "_blank"
                    }).html(a.label).appendTo(l),
                    o = e("<ul />").attr(e.attr.type, "duplicates").appendTo(l);
                a.duplicates.forEach(a => {
                    a.duplicate = !0;
                    const l = e("<li />").data("entry", a).appendTo(o);
                    e("<strong />").html(a.title).appendTo(l);
                    const r = t.helper.entry.getParentsById(a.id);
                    if (r.length > 0) {
                        const t = e("<ul />").addClass(e.cl.sidebar.breadcrumb).appendTo(l);
                        r.forEach(a => {
                            e("<li />").text(a.title).prependTo(t)
                        })
                    }
                    e("<a />").addClass(e.cl.overlay.urlCheckAction).appendTo(l)
                }), t.helper.model.call("favicon", {
                    url: a.url
                }).then(t => {
                    t.img && e("<img src='" + t.img + "' />").insertBefore(r)
                })
            },
            c = (l, r) => {
                t.helper.checkbox.get(a.body, {
                    checked: "checked"
                }).appendTo(r), e("<strong />").text(l.title).appendTo(r);
                const o = e("<ul />").attr(e.attr.type, "urls").appendTo(r);
                ["url", "newUrl"].forEach(t => {
                    if (l[t]) {
                        const a = e("<li />").appendTo(o);
                        e("<a />").attr({
                            href: l[t],
                            title: l[t],
                            target: "_blank"
                        }).html(l[t]).appendTo(a)
                    }
                }), e("<a />").addClass(e.cl.overlay.urlCheckAction).appendTo(r), t.helper.model.call("favicon", {
                    url: l.url
                }).then(t => {
                    t.img && e("<img src='" + t.img + "' />").insertAfter(r.children("div." + e.cl.checkbox.box))
                })
            },
            h = () => {
                e(document).on(e.opts.events.overlayClosed, () => {
                    t.helper.model.call("checkUrls", {
                        abort: !0
                    }), l && (l = !1, t.helper.model.call("reload", {
                        type: "Update"
                    }))
                })
            },
            p = () => {
                a.menu.find("a").on("click", t => {
                    t.preventDefault();
                    const l = e(t.currentTarget).parent("li"),
                        r = l.attr(e.attr.name);
                    a.results && a.results[r] && (a.menu.children("li").removeClass(e.cl.active), l.addClass(e.cl.active), ["results", "actions"].forEach(t => {
                        a[t] && Object.entries(a[t]).forEach(([t, a]) => {
                            r === t ? a.addClass(e.cl.visible) : a.removeClass(e.cl.visible)
                        })
                    }))
                }), Object.entries(a.results).forEach(([t, a]) => {
                    a.find("a." + e.cl.overlay.urlCheckAction).on("click", t => {
                        t.preventDefault();
                        const a = e(t.currentTarget).parent("li"),
                            l = e(t.currentTarget).parent("li").data("entry");
                        a.css("height", a[0].offsetHeight + "px"), e.delay().then(() => (a.addClass(e.cl.hidden), u(l), e.delay(500))).then(() => {
                            a.remove(), g()
                        })
                    })
                }), a.buttonWrapper.find("a." + e.cl.overlay.urlCheckAction).on("click", t => {
                    t.preventDefault();
                    const l = e(t.currentTarget).attr(e.attr.name);
                    if (a.results && a.results[l]) {
                        const t = [];
                        a.results[l].find("> ul > li").forEach(a => {
                            e(a).find("input[type='checkbox']")[0].checked && (t.push(e(a).data("entry")), e(a).remove())
                        }), m(t).then(() => {
                            g()
                        })
                    }
                })
            },
            m = async e => {
                for (const t of e) await u(t)
            }, u = e => new Promise(a => {
                if (l = !0, 404 === e.statusCode || e.duplicate || e.children && 0 === e.children.length) t.helper.bookmark.performDeletion(e, !0).then(a);
                else if (e.url !== e.newUrl) {
                    const l = e.additionalInfo && e.additionalInfo.desc ? e.additionalInfo.desc : null;
                    t.helper.bookmark.editEntry({
                        id: e.id,
                        title: e.title,
                        url: e.newUrl,
                        additionalInfo: l
                    }).then(a)
                } else a()
            }), g = () => {
                let l = !0;
                Object.entries(a.results).forEach(([r, o]) => {
                    let i = o.find("> ul > li").length();
                    "duplicate" === r && o.find("> ul > li").forEach(t => {
                        const a = e(t).find("> ul > li").length();
                        0 === a ? (e(t).remove(), i--) : 1 === a && i--
                    }), a.menu.find("li[" + e.attr.name + "='" + r + "'] > a > span").text("(" + i + ")"), 0 === i ? (o.children("ul,p").remove(), e("<p />").html("<span>" + t.helper.i18n.get("overlay_check_bookmarks_no_results_" + r) + "</span>").appendTo(o), a.actions && a.actions[r] && a.actions[r].remove()) : l = !1
                }), l && b()
            }, b = () => {
                a.modal.addClass(e.cl.overlay.urlCheckLoading), e.delay().then(() => (a.modal.removeClass(e.cl.overlay.urlCheckResults), a.modal.find("menu." + e.cl.overlay.urlCheckCategories).remove(), ["results", "actions"].forEach(e => {
                    a[e] && Object.values(a[e]).forEach(e => {
                        e.remove()
                    })
                }), e("<p />").addClass(e.cl.success).text(t.helper.i18n.get("overlay_check_bookmarks_no_results")).appendTo(a.modal), e.delay(500))).then(() => {
                    a.modal.removeClass(e.cl.overlay.urlCheckLoading)
                })
            }, f = async (e, t) => {
                e.forEach(e => {
                    0 === e.children.length && (t.empty.push(e), t.count++)
                })
            }, v = (l, r) => new Promise(o => {
                let n = 0;
                const s = {},
                    d = [],
                    c = o => new Promise(i => {
                        t.helper.model.call("checkUrls", {
                            urls: o
                        }).then(t => {
                            if (t.error) i({
                                success: !1
                            });
                            else {
                                let o = -1;
                                Object.entries(t.duplicates).forEach(([e, t]) => {
                                    -1 === d.indexOf(e) && (r.duplicate.push({
                                        label: e,
                                        url: t.url,
                                        duplicates: t.duplicates
                                    }), d.push(e), r.count++)
                                }), Object.entries(t.xhr).forEach(([t, i]) => {
                                    s[t].statusCode = +i.code, s[t].checkTimeout = i.timeout, 404 === s[t].statusCode || i.timeout ? (r.broken.push(s[t]), r.count++) : s[t].url !== i.url && 302 !== s[t].statusCode && (s[t].newUrl = i.url, r.changed.push(s[t]), r.count++), e.delay(50 * ++o).then(() => {
                                        n++, a.progressBar.children("div").css("width", n / l.length * 100 + "%"), a.progressLabel.children("span").eq(0).text(n.toLocaleString())
                                    })
                                }), e.delay(50 * Object.keys(t.xhr).length).then(() => {
                                    i({
                                        success: !0
                                    })
                                })
                            }
                        })
                    });
                (async () => {
                    let t = 0,
                        a = {};
                    for (const e of l)
                        if (t++, a[e.id] = e.url, s[e.id] = e, Object.keys(a).length >= 15 || t === l.length) {
                            const e = await c(a);
                            if (a = {}, !1 === e.success) {
                                0 === n && i();
                                break
                            }
                        } e.delay(500).then(() => {
                        o(r)
                    })
                })()
            }), k = e => {
                const a = {
                        bookmarks: [],
                        directories: []
                    },
                    l = e => {
                        e.forEach(e => {
                            e.url && !1 === t.helper.utility.isUrlOnBlacklist(e.url) ? a.bookmarks.push(e) : e.children && (a.directories.push(e), l(e.children))
                        })
                    };
                return l(e), a
            }
    }, e.ListHelper = function (t) {
        let a = 0,
            l = {},
            r = 0;
        this.init = async () => {
            t.elm.bookmarkBox.all.addClass(e.cl.active), Object.values(t.elm.bookmarkBox).forEach(a => {
                a.on(e.opts.events.scrollBoxLastPart, () => {
                    const l = a.children("ul"),
                        r = l.data("remainingEntries");
                    r && r.length > 0 && (this.addBookmarkDir(r, l, !1, !1), (t.refreshRun || !1 === t.elm.iframe.hasClass(e.cl.page.visible)) && t.helper.scroll.restoreScrollPos(a))
                })
            });
            const a = t.helper.model.getData("b/dirOpenDuration");
            r = 1e3 * +a, this.updateBookmarkBox()
        }, this.getSort = () => l, this.updateSort = (e, a) => {
            const r = t.helper.utility.getSortList();
            r[e] && (void 0 === a && (a = r[e].dir), l = {
                name: e,
                dir: "ASC" === a ? "ASC" : "DESC"
            }, t.startLoading(), Promise.all([t.helper.model.call("removeCache", {
                name: "htmlList"
            }), t.helper.model.call("removeCache", {
                name: "htmlPinnedEntries"
            }), t.helper.model.setData({
                "u/sort": l
            })]).then(() => {
                t.helper.model.call("reload", {
                    scrollTop: !0,
                    type: "Sort"
                })
            }))
        }, this.updateDirection = e => {
            this.updateSort(l.name, e)
        }, this.updateBookmarkBox = () => new Promise(a => {
            t.startLoading(), l = t.helper.model.getData("u/sort"), t.elm.sidebar.attr(e.attr.sort, l.name), t.elm.bookmarkBox.all.children("a[" + e.attr.name + "='add']").remove();
            const r = t.elm.bookmarkBox.all.children("ul");
            let o = null;
            t.updateBookmarkBoxStart = +new Date, o = t.helper.model.getData("u/viewAsTree") || "custom" === l.name ? Promise.all([t.helper.model.call("getCache", {
                name: "htmlList"
            }), t.helper.model.call("getCache", {
                name: "htmlPinnedEntries"
            })]) : new Promise(e => {
                e()
            }), t.helper.scroll.focus(), o.then(a => a && a[0] && a[0].val ? (a[1] && a[1].val ? (t.elm.pinnedBox.html(a[1].val), t.helper.model.getData("u/lockPinned") && (t.elm.lockPinned.addClass(e.cl.sidebar.fixed), t.elm.pinnedBox.addClass(e.cl.sidebar.fixed)), i(t.elm.pinnedBox), s(t.elm.pinnedBox)) : t.elm.pinnedBox.addClass(e.cl.hidden), p(r, a[0].val)) : m(r)).then(() => {
                a()
            })
        }), this.toggleBookmarkDir = (a, l, o = !0) => new Promise(i => {
            a.addClass(e.cl.sidebar.dirAnimated);
            const n = a.attr(e.attr.id);
            let s = a.next("ul");
            const d = s.length() > 0,
                h = !0 === t.refreshRun || !1 === t.elm.iframe.hasClass(e.cl.page.visible),
                p = a.hasClass(e.cl.sidebar.dirOpened) && d;
            void 0 === l && (l = h || !1 === t.helper.model.getData("b/animations"));
            const m = () => {
                !1 === h && !1 === p && !0 === t.helper.model.getData("b/rememberOpenStatesSubDirectories") && this.restoreOpenStates(s), "nothing" === t.helper.model.getData("b/rememberState") || !o || h || t.helper.search.isResultsVisible() ? i() : this.cacheList().then(i)
            };
            if (p) c(a, s, !1, l).then(m);
            else {
                if (t.helper.model.getData("b/dirAccordion") && !0 === o) {
                    const o = t.helper.search.isResultsVisible() ? "search" : "all";
                    e([t.elm.bookmarkBox[o].find("a." + e.cl.sidebar.dirOpened), t.elm.bookmarkBox[o].find("a." + e.cl.sidebar.dirAnimated + ":not(" + e.cl.sidebar.dirOpened + ")")]).forEach(t => {
                        if (t !== a[0] && 0 === e(t).next("ul").find("a[" + e.attr.id + "='" + n + "']").length()) {
                            let a = 0;
                            e(t).hasClass(e.cl.sidebar.dirAnimated) && (a = r), e.delay(l ? 0 : a).then(() => {
                                e(t).addClass(e.cl.sidebar.dirOpened), this.toggleBookmarkDir(e(t), l, !1).then(m)
                            })
                        }
                    })
                }
                d ? c(a, s, !0, l).then(m) : t.helper.model.call("bookmarks", {
                    id: n
                }).then(t => {
                    t.bookmarks && t.bookmarks[0] && t.bookmarks[0].children && (s = e("<ul />").insertAfter(a), this.addBookmarkDir(t.bookmarks[0].children, s), c(a, s, !0, l).then(m))
                })
            }
        }), this.cacheList = () => (t.log("Cache sidebar html"), Promise.all([t.helper.model.call("setCache", {
            name: "htmlList",
            val: t.elm.bookmarkBox.all.children("ul").html()
        }), t.helper.model.call("setCache", {
            name: "htmlPinnedEntries",
            val: t.elm.pinnedBox.html()
        })])), this.handleSidebarWidthChange = () => {
            const a = t.elm.header.children("a"),
                l = t.elm.header.children("h1");
            l.removeClass(e.cl.hidden), l.children("span").removeClass(e.cl.hidden), ["label", "amount"].forEach(t => {
                let r = null;
                a.forEach(a => {
                    if (null === r) r = a.offsetTop;
                    else if (r !== a.offsetTop || 0 === l[0].offsetTop) return "label" === t ? l.children("span").addClass(e.cl.hidden) : "amount" === t && l.addClass(e.cl.hidden), !1
                })
            })
        }, this.updateSidebarHeader = () => {
            const a = t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']");
            let l = "";
            a.length() > 0 && a[0] && a[0].value && (l = a[0].value), t.elm.header.text("");
            const r = t.helper.entry.getAmount("bookmarks");
            e("<h1 />").html("<strong>" + r + "</strong> <span>" + t.helper.i18n.get("header_bookmarks" + (1 === r ? "_single" : "")) + "</span>").attr("title", r + " " + t.helper.i18n.get("header_bookmarks" + (1 === r ? "_single" : ""), null, !0)).appendTo(t.elm.header), e("<a />").addClass(e.cl.sidebar.search).appendTo(t.elm.header), e("<a />").addClass(e.cl.sidebar.sort).appendTo(t.elm.header), e("<a />").addClass(e.cl.sidebar.menu).appendTo(t.elm.header), this.handleSidebarWidthChange(), e("<div />").addClass(e.cl.sidebar.searchBox).append("<input type='text' value='" + l.replace(/'/g, "&#x27;") + "' placeholder='" + t.helper.i18n.get("sidebar_search_placeholder", null, !0) + "' />").append("<a class='" + e.cl.sidebar.searchClose + "'></a>").appendTo(t.elm.header)
        }, this.restoreOpenStates = (l, r = !1) => {
            let o = !1;
            const i = t.helper.model.getData(["b/rememberState", "u/openStates"]),
                n = () => {
                    !o && r && 0 === a && e.delay(100).then(() => {
                        u()
                    })
                };
            "all" !== i.rememberState && "openStatesAndPos" !== i.rememberState && "openStates" !== i.rememberState && "openStatesRoot" !== i.rememberState || Object.entries(i.openStates).forEach(([t, s]) => {
                if (!0 === s) {
                    const s = l.find("> li > a." + e.cl.sidebar.bookmarkDir + "[" + e.attr.id + "='" + t + "']:not(." + e.cl.sidebar.dirOpened + ")");
                    s.length() > 0 && ("openStatesRoot" === i.rememberState && 1 !== s.parents("ul").length() && !1 !== r || (o = !0, a++, this.toggleBookmarkDir(s).then(() => {
                        a--, o = !1, n()
                    })))
                }
            }), n()
        }, this.updateSortFilter = () => {
            t.elm.filterBox.removeClass(e.cl.hidden).text("");
            let a = 0;
            if ("custom" === l.name) t.elm.filterBox.addClass(e.cl.hidden);
            else {
                const r = t.helper.model.getData(["u/viewAsTree", "u/mostViewedPerMonth"]),
                    o = l.name.replace(/([A-Z])/g, "_$1").toLowerCase();
                e("<a />").attr(e.attr.direction, l.dir).text(t.helper.i18n.get("sort_label_" + o)).appendTo(t.elm.filterBox);
                const i = e("<ul />").appendTo(t.elm.filterBox);
                !1 === t.helper.search.isResultsVisible() && e("<li />").append(t.helper.checkbox.get(t.elm.iframeBody, {
                    [e.attr.name]: "viewAsTree",
                    checked: r.viewAsTree ? "checked" : ""
                })).append("<a>" + t.helper.i18n.get("sort_view_as_tree") + "</a>").appendTo(i), "mostUsed" === l.name && e("<li />").append(t.helper.checkbox.get(t.elm.iframeBody, {
                    [e.attr.name]: "mostViewedPerMonth",
                    checked: r.mostViewedPerMonth ? "checked" : ""
                })).append("<a>" + t.helper.i18n.get("sort_most_used_per_month") + "</a>").appendTo(i), 0 === i.children("li").length() && i.remove(), a = t.elm.filterBox.realHeight()
            }
            Object.values(t.elm.bookmarkBox).forEach(e => {
                e.css("padding-top", a)
            }), t.elm.pinnedBox.css("top", t.helper.model.getData("u/lockPinned") ? -a : 0)
        }, this.addBookmarkDir = (a, i, s = !0, d = !0) => {
            let c = !1;
            const h = s && "custom" === l.name && i.prev("a").length() > 0,
                p = t.helper.model.getData(["a/directoryArrows", "a/showBookmarkIcons", "a/showDirectoryIcons", "u/showHidden"]);
            0 === i.parents("li").length() ? !1 === t.helper.search.isResultsVisible() && o(p) : i.css("transition", "height " + r + "ms");
            let m = 0;
            return i.removeData("remainingEntries"), d && t.helper.utility.sortEntries(a, l), a.some((l, r) => {
                if ((p.showHidden || t.helper.entry.isVisible(l.id)) && (l.children || l.url) && (e.opts.demoMode && (l.children ? l.title = "Directory " + (r + 1) : (l.title = "Bookmark " + (r + 1), l.url = "https://example.com/")), (!1 === t.helper.entry.isSeparator(l.id) || h) && n(l, i, {
                        config: p,
                        asTree: s
                    }), l.url && m++, c = !0, !1 === s && m >= 100)) {
                    const e = a.slice(r + 1);
                    return e.length > 0 && i.data("remainingEntries", e), !0
                }
            }), c
        };
        const o = a => {
                t.elm.lockPinned.removeClass(e.cl.sidebar.fixed), t.elm.pinnedBox.removeClass([e.cl.hidden, e.cl.sidebar.fixed]), t.elm.pinnedBox.children("ul").remove();
                const r = t.helper.entry.getAllDataByType("pinned");
                if (0 === r.length) t.elm.pinnedBox.addClass(e.cl.hidden);
                else {
                    t.helper.utility.sortEntries(r, l);
                    const o = e("<ul />").appendTo(t.elm.pinnedBox);
                    t.helper.model.getData("u/lockPinned") && (t.elm.lockPinned.addClass(e.cl.sidebar.fixed), t.elm.pinnedBox.addClass(e.cl.sidebar.fixed)), r.forEach(e => {
                        (a.showHidden || t.helper.entry.isVisible(e.id)) && n(e, o, {
                            config: a,
                            asTree: !1
                        })
                    })
                }
            },
            i = t => {
                t.find("a." + e.cl.sidebar.mark).removeClass(e.cl.sidebar.mark), t.find("a." + e.cl.hover).removeClass(e.cl.hover), t.find("a." + e.cl.drag.dragHover).removeClass(e.cl.drag.dragHover), t.find("a." + e.cl.sidebar.lastHover).removeClass(e.cl.sidebar.lastHover), t.find("li." + e.cl.drag.dragInitial).removeClass(e.cl.drag.dragInitial), t.find("li." + e.cl.drag.isDragged).remove()
            },
            n = (a, l, r) => {
                const o = e("<li />").appendTo(l),
                    i = a.title && a.title.trim().length ? a.title : "",
                    n = e("<a />").appendTo(o),
                    s = e("<span />").addClass(e.cl.sidebar.bookmarkLabel).text(i.trim()).appendTo(n);
                if (e("<span />").addClass(e.cl.drag.trigger).appendTo(n), a.id && n.attr(e.attr.id, a.id), !1 === t.helper.entry.isVisible(a.id) && o.addClass(e.cl.hidden), t.helper.entry.isSeparator(a.id)) {
                    n.addClass(e.cl.sidebar.separator);
                    const t = a.title.replace(/(^[-_]+|[-_]+$)/g, "").trim();
                    t.length > 0 && s.attr(e.attr.name, t), s.text("")
                } else a.children ? (n.addClass(e.cl.sidebar.bookmarkDir), r.config.showDirectoryIcons && n.prepend("<span class='" + e.cl.sidebar.dirIcon + "' />"), r.config.directoryArrows && n.addClass(e.cl.sidebar.dirArrow)) : a.url && (n.addClass(e.cl.sidebar.bookmarkLink), r.config.showBookmarkIcons && (e.opts.demoMode ? n.prepend("<span class='" + e.cl.sidebar.dirIcon + "' data-color='" + (Math.floor(10 * Math.random()) + 1) + "' />") : d(n, a.url)));
                return o
            },
            s = (a, l = !1) => new Promise(r => {
                const o = [];
                a.find("a." + e.cl.sidebar.bookmarkLink + " > img[" + e.attr.value + "]").forEach(t => {
                    const a = e(t).parent("a"),
                        l = e(t).attr(e.attr.value);
                    o.push(d(a, l))
                }), o.length > 0 ? (t.log("Detected: Missing bookmark favicons"), Promise.all(o).then(() => {
                    l ? this.cacheList().then(r) : r()
                })) : r()
            }),
            d = (a, l) => {
                a.children("img").remove();
                const r = e("<img />").prependTo(a);
                return r.attr(e.attr.value, l), new Promise(a => {
                    t.helper.model.call("favicon", {
                        url: l
                    }).then(l => {
                        if (l.img) {
                            const a = t.elm.iframe.hasClass(e.cl.page.visible);
                            r.attr(a ? "src" : e.attr.src, l.img)
                        }
                        r.removeAttr(e.attr.value), a()
                    })
                })
            },
            c = (a, l, o, i) => new Promise(n => {
                if (l.css("height", l[0].scrollHeight + "px"), !1 === o && e.delay(50).then(() => {
                        l.css("height", 0)
                    }), !0 === t.refreshRun) this.restoreOpenStates(l, !0);
                else {
                    const l = t.helper.model.getData("u/openStates");
                    l[a.attr(e.attr.id)] = o, !1 === o && !1 === t.helper.model.getData("b/rememberOpenStatesSubDirectories") ? h(a, l) : !1 === t.helper.search.isResultsVisible() && t.helper.model.setData({
                        "u/openStates": l
                    })
                }
                e.delay(i ? 20 : r).then(() => {
                    if (!1 === o) a.removeClass(e.cl.sidebar.dirOpened);
                    else if (a.addClass(e.cl.sidebar.dirOpened), t.helper.model.getData("b/dirAccordion") && !1 === t.refreshRun) {
                        const e = t.helper.search.isResultsVisible() ? "search" : "all";
                        t.helper.scroll.getScrollPos(t.elm.bookmarkBox[e]) > a[0].offsetTop && t.helper.scroll.setScrollPos(t.elm.bookmarkBox[e], a[0].offsetTop, 300)
                    }
                    l.css("height", ""), a.removeClass(e.cl.sidebar.dirAnimated), n()
                })
            }),
            h = (a, l) => {
                a.next("ul").find("a." + e.cl.sidebar.bookmarkDir).forEach(t => {
                    l[e(t).attr(e.attr.id)] = !1, e.delay(500).then(() => {
                        e(t).removeClass(e.cl.sidebar.dirOpened)
                    })
                }), !1 === t.helper.search.isResultsVisible() && t.helper.model.setData({
                    "u/openStates": l
                })
            },
            p = (a, l) => new Promise(r => {
                t.log("Load html from cache"), a.html(l), i(a), s(a, !0), t.elm.bookmarkBox.all.addClass(e.cl.sidebar.cached), this.updateSidebarHeader(), this.updateSortFilter(), 1 === a.children("li").length() && (a.addClass(e.cl.sidebar.hideRoot), e("<a />").attr(e.attr.name, "add").insertAfter(a)), e.delay(100).then(() => {
                    u(), r()
                })
            }),
            m = a => new Promise(r => {
                t.log("Load html from object");
                let o = [];
                const i = t.helper.model.getData("u/viewAsTree");
                t.elm.bookmarkBox.all.removeClass(e.cl.sidebar.cached), t.helper.model.call("bookmarks", {
                    id: 0
                }).then(l => (t.refreshRun = !0, a.removeClass(e.cl.sidebar.hideRoot).text(""), l.bookmarks && l.bookmarks[0] && l.bookmarks[0].children && (o = l.bookmarks[0].children), t.helper.entry.init(o))).then(() => {
                    this.updateSidebarHeader(), i || "custom" === l.name ? (this.addBookmarkDir(o, a, !0), 1 === a.children("li").length() ? (a.addClass(e.cl.sidebar.hideRoot), e("<a />").attr(e.attr.name, "add").insertAfter(a), this.toggleBookmarkDir(a.find("> li > a." + e.cl.sidebar.bookmarkDir).eq(0))) : this.restoreOpenStates(a, !0)) : (this.addBookmarkDir(t.helper.entry.getAllDataByType("bookmarks"), a, !1), u()), this.updateSortFilter(), r()
                })
            }),
            u = () => {
                t.helper.scroll.restoreScrollPos(t.elm.bookmarkBox.all).then(() => {
                    t.initImages(), t.endLoading(200), t.refreshRun = !1, !t.helper.model.getData("u/viewAsTree") && "custom" !== l.name || t.elm.bookmarkBox.all.hasClass(e.cl.sidebar.cached) || this.cacheList(), t.loaded()
                })
            }
    }, e.ModelHelper = function (t) {
        const a = {
            u: {
                openStates: {},
                hiddenEntries: {},
                additionalInfo: {},
                scrollPos: 0,
                separators: {},
                customCss: "",
                pinnedEntries: {},
                lockPinned: !0,
                translationHelp: !0,
                translationThanked: !1,
                performReopening: !1,
                entryAmounts: {},
                lastOpened: null,
                sort: {
                    name: "custom",
                    dir: "ASC"
                },
                mostViewedPerMonth: !1,
                viewAsTree: !0
            },
            b: {
                animations: !0,
                contextmenu: !0,
                preventPageScroll: !1,
                toggleArea: {
                    width: 1,
                    widthWindowed: 20,
                    height: 100,
                    top: 0
                },
                blacklist: [],
                whitelist: [],
                sidebarPosition: "left",
                openAction: "mousedown",
                newTab: "foreground",
                newTabPosition: "afterCurrent",
                visibility: "always",
                linkAction: "current",
                dirAccordion: !1,
                reopenSidebar: !1,
                preventWindowed: !1,
                rememberState: "openStatesAndPos",
                rememberOpenStatesSubDirectories: !0,
                newEntryPosition: "append",
                tooltipDelay: .5,
                tooltipContent: "all",
                tooltipAdditionalInfo: !0,
                dndOpen: !0,
                dndCreationDialog: !1,
                openChildrenWarnLimit: 10,
                dirOpenDuration: .4,
                scrollBarHide: 1.5,
                openDelay: 0,
                closeTimeout: 1,
                dndOpenDirDelay: .5
            },
            a: {
                showIndicator: !0,
                showIndicatorIcon: !0,
                darkMode: !1,
                highContrast: !1,
                directoryArrows: !1,
                showBookmarkIcons: !0,
                showDirectoryIcons: !0,
                devModeIconBadge: !0,
                styles: {
                    colorScheme: e.opts.defaultColors.colorScheme.light,
                    foregroundColor: e.opts.defaultColors.foregroundColor.light,
                    textColor: e.opts.defaultColors.textColor.light,
                    hoverColor: e.opts.defaultColors.hoverColor.light,
                    indicatorWidth: "40px",
                    indicatorIconSize: "32px",
                    indicatorIconColor: "#ffffff",
                    indicatorColor: "rgba(0,0,0,0.5)",
                    sidebarWidth: "350px",
                    sidebarHeaderHeight: "50px",
                    sidebarMaskColor: e.opts.defaultColors.sidebarMaskColor.light,
                    bookmarksFontSize: "14px",
                    directoriesIconSize: "16px",
                    bookmarksIconSize: "16px",
                    bookmarksLineHeight: "38px",
                    bookmarksDirIcon: "dir-1",
                    bookmarksDirColor: e.opts.defaultColors.textColor.light,
                    bookmarksDirIndentation: "25px",
                    bookmarksHorizontalPadding: "16px",
                    scrollBarWidth: "11px",
                    tooltipFontSize: "9px",
                    overlayMaskColor: "rgba(0,0,0,0.5)",
                    overlayHeaderHeight: "50px",
                    fontFamily: "default",
                    iconShape: "bookmark",
                    iconColor: "auto"
                }
            },
            n: {
                override: !1,
                autoOpen: !0,
                shortcutsPosition: "right",
                searchEngine: "google",
                searchEngineCustom: {
                    title: "",
                    homepage: "",
                    queryUrl: ""
                },
                topPagesType: "topPages",
                topPagesAppearance: "favicon",
                shortcuts: [{
                    label: "Google",
                    url: "https://google.com"
                }],
                website: ""
            }
        };
        let l = {},
            r = null,
            o = null;
        const i = {};
        this.init = () => new Promise(e => {
            r = null, Promise.all([n(), s()]).then(e)
        });
        const n = () => new Promise(e => {
                o && o.disconnect(), (o = chrome.runtime.connect({
                    name: "background"
                })).onMessage.addListener(e => {
                    i[e.uid] && (i[e.uid](e.result), delete i[e.uid])
                }), e()
            }),
            s = () => new Promise(e => {
                const t = ["utility", "behaviour", "appearance", "newtab"],
                    a = {},
                    o = t.length;
                let i = 0;
                t.forEach(t => {
                    chrome.storage["utility" === t ? "local" : "sync"].get([t], n => {
                        a[t] = n[t] || {}, ++i === o && (l = a, null === r ? this.call("userType").then(t => {
                            t && t.userType && (r = t.userType), e()
                        }) : e())
                    })
                })
            }),
            d = e => {
                switch (e) {
                    case "u":
                        return "utility";
                    case "b":
                        return "behaviour";
                    case "a":
                        return "appearance";
                    case "n":
                        return "newtab"
                }
                return null
            };
        this.getUserType = () => r, this.getAllData = () => l, this.getDefaultData = () => {
            const e = {};
            return Object.entries(a).forEach(([t, a]) => {
                const l = d(t);
                l && (e[l] = a)
            }), e
        }, this.getData = (e, r = !1) => {
            let o = e;
            "string" == typeof o && (o = [o]);
            let i = {};
            if (o.forEach(e => {
                    const o = e.split("/")[0],
                        n = e.split("/")[1];
                    let s = null;
                    const c = d(o);
                    c && l[c] && (!0 === r || void 0 === l[c][n] ? void 0 !== a[o] && void 0 !== a[o][n] && (s = a[o][n]) : s = l[c][n]);
                    const h = location.href.search(/chrome-extension:\/\//) > -1 && location.pathname.search(/settings\.html$/) > -1;
                    if ("b/toggleArea" === e && matchMedia("(min-resolution: 1.25dppx)").matches && !1 === h && (s = Object.assign({}, s), Object.keys(s).forEach(e => {
                            e.startsWith("width") && s[e]++
                        })), "a/styles" === e && (s = Object.assign({}, a.a.styles, s), t.helper.font && t.helper.font.isLoaded())) {
                        const e = t.helper.font.getFontInfo(r ? "default" : "config");
                        s.fontFamily = e.name, Object.assign(s, e.fontWeights)
                    }
                    i[n] = s
                }), "string" == typeof e) {
                const t = e.split("/")[1];
                i = i[t]
            }
            return i
        }, this.setData = e => new Promise(t => {
            s().then(() => {
                Object.keys(e).forEach(t => {
                    const a = t.split("/")[0],
                        r = t.split("/")[1],
                        o = e[t];
                    switch (a) {
                        case "u":
                            l.utility[r] = o;
                            break;
                        case "b":
                            l.behaviour[r] = o;
                            break;
                        case "a":
                            l.appearance[r] = o;
                            break;
                        case "n":
                            l.newtab[r] = o
                    }
                });
                let a = 0;
                const r = (e = 1) => {
                    (a += e) >= 4 && t()
                };
                try {
                    chrome.storage.local.set({
                        utility: l.utility
                    }, () => {
                        chrome.runtime.lastError, r()
                    }), chrome.storage.sync.set({
                        behaviour: l.behaviour,
                        appearance: l.appearance,
                        newtab: l.newtab
                    }, () => {
                        chrome.runtime.lastError, r(3)
                    })
                } catch (e) {
                    t()
                }
            })
        }), this.call = (e, t = {}) => new Promise(a => {
            t.type = e, t.uid = e + "_" + JSON.stringify(t) + "_" + +new Date + Math.random().toString(36).substr(2, 12), i[t.uid] = e => {
                a(e)
            }, o.postMessage(t)
        })
    }, e.OverlayHelper = function (t) {
        let a = {};
        this.create = (e, l, r) => {
            switch (t.helper.tooltip.close(), (a = t.helper.template.overlay(e, l)).overlay.data("info", r || {}), this.setCloseButtonLabel("infos" === e ? "close" : "cancel"), e) {
                case "delete":
                    n(r);
                    break;
                case "edit":
                    t.helper.entry.isSeparator(r.id) ? s(r) : d(r);
                    break;
                case "infos":
                    m(r);
                    break;
                case "add":
                    p(r);
                    break;
                case "hide":
                    h(r);
                    break;
                case "openChildren":
                    c(r);
                    break;
                case "checkBookmarks":
                    t.helper.linkchecker.run(a.modal, r.children);
                    break;
                case "keyboardShortcuts":
                    o(r);
                    break;
                case "shareInfoDesc":
                    i(r)
            }
            a.modal.find("input").length() > 0 && a.modal.find("input")[0].focus(), t.helper.keyboard.initOverlayEvents(a.overlay), w()
        }, this.performAction = () => {
            const l = a.overlay.data("info");
            switch (a.modal.attr(e.attr.type)) {
                case "delete":
                    b(l);
                    break;
                case "hide":
                    g(l);
                    break;
                case "openChildren":
                    u(l);
                    break;
                case "edit":
                    t.helper.entry.isSeparator(l.id) ? v(l) : k(l);
                    break;
                case "add":
                    C(l)
            }
        }, this.closeOverlay = () => {
            t.helper.utility.triggerEvent("overlayClosed"), t.elm.bookmarkBox.all.find("li." + e.cl.drag.isDragged).remove(), a.overlay.removeClass(e.cl.page.visible), t.helper.scroll.focus(), e.delay(400).then(() => {
                a.overlay.remove()
            })
        }, this.setCloseButtonLabel = (l = "close") => {
            a.buttonWrapper.children("a." + e.cl.close).text(t.helper.i18n.get("overlay_" + l))
        }, this.isOpened = () => e("iframe#" + e.opts.ids.page.overlay).length() > 0;
        const l = l => {
                if (l.additionalInfo && l.additionalInfo.desc) {
                    const r = e("<div />").addClass(e.cl.info).appendTo(a.modal);
                    e("<h3 />").text(t.helper.i18n.get("overlay_bookmark_additional_info")).appendTo(r), e("<p />").text(l.additionalInfo.desc).appendTo(r)
                }
            },
            r = (l, r) => {
                const o = e("<" + (l.isDir ? "span" : "a") + " />").attr("title", l.title).addClass(e.cl.overlay.preview).text(l.title).appendTo(a.modal);
                l.isDir ? o.prepend("<span class='" + e.cl.sidebar.dirIcon + "' />") : e.opts.demoMode ? o.prepend("<span class='" + e.cl.sidebar.dirIcon + "' data-color='" + (Math.floor(10 * Math.random()) + 1) + "' />") : t.helper.model.call("favicon", {
                    url: l.url
                }).then(e => {
                    e.img && o.prepend("<img src='" + e.img + "' />")
                }), r && !0 === r && !0 !== l.isDir && e("<a />").addClass(e.cl.overlay.previewUrl).attr("title", l.url).text(l.url).insertAfter(o)
            },
            o = () => {
                const l = e("<div />").addClass(e.cl.scrollBox.wrapper).appendTo(a.modal),
                    r = e("<div />").append("<h3>" + t.helper.i18n.get("settings_open_action") + "</h3>").appendTo(l);
                e("<a />").text(t.helper.i18n.get("settings_keyboard_shortcut_button")).appendTo(r).on("click", e => {
                    e.preventDefault(), t.helper.model.call("openLink", {
                        href: "chrome://extensions/shortcuts",
                        newTab: !0,
                        active: !0
                    })
                });
                const o = e("<ul />").appendTo(r),
                    i = {
                        tab: "&#8633;",
                        shift: "&#8679;",
                        cmd: "&#8984;",
                        enter: "&#9166;"
                    };
                Object.entries({
                    tab: ["tab"],
                    enter: ["enter"],
                    shift_enter: ["shift", "enter"],
                    ctrl_c: [navigator.platform.indexOf("Mac") > -1 ? "cmd" : "ctrl", "c"],
                    del: ["del"],
                    esc: ["esc"]
                }).forEach(([a, l]) => {
                    l = l.map(e => {
                        let a = "<i>";
                        return a += t.helper.i18n.get("keyboard_shortcuts_key_" + e) || e, i[e] && (a += " " + i[e]), a += "</i>"
                    }), e("<li />").append("<strong>" + l.join("+") + "</strong>").append("<span>" + t.helper.i18n.get("keyboard_shortcuts_" + a + "_desc") + "</span>").appendTo(o)
                }), this.setCloseButtonLabel("close")
            },
            i = l => {
                a.modal.attr(e.attr.value, l.type);
                const r = e("<div />").addClass(e.cl.scrollBox.wrapper).appendTo(a.modal);
                "activity" === l.type ? (e("<p />").html(t.helper.i18n.get("contribute_share_activity_desc1")).appendTo(r), e("<p />").html(t.helper.i18n.get("contribute_share_activity_examples_intro")).appendTo(r), e("<ul />").append("<li>" + t.helper.i18n.get("contribute_share_activity_example_1") + "</li>").append("<li>" + t.helper.i18n.get("contribute_share_activity_example_2") + "</li>").append("<li>" + t.helper.i18n.get("contribute_share_activity_example_3") + "</li>").append("<li>" + t.helper.i18n.get("contribute_share_activity_example_4") + "</li>").append("<li>" + t.helper.i18n.get("contribute_share_activity_example_5") + "</li>").appendTo(r), e("<p />").html(t.helper.i18n.get("contribute_share_activity_desc2")).appendTo(r)) : "config" === l.type && e("<p />").html(t.helper.i18n.get("contribute_share_config_desc")).appendTo(r), this.setCloseButtonLabel("close")
            },
            n = o => {
                e("<p />").text(t.helper.i18n.get("overlay_delete_" + (o.isDir ? "dir" : "bookmark") + "_confirm")).appendTo(a.modal), r(o), l(o), e("<a />").addClass(e.cl.overlay.action).text(t.helper.i18n.get("overlay_delete")).appendTo(a.buttonWrapper)
            },
            s = l => {
                const r = e("<ul />").appendTo(a.modal),
                    o = l.title.replace(/'/g, "&#x27;").replace(/(^[-_]+|[-_]+$)/g, "").trim();
                e("<li />").html("<span>" + t.helper.i18n.get("overlay_separator_title_desc") + "</span>").appendTo(r), e("<li />").append("<label>" + t.helper.i18n.get("overlay_bookmark_title") + "</label>").append("<input type='text' name='title' value='" + o + "' />").appendTo(r), e("<a />").addClass(e.cl.overlay.action).text(t.helper.i18n.get("overlay_save")).appendTo(a.buttonWrapper)
            },
            d = l => {
                r(l);
                const o = e("<ul />").appendTo(a.modal);
                e("<li />").append("<label>" + t.helper.i18n.get("overlay_bookmark_title") + "</label>").append("<input type='text' name='title' value='" + l.title.replace(/'/g, "&#x27;") + "' />").appendTo(o), l.isDir || e("<li />").append("<label>" + t.helper.i18n.get("overlay_bookmark_url") + "</label>").append("<input type='text' name='url' value='" + l.url.replace(/'/g, "&#x27;") + "' />").appendTo(o);
                const i = e("<li />").addClass(e.cl.info).append("<label>" + t.helper.i18n.get("overlay_bookmark_additional_info") + "</label>").appendTo(o),
                    n = e("<textarea name='info' />").appendTo(i);
                n[0].value = l.additionalInfo && l.additionalInfo.desc || "", i.append("<span>" + t.helper.i18n.get("settings_not_synced") + "</span>"), n.on("focus", () => {
                    i.addClass(e.cl.active)
                }).on("blur", () => {
                    i.removeClass(e.cl.active)
                }), e("<a />").addClass(e.cl.overlay.action).text(t.helper.i18n.get("overlay_save")).appendTo(a.buttonWrapper)
            },
            c = l => {
                const o = l.children.filter(e => e.url && "about:blank" !== e.url),
                    i = t.helper.i18n.get("overlay_confirm_open_children", [o.length]);
                e("<p />").text(i).appendTo(a.modal), r(l), e("<a />").addClass(e.cl.overlay.action).text(t.helper.i18n.get("overlay_open_children")).appendTo(a.buttonWrapper)
            },
            h = o => {
                e("<p />").text(t.helper.i18n.get("overlay_hide_" + (o.isDir ? "dir" : "bookmark") + "_confirm")).appendTo(a.modal), r(o), l(o), e("<a />").addClass(e.cl.overlay.action).text(t.helper.i18n.get("overlay_hide_from_sidebar")).appendTo(a.buttonWrapper)
            },
            p = l => {
                const r = e("<a />").addClass(e.cl.overlay.action).text(t.helper.i18n.get("overlay_save")).appendTo(a.buttonWrapper),
                    o = e("<menu />").attr(e.attr.name, "select").appendTo(a.modal),
                    i = {
                        bookmark: e("<a />").attr(e.attr.type, "bookmark").attr("title", t.helper.i18n.get("overlay_label_bookmark")).appendTo(o),
                        dir: e("<a />").attr(e.attr.type, "dir").attr("title", t.helper.i18n.get("overlay_label_dir")).appendTo(o),
                        separator: e("<a />").attr(e.attr.type, "separator").attr("title", t.helper.i18n.get("overlay_label_separator")).appendTo(o)
                    };
                o.on("mouseleave", t => {
                    e(t.currentTarget).children("a").removeClass(e.cl.hover)
                }), o.children("a").on("mouseenter", t => {
                    o.children("a").removeClass(e.cl.hover), e(t.currentTarget).addClass(e.cl.hover)
                }).on("mouseleave", t => {
                    e(t.currentTarget).removeClass(e.cl.hover)
                }).on("click", i => {
                    i.preventDefault();
                    const n = e(i.currentTarget).attr(e.attr.type),
                        s = e("<ul />").attr(e.attr.type, n).appendTo(a.modal);
                    let d = "",
                        c = "";
                    if ("bookmark" === n && (e(document).find("head > title").length() > 0 && (d = e(document).find("head > title").eq(0).text().trim()), c = location.href), l && l.values && (d = (l.values.title || "").trim(), c = (l.values.url || "").trim()), s.append("<li><h2>" + e(i.currentTarget).attr("title") + "</h2></li>"), "separator" === n && s.append("<li><span>" + t.helper.i18n.get("overlay_separator_title_desc") + "</span></li>"), s.append("<li><label>" + t.helper.i18n.get("overlay_bookmark_title") + "</label><input type='text' name='title' value='" + d.replace(/'/g, "&#x27;") + "' /></li>"), "bookmark" === n && s.append("<li><label>" + t.helper.i18n.get("overlay_bookmark_url") + "</label><input type='text' name='url' value='" + c.replace(/'/g, "&#x27;") + "'  /></li>"), !l.values || void 0 === l.values.index) {
                        s.append("<li><label>" + t.helper.i18n.get("overlay_add_position") + "</label><select name='position'> <option value='append'>" + t.helper.i18n.get("overlay_add_position_append") + "</option> <option value='prepend'>" + t.helper.i18n.get("overlay_add_position_prepend") + "</option></select></li>");
                        const e = t.helper.model.getData("b/newEntryPosition");
                        s.find("select[name='position'] > option[value='" + e + "']").length() > 0 && (s.find("select[name='position']")[0].value = e)
                    }
                    o.addClass(e.cl.hidden), o.children("a").removeClass(e.cl.hover), e.delay(l && l.values ? 0 : 100).then(() => {
                        s.addClass(e.cl.visible), s.find("input")[0].focus(), r.addClass(e.cl.visible)
                    })
                }), l.overlayType && i[l.overlayType] ? i[l.overlayType].trigger("click") : l && l.values && i.bookmark.trigger("click")
            },
            m = o => {
                r(o, !0);
                const i = t.helper.entry.getParentsById(o.id);
                if (i.length > 0) {
                    const t = e("<ul />").addClass(e.cl.sidebar.breadcrumb).appendTo(a.modal);
                    i.forEach(a => {
                        e("<li />").text(a.title).prependTo(t)
                    })
                }
                l(o);
                const n = e("<ul />").appendTo(a.modal),
                    s = new Date(o.dateAdded);
                if (e("<li />").html(t.helper.i18n.get("overlay_bookmark_created_date") + " " + t.helper.i18n.getLocaleDate(s)).appendTo(n), o.isDir) {
                    const a = e("<li />").addClass(e.cl.tooltip.wrapper).append("<span>" + o.childrenAmount.total + "</span>").append(" " + t.helper.i18n.get("overlay_dir_children"), !1).appendTo(n);
                    e("<ul />").append("<li>" + o.childrenAmount.bookmarks + " " + t.helper.i18n.get("overlay_dir_children_bookmarks") + "</li>").append("<li>" + o.childrenAmount.directories + " " + t.helper.i18n.get("overlay_dir_children_dirs") + "</li>").appendTo(a)
                }
                const d = e("<li />").addClass(e.cl.tooltip.wrapper).append("<span>" + o.views.total + "</span>").append(" " + t.helper.i18n.get("overlay_bookmark_views" + (1 === o.views.total ? "_single" : "")), !1).appendTo(n),
                    c = new Date(o.views.startDate);
                e("<ul />").append("<li>" + t.helper.i18n.get("overlay_bookmark_views_since") + " " + t.helper.i18n.getLocaleDate(c) + "</li>").append("<li>" + o.views.perMonth + " " + t.helper.i18n.get("overlay_bookmark_views" + (1 === o.views.perMonth ? "_single" : "")) + " " + t.helper.i18n.get("overlay_bookmark_views_per_month") + "</li>").appendTo(d)
            },
            u = e => {
                this.closeOverlay();
                const a = e.children.filter(e => e.url && "about:blank" !== e.url);
                t.helper.utility.openAllBookmarks(a)
            },
            g = e => {
                t.startLoading(), this.closeOverlay();
                const a = t.helper.model.getData("u/hiddenEntries");
                a[e.id] = !0, t.helper.model.setData({
                    "u/hiddenEntries": a
                }).then(() => Promise.all([t.helper.model.call("removeCache", {
                    name: "htmlList"
                }), t.helper.model.call("removeCache", {
                    name: "htmlPinnedEntries"
                })])).then(() => {
                    t.helper.model.call("reload", {
                        type: "Hide"
                    })
                })
            },
            b = a => {
                this.closeOverlay(), t.elm.bookmarkBox.all.find("a[" + e.attr.id + "='" + a.id + "']").parent("li").remove(), t.helper.bookmark.performDeletion(a)
            },
            f = t => {
                const l = a.modal.find("input[name='title']").removeClass(e.cl.error),
                    r = a.modal.find("input[name='url']").removeClass(e.cl.error),
                    o = a.modal.find("select[name='position']"),
                    i = a.modal.find("textarea[name='info']"),
                    n = {
                        errors: !1,
                        values: {
                            title: l[0].value.trim(),
                            url: t ? null : r[0].value.trim(),
                            position: o.length() > 0 && o[0].value || null,
                            additionalInfo: i.length() > 0 && i[0].value || null
                        }
                    };
                return 0 === n.values.title.length && (l.addClass(e.cl.error), n.errors = !0), t || 0 !== n.values.url.length || (r.addClass(e.cl.error), n.errors = !0), null !== n.values.url && 0 !== n.values.url.search(/^\w+\:/) && (n.values.url = "http://" + n.values.url), n
            },
            v = e => {
                const l = a.modal.find("input[name='title']")[0].value.trim();
                t.helper.bookmark.editEntry({
                    id: e.id,
                    title: l.length > 0 ? "---- " + l + " ----" : "----------",
                    url: "about:blank"
                }).then(() => {
                    t.helper.model.call("reload", {
                        type: "Edit"
                    }), this.closeOverlay()
                })
            },
            k = l => {
                const r = f(l.isDir);
                !1 === r.errors && t.helper.bookmark.editEntry({
                    id: l.id,
                    title: r.values.title,
                    url: r.values.url,
                    additionalInfo: r.values.additionalInfo
                }).then(([l]) => {
                    l.error ? a.modal.find("input[name='url']").addClass(e.cl.error) : (t.helper.model.call("reload", {
                        type: "Edit"
                    }), this.closeOverlay())
                })
            },
            y = (a, l) => {
                if ("prepend" === l) return 0;
                return t.elm.bookmarkBox.all.find("ul > li > a[" + e.attr.id + "='" + a + "'] + ul").children("li").length()
            },
            x = e => {
                const l = a.modal.find("input[name='title']")[0].value.trim(),
                    r = a.modal.find("select[name='position'")[0].value,
                    o = e.id || null;
                t.helper.model.call("createBookmark", {
                    title: l.length > 0 ? "---- " + l + " ----" : "----------",
                    url: "about:blank",
                    parentId: e.id || null,
                    index: y(o, r)
                }).then(() => {
                    this.closeOverlay()
                })
            },
            C = l => {
                if ("separator" === a.modal.children("ul").attr(e.attr.type)) x(l);
                else {
                    const r = f(0 === a.modal.find("input[name='url']").length());
                    if (!1 === r.errors) {
                        const o = {
                            title: r.values.title,
                            url: r.values.url,
                            parentId: l.id || null,
                            index: 0
                        };
                        l && l.values ? (l.values.index && (o.index = l.values.index), l.values.parentId && (o.parentId = l.values.parentId)) : o.index = y(o.parentId, r.values.position), t.helper.model.call("createBookmark", o).then(t => {
                            t.error ? a.modal.find("input[name='url']").addClass(e.cl.error) : this.closeOverlay()
                        })
                    }
                }
            },
            w = () => {
                let l = null;
                a.overlay.find("body").on("mousedown", e => {
                    l = e.target
                }).on("click", e => {
                    "BODY" === e.target.tagName && "BODY" === l.tagName && this.closeOverlay()
                }), a.modal.find("a." + e.cl.close).on("click", e => {
                    e.preventDefault(), this.closeOverlay()
                }), a.modal.on("click", "a." + e.cl.overlay.action, e => {
                    e.preventDefault(), this.performAction()
                }), a.modal.on("focus", "input", t => {
                    e(t.currentTarget).removeClass(e.cl.error)
                }), a.modal.find("a." + e.cl.overlay.preview + ", a." + e.cl.overlay.previewUrl).on("click", e => {
                    e.preventDefault(), t.helper.utility.openUrl(a.overlay.data("info"), "newTab")
                })
            }
    }, e.ScrollHelper = function (t) {
        let a = +new Date;
        const l = {},
            r = [];
        let o = 0;
        this.init = () => {
            const e = t.helper.model.getData("b/scrollBarHide");
            o = 1e3 * +e
        }, this.add = (t, a) => {
            const l = e("<div id='" + t + "' class='" + e.cl.scrollBox.wrapper + "' tabindex='0' />").insertBefore(a);
            return a = a.appendTo(l), l.data({
                list: a
            }), r.push(l), d(l), l
        }, this.focus = () => {
            t.elm.iframe.hasClass(e.cl.page.visible) && null !== t.elm.iframe[0].contentDocument && t.helper.toggle.sidebarHoveredOnce() && t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']")[0] !== t.elm.iframe[0].contentDocument.activeElement && r.forEach(t => {
                t.hasClass(e.cl.active) && t[0].focus()
            })
        }, this.restoreScrollPos = a => new Promise(l => {
            const r = t.helper.model.getData(["b/rememberState", "u/scrollPos"]);
            "all" === r.rememberState || "openStatesAndPos" === r.rememberState ? (this.setScrollPos(a, r.scrollPos), e.delay(100).then(l)) : l()
        }), this.setScrollPos = (e, t, a = 0) => {
            if (0 === a) e[0].scrollTop = t, this.update(e);
            else {
                const l = e[0].scrollTop;
                let r = 0;
                const o = () => {
                    const i = (r += 1 / 60) / (a / 1e3),
                        n = Math.sin(i * (Math.PI / 2));
                    i < 1 ? (window.requestAnimationFrame(o), e[0].scrollTop = l + (t - l) * n) : (e[0].scrollTop = t, this.update(e))
                };
                o()
            }
        }, this.getScrollPos = e => e[0].scrollTop, this.update = a => {
            t.helper.contextmenu.close(), t.helper.tooltip.close();
            const r = s(a),
                d = i(a),
                c = a[0].scrollTop;
            a.attr("id") === e.opts.ids.sidebar.bookmarkBox.all && n(c), c > 10 ? a.addClass(e.cl.scrollBox.scrolled) : a.removeClass(e.cl.scrollBox.scrolled);
            const h = a.data("lastPos") || 0;
            c > h ? a.attr(e.attr.direction, "down") : c < h ? a.attr(e.attr.direction, "up") : a.removeAttr(e.attr.direction), a.data("lastPos", c), (d - c < 2 * r || d === c && 0 === r) && a.trigger(e.opts.events.scrollBoxLastPart), o > 0 && (t.elm.iframe.hasClass(e.cl.page.visible) ? (a.removeClass(e.cl.scrollBox.hideScrollbar), clearTimeout(l[a.attr("id")]), l[a.attr("id")] = setTimeout(() => {
                a.addClass(e.cl.scrollBox.hideScrollbar)
            }, o)) : a.addClass(e.cl.scrollBox.hideScrollbar)), this.focus()
        };
        const i = t => {
                let a = 0;
                return t.children().forEach(t => {
                    a += e(t).realHeight(!0)
                }), a
            },
            n = e => {
                !1 === t.refreshRun && (clearTimeout(l._scrollPos), +new Date - a > 500 ? (a = +new Date, t.helper.model.setData({
                    "u/scrollPos": e
                })) : l._scrollPos = setTimeout(() => {
                    n(e)
                }, 500))
            },
            s = e => e.realHeight() - parseInt(e.css("padding-top")),
            d = e => {
                e.on("scroll", () => {
                    this.update(e)
                })
            }
    }, e.SearchHelper = function (t) {
        let a = null;
        this.init = () => {
            i()
        }, this.isResultsVisible = () => t.elm.bookmarkBox.search.hasClass(e.cl.active), this.clearSearch = () => new Promise(a => {
            t.helper.contextmenu.close(), t.helper.tooltip.close(), t.elm.header.removeClass(e.cl.sidebar.searchVisible), this.update("").then(a)
        }), this.showSearchField = () => {
            t.helper.contextmenu.close(), t.helper.tooltip.close(), t.elm.header.addClass(e.cl.sidebar.searchVisible), t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']")[0].focus()
        }, this.update = (a = null) => new Promise(r => {
            const i = t.elm.header.find("div." + e.cl.sidebar.searchBox + " > input[type='text']");
            null === a ? a = i[0].value : i[0].value = a, a && a.length > 0 ? l(i, a).then(r) : o(i).then(r)
        });
        const l = (a, l) => new Promise(o => {
                t.elm.bookmarkBox.all.removeClass(e.cl.active).removeClass(e.cl.scrollBox.scrolled), t.elm.bookmarkBox.search.addClass(e.cl.active), t.helper.scroll.focus(), t.helper.list.updateSortFilter(), l !== a.data("lastVal") && (t.startLoading(), a.data("lastVal", l), t.helper.entry.initOnce().then(() => (t.helper.scroll.setScrollPos(t.elm.bookmarkBox.search, 0), r(l))).then(a => {
                    t.elm.bookmarkBox.search.children("p").remove();
                    let l = !1;
                    const r = t.elm.bookmarkBox.search.children("ul");
                    r.text(""), a.length > 0 && (l = t.helper.list.addBookmarkDir(a, r, !1)), !1 === l && e("<p />").text(t.helper.i18n.get("sidebar_search_no_results")).appendTo(t.elm.bookmarkBox.search), t.endLoading(100), o()
                }))
            }),
            r = e => new Promise(a => {
                const l = e.toLowerCase(),
                    r = [];
                t.helper.model.call("searchBookmarks", {
                    searchVal: e
                }).then(e => {
                    const o = e.bookmarks || [];
                    o.forEach(e => {
                        r.push(e.id)
                    }), t.helper.entry.getAllDataByType("directories").forEach((e, t) => {
                        e.title.toLowerCase().indexOf(l) > -1 && (e.index = -1e3 + t, o.push(e), r.push(e.id))
                    });
                    const i = t.helper.model.getData("u/additionalInfo");
                    Object.entries(i).forEach(([e, a]) => {
                        if (a && a.desc && a.desc.toLocaleLowerCase().indexOf(l) > -1 && -1 === r.indexOf(e)) {
                            const a = t.helper.entry.getDataById(e);
                            a.isDir && (a.index = -1e3 + a.index), o.push(a)
                        }
                    }), a(o)
                })
            }),
            o = a => new Promise(l => {
                a.removeData("lastVal"), this.isResultsVisible() && (t.startLoading(), t.elm.bookmarkBox.all.addClass(e.cl.active), t.elm.bookmarkBox.search.removeClass([e.cl.active, e.cl.scrollBox.scrolled]), t.elm.bookmarkBox.search.removeAttr(e.attr.direction), t.helper.scroll.restoreScrollPos(t.elm.bookmarkBox.all), t.helper.scroll.focus(), t.endLoading()), t.helper.list.updateSortFilter(), l()
            }),
            i = () => {
                t.elm.header.on("click", "a." + e.cl.sidebar.search, e => {
                    e.preventDefault(), e.stopPropagation(), this.showSearchField()
                }), t.elm.header.on("click", "a." + e.cl.sidebar.searchClose, e => {
                    e.preventDefault(), e.stopPropagation(), this.clearSearch()
                }), t.elm.header.on("keyup", "div." + e.cl.sidebar.searchBox + " > input[type='text']", e => {
                    e.preventDefault(), a && (clearTimeout(a), a = null), a = setTimeout(() => {
                        this.update()
                    }, 300)
                }).on("keydown", "div." + e.cl.sidebar.searchBox + " > input[type='text']", e => {
                    if (e.key && "ENTER" === e.key.toUpperCase()) {
                        const a = t.elm.bookmarkBox.search.find("> ul > li");
                        1 === a.length() && t.helper.sidebarEvents.handleEntryClick(a.eq(0).children("a"), {
                            ctrlKey: e.ctrlKey || e.metaKey
                        })
                    }
                })
            }
    }, e.SidebarEventsHelper = function (t) {
        let a = null,
            l = null,
            r = !1,
            o = null;
        const i = 150,
            n = 600;
        this.init = async () => {
            o = t.helper.model.getData("b/sidebarPosition"), d(), s(), c(), h(), "premium" === t.helper.model.getUserType() && p()
        }, this.handleEntryClick = (a, l) => {
            const r = t.helper.entry.getDataById(a.attr(e.attr.id));
            if (!r) return !1;
            const o = t.helper.model.getData(["b/newTab", "b/linkAction"]),
                i = 2 === l.which || l.ctrlKey || l.metaKey;
            if (r.isDir && !a.hasClass(e.cl.sidebar.dirAnimated))
                if (i) {
                    const e = r.children.filter(e => e.url && "about:blank" !== e.url);
                    e.length > t.helper.model.getData("b/openChildrenWarnLimit") ? t.helper.overlay.create("openChildren", t.helper.i18n.get("contextmenu_open_children"), r) : t.helper.utility.openAllBookmarks(e)
                } else t.helper.list.toggleBookmarkDir(a);
            else if (!r.isDir)
                if (r.reopenSidebar = t.helper.model.getData("b/reopenSidebar"), i) {
                    const e = l.shiftKey || "background" === o.newTab && "newtab" === o.linkAction;
                    t.helper.utility.openUrl(r, "newTab", e)
                } else "newtab" === o.linkAction ? t.helper.utility.openUrl(r, "newTab", "foreground" === o.newTab) : t.helper.utility.openUrl(r, "default", !0)
        };
        const s = async () => {
            t.elm.filterBox.on("click", "a[" + e.attr.direction + "]", a => {
                a.preventDefault();
                const l = "ASC" === e(a.target).attr(e.attr.direction) ? "DESC" : "ASC";
                t.helper.list.updateDirection(l)
            }).on("click", "div." + e.cl.checkbox.box + " + a", t => {
                t.preventDefault(), e(t.target).prev("div[" + e.attr.name + "]").trigger("click")
            })
        }, d = async () => {
            Object.values(t.elm.bookmarkBox).forEach((l, o) => {
                const i = [l];
                0 === o && i.push(t.elm.pinnedBox), e(i).on("click mousedown", "> ul a", a => {
                    a.preventDefault();
                    const l = e(a.target);
                    l.hasClass(e.cl.drag.trigger) || l.hasClass(e.cl.sidebar.separator) || l.parent().hasClass(e.cl.sidebar.removeMask) || !(1 === a.which && "click" === a.type || 2 === a.which && "mousedown" === a.type || t.refreshRun) || this.handleEntryClick(e(a.currentTarget), a)
                }).on("dblclick", "> ul a", a => {
                    const l = e(a.currentTarget),
                        r = a => {
                            e.delay().then(() => {
                                a.next("ul").find("> li > a." + e.cl.sidebar.bookmarkDir + ":not(." + e.cl.sidebar.dirOpened + ")").forEach(a => {
                                    t.helper.list.toggleBookmarkDir(e(a), !1, !1).then(() => {
                                        r(e(a))
                                    })
                                })
                            })
                        };
                    l.hasClass(e.cl.sidebar.bookmarkDir) && !l.hasClass(e.cl.sidebar.dirOpened) && r(l)
                }).on("mouseover", "> ul a", r => {
                    if (!1 === t.helper.overlay.isOpened()) {
                        const o = e(r.currentTarget),
                            i = o.attr(e.attr.id);
                        l.find("a." + e.cl.hover).removeClass(e.cl.hover), l.find("a." + e.cl.sidebar.lastHover).removeClass(e.cl.sidebar.lastHover), o.hasClass(e.cl.sidebar.mark) || o.addClass([e.cl.hover, e.cl.sidebar.lastHover]), a && clearTimeout(a), a = setTimeout(() => {
                            l.find("a[" + e.attr.id + "='" + i + "']").removeClass(e.cl.sidebar.mark)
                        }, 500), t.helper.tooltip.create(o)
                    }
                }).on("contextmenu", "> ul a", a => {
                    a.preventDefault();
                    let l = "list";
                    e(a.target).hasClass(e.cl.sidebar.separator) && (l = "separator"), e(a.currentTarget).removeClass(e.cl.sidebar.mark), t.helper.contextmenu.create(l, e(a.currentTarget))
                }).on("mouseleave", a => {
                    t.helper.tooltip.close(), e(a.currentTarget).find("a." + e.cl.hover).removeClass(e.cl.hover)
                }).on("click", "span." + e.cl.sidebar.removeMask + " > span", a => {
                    a.preventDefault();
                    const l = e(a.target).parents("a").eq(0);
                    !1 === r && (r = !0, t.helper.bookmark.restoreEntry(l).then(() => {
                        r = !1
                    }))
                }).on("mouseover", "> a[" + e.attr.name + "='add']", a => {
                    a.preventDefault(), l.find("a." + e.cl.hover).removeClass(e.cl.hover), t.helper.tooltip.close()
                }).on("click", "> a[" + e.attr.name + "='add']", a => {
                    a.preventDefault();
                    const l = t.elm.bookmarkBox.all.children("ul > li > a").eq(0).attr(e.attr.id);
                    t.helper.overlay.create("add", t.helper.i18n.get("contextmenu_add"), t.helper.entry.getDataById(l))
                })
            })
        }, c = async () => {
            const a = () => {
                    l && clearTimeout(l)
                },
                r = () => {
                    a(), l = setTimeout(() => {
                        t.elm.lockPinned.removeClass(e.cl.active), t.helper.toggle.removeSidebarHoverClass()
                    }, 500)
                };
            t.elm.pinnedBox.on("mouseenter", () => {
                a(), t.elm.lockPinned.addClass(e.cl.active)
            }).on("mouseleave", () => {
                r()
            }), t.elm.lockPinned.on("mouseenter", () => {
                a()
            }).on("mouseleave", () => {
                r()
            }).on("click", a => {
                a.preventDefault(), a.stopPropagation(), t.elm.lockPinned.toggleClass(e.cl.sidebar.fixed), t.elm.pinnedBox.toggleClass(e.cl.sidebar.fixed);
                const l = t.elm.pinnedBox.hasClass(e.cl.sidebar.fixed);
                t.helper.model.setData({
                    "u/lockPinned": l
                }).then(() => {
                    !1 === l && (t.helper.scroll.setScrollPos(t.elm.bookmarkBox.all, 0, 200), t.elm.lockPinned.removeClass(e.cl.active)), t.helper.toggle.removeSidebarHoverClass(), t.helper.list.updateSortFilter()
                })
            })
        }, h = async () => {
            window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
                t.helper.model.call("reloadIcon")
            }), t.elm.iframe.find("body").on("click", () => {
                t.helper.contextmenu.close(), t.helper.tooltip.close()
            }), e(document).on(e.opts.events.premiumPurchased, a => {
                a.detail && a.detail.licenseKey && (e(document).off(e.opts.events.premiumPurchased), t.helper.model.call("activatePremium", {
                    licenseKey: a.detail.licenseKey
                }))
            }).on(e.opts.events.showFeedbackForm, () => {
                e("div[data-name='blockbyte-extension']").removeAttr("data-name"), t.helper.model.call("openLink", {
                    href: chrome.extension.getURL("html/settings.html#feedback"),
                    newTab: !1
                })
            }), e(t.elm.iframe[0].contentDocument).on(e.opts.events.checkboxChanged, a => {
                const l = a.detail.checkbox.attr(e.attr.name);
                if ("viewAsTree" === l || "mostViewedPerMonth" === l) t.helper.model.setData({
                    ["u/" + l]: a.detail.checked
                }).then(() => {
                    t.startLoading(), t.helper.model.call("reload", {
                        scrollTop: !0,
                        type: "Sort"
                    })
                });
                else if ("config" === l || "activity" === l) {
                    let a = !0;
                    t.elm.iframeBody.find("div#" + e.opts.ids.sidebar.shareInfo + " input[type='checkbox']").forEach(l => {
                        const r = e(l).parent();
                        if (!1 === t.helper.checkbox.isChecked(r)) return a = !1, !1
                    }), a && e.delay(300).then(() => {
                        u()
                    })
                }
            }), chrome.extension.onMessage.removeListener(m), chrome.extension.onMessage.addListener(m), ["menu", "sort"].forEach(a => {
                t.elm.header.on("click contextmenu", "a." + e.cl.sidebar[a], l => {
                    l.preventDefault(), l.stopPropagation(), t.helper.contextmenu.create(a, e(l.currentTarget))
                })
            }), t.elm.iframeBody.on("click", "#" + e.opts.ids.sidebar.reloadInfo + " a", e => {
                e.preventDefault(), location.reload(!0)
            }), t.elm.iframeBody.on("click", "#" + e.opts.ids.sidebar.shareInfo + " a", a => {
                a.preventDefault();
                const l = e(a.currentTarget).data("title");
                l ? t.helper.overlay.create("shareInfoDesc", l, {
                    type: e(a.currentTarget).data("type")
                }) : u()
            }), t.elm.iframeBody.on("click", "#" + e.opts.ids.sidebar.infoBox + " a", a => {
                if (a.preventDefault(), t.elm.iframeBody.find("#" + e.opts.ids.sidebar.infoBox).removeClass(e.cl.visible), e(a.currentTarget).hasClass(e.cl.info)) {
                    let l = null;
                    switch (e(a.currentTarget).attr(e.attr.type)) {
                        case "premium":
                            l = "html/settings.html#premium";
                            break;
                        case "translation":
                            l = "html/settings.html#language_translate"
                    }
                    l && t.helper.model.call("openLink", {
                        href: chrome.extension.getURL(l),
                        newTab: !0
                    })
                }
            })
        }, p = async () => {
            t.elm.widthDrag.on("mousemove", () => {
                t.elm.widthDrag.addClass(e.cl.hover)
            }).on("mouseleave", () => {
                t.elm.widthDrag.removeClass(e.cl.hover)
            }).on("mousedown", () => {
                t.helper.contextmenu.close(), t.helper.tooltip.close(), t.helper.toggle.addSidebarHoverClass(), t.elm.widthDrag.addClass(e.cl.drag.isDragged)
            }), t.elm.iframeBody.on("mousemove", a => {
                if (t.elm.widthDrag.hasClass(e.cl.drag.isDragged) && 1 === a.which) {
                    a.preventDefault(), a.stopPropagation();
                    let e = t.elm.widthDrag.data("dragInfo");
                    e || (e = {
                        start: a.clientX,
                        width: t.elm.sidebar.realWidth()
                    }, t.elm.widthDrag.data("dragInfo", e));
                    let l = a.clientX - e.start;
                    "right" === o && (l *= -1), t.helper.toggle.addSidebarHoverClass();
                    let r = e.width + l;
                    r = Math.min(r, n), r = Math.max(r, i), t.elm.sidebar.css("width", r + "px"), t.helper.list.handleSidebarWidthChange()
                }
            }).on("mouseup", () => {
                if (t.elm.widthDrag.data("dragInfo")) {
                    t.elm.widthDrag.removeData("dragInfo");
                    const a = t.helper.model.getData("a/styles");
                    e.delay().then(() => {
                        const l = Math.round(t.elm.sidebar.realWidth());
                        isNaN(l) || (a.sidebarWidth = l + "px", t.helper.model.setData({
                            "a/styles": a
                        }), t.elm.iframe.hasClass(e.cl.page.hideMask) && t.elm.iframe.data("width", l + 50)), t.helper.toggle.removeSidebarHoverClass(), t.elm.widthDrag.removeClass(e.cl.drag.isDragged)
                    })
                }
            })
        }, m = a => {
            if (a && a.action && (null === a.reinitialized || t.initialized > a.reinitialized))
                if ("reload" === a.action) {
                    let l = !0;
                    if (("Removed" === a.type || "Created" === a.type && !0 === r) && Object.values(t.elm.bookmarkBox).some(t => {
                            if (t.hasClass(e.cl.active)) return (t.find("a." + e.cl.sidebar.restored).length() > 0 || t.find("span." + e.cl.sidebar.removeMask).length() > 0) && (l = !1), !0
                        }), l) {
                        let l = 0;
                        a.scrollTop && (t.helper.scroll.setScrollPos(t.elm.bookmarkBox.all, 0), l = 100), t.needsReload = !0, e.delay(l).then(t.reload)
                    }
                } else "toggleSidebar" === a.action && (t.helper.model.call("clearNotWorkingTimeout"), t.elm.iframe.hasClass(e.cl.page.visible) ? t.helper.toggle.closeSidebar() : (t.helper.toggle.setSidebarHoveredOnce(!0), t.helper.toggle.openSidebar()))
        }, u = () => {
            const a = {
                config: !1,
                activity: !1
            };
            t.elm.iframeBody.find("div#" + e.opts.ids.sidebar.shareInfo + " input[type='checkbox']").forEach(l => {
                const r = e(l).parent(),
                    o = r.attr(e.attr.name);
                a[o] = t.helper.checkbox.isChecked(r)
            }), t.helper.model.call("updateShareInfo", a), t.elm.iframeBody.find("div#" + e.opts.ids.sidebar.shareInfo).addClass(e.cl.hidden)
        }
    }, e.StylesheetHelper = function (t) {
        let a = {},
            l = "",
            r = !1;
        this.init = e => {
            e && e.defaultVal && !0 === e.defaultVal && (r = !0), a = t.helper.model.getData("a/styles", r), l = t.helper.model.getData("u/customCss")
        }, this.addStylesheets = (o, i = null) => new Promise(n => {
            null === i ? i = e(document) : (t.helper.font.addStylesheet(i, r ? "default" : "config"), e.cl && e.cl.page && !1 === t.helper.model.getData("b/animations") && e.cl.page.noAnimations && i.find("body").addClass(e.cl.page.noAnimations));
            let s = null;
            s = 0 === i.find("head").length() ? i.find("body") : i.find("head");
            let d = 0;
            o.forEach(t => {
                e.xhr(chrome.extension.getURL("css/" + t + ".css")).then(r => {
                    if (r.response) {
                        let o = r.response;
                        o += l, Object.keys(a).forEach(e => {
                            o = o.replace(new RegExp('"?%' + e + '"?', "g"), a[e])
                        }), e.cl && e.cl.page && e.cl.page.style && e.attr && e.attr.name ? (s.find("style." + e.cl.page.style + "[" + e.attr.name + "='" + t + "']").remove(), s.append("<style class='" + e.cl.page.style + "' " + e.attr.name + "='" + t + "'>" + o + "</style>")) : s.append("<style>" + o + "</style>")
                    }++d >= o.length && n()
                })
            })
        })
    }, e.TemplateHelper = function (t) {
        this.loading = () => e('<svg class="loading" width="36px" height="36px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke-width="3" stroke-linecap="round" cx="18" cy="18" r="16"></circle></svg>'), this.overlay = (a, l) => {
            const r = {},
                o = t.helper.model.getData(["b/animations", "a/darkMode", "a/highContrast"]);
            r.overlay = e("<iframe />").attr("id", e.opts.ids.page.overlay).addClass("notranslate").appendTo("body"), t.helper.stylesheet.addStylesheets(["overlay"], r.overlay);
            const i = r.overlay.find("body");
            i.parent("html").attr("dir", t.helper.i18n.isRtl() ? "rtl" : "ltr"), r.modal = e("<div />").attr(e.attr.type, a).addClass(e.cl.overlay.modal).appendTo(i), !1 === o.animations && r.overlay.addClass(e.cl.page.noAnimations), o.darkMode ? i.addClass(e.cl.page.darkMode) : o.highContrast && i.addClass(e.cl.page.highContrast);
            const n = e("<header />").appendTo(r.modal);
            return e("<h1 />").text(l).appendTo(n), e("<a />").addClass(e.cl.close).appendTo(n), r.buttonWrapper = e("<menu />").addClass(e.cl.overlay.buttonWrapper).appendTo(r.modal), e("<a />").addClass(e.cl.close).appendTo(r.buttonWrapper), r.overlay[0].focus(), e.delay(100).then(() => {
                r.modal.addClass(e.cl.visible), r.overlay.addClass(e.cl.page.visible)
            }), r
        }
    }, e.ToggleHelper = function (t) {
        const a = {},
            l = {};
        let r = 0,
            o = !1,
            i = !1,
            n = null,
            s = null,
            d = null,
            c = null,
            h = null,
            p = null,
            m = null,
            u = null,
            g = null;
        this.init = async () => {
            t.elm.indicator = e("<div />").attr("id", e.opts.ids.page.indicator).appendTo("body"), !1 === t.helper.model.getData("b/animations") && t.elm.indicator.addClass(e.cl.page.noAnimations), document.activeElement && (g = document.activeElement);
            const l = t.helper.model.getData(["b/toggleArea", "b/preventPageScroll", "a/showIndicator", "a/showIndicatorIcon", "a/styles", "b/sidebarPosition", "b/openDelay", "b/openAction", "b/preventWindowed", "b/dndOpen", "n/autoOpen", "u/performReopening"]);
            Object.entries(l.toggleArea).forEach(([e, t]) => {
                a[e] = +t
            }), r = 1e3 * +l.openDelay, n = l.sidebarPosition, d = l.preventPageScroll, c = l.preventWindowed, s = l.dndOpen, t.elm.indicator.css({
                width: b() + "px",
                height: a.height + "%",
                top: a.top + "%"
            }), 100 === a.height && t.elm.indicator.addClass(e.cl.page.fullHeight), t.elm.iframe.attr(e.attr.position, n), t.elm.sidebar.attr(e.attr.position, n), l.styles && (l.styles.indicatorWidth && (h = parseInt(l.styles.indicatorWidth)), l.styles.sidebarWidth && (p = parseInt(l.styles.sidebarWidth))), l.showIndicator && "icon" !== l.openAction && "mousemove" !== l.openAction && (t.elm.indicator.html("<div />").attr(e.attr.position, n), l.showIndicatorIcon && e("<span />").appendTo(t.elm.indicator.children("div")), e.delay(50).then(() => {
                t.elm.indicator.addClass(e.cl.page.visible)
            })), C(), f();
            const o = k();
            (("newtab_website" === o || "newtab_replacement" === o || "newtab_fallback" === o) && l.autoOpen || l.performReopening) && (this.openSidebar(), t.helper.model.setData({
                "u/performReopening": !1
            })), !1 === v() && t.elm.iframe.addClass(e.cl.page.hideMask)
        }, this.closeSidebar = () => {
            t.elm.sidebar.hasClass(e.cl.sidebar.permanent) || (x("close"), x("open"), t.helper.contextmenu.close(), t.helper.tooltip.close(), t.helper.dragndrop.cancel(), t.elm.iframe.removeClass(e.cl.page.visible), e("body").removeClass(e.cl.page.noscroll), e(document).trigger("mousemove.bs"), g && "function" == typeof g.focus && g.focus())
        }, this.openSidebar = () => {
            !1 === t.helper.utility.isBackgroundConnected() ? (t.elm.iframe.addClass(e.cl.page.visible), t.addReloadMask()) : (t.helper.model.call("infoToDisplay").then(a => {
                a && a.info ? "shareInfo" === a.info ? t.addShareInfoMask() : "premium" !== a.info && "translation" !== a.info || t.addInfoBox(a.info) : t.elm.sidebar.find("#" + e.opts.ids.sidebar.shareInfo).remove()
            }), t.elm.sidebar.hasClass(e.cl.sidebar.openedOnce) || (t.elm.sidebar.addClass(e.cl.sidebar.openedOnce), t.helper.list.handleSidebarWidthChange(), this.markLastUsed()), t.elm.iframe.hasClass(e.cl.page.visible) || t.helper.model.call("track", {
                name: "action",
                value: {
                    name: "sidebar",
                    value: k()
                }
            }), t.elm.iframe.addClass(e.cl.page.visible), t.initImages(), d && e("body").addClass(e.cl.page.noscroll), e.delay(t.helper.model.getData("b/animations") ? 300 : 0).then(() => t.helper.entry.initOnce()).then(() => {
                t.helper.scroll.focus()
            }), e(document).trigger("mousemove.bs"), t.helper.utility.triggerEvent("sidebarOpened"))
        }, this.markLastUsed = () => {
            const a = t.helper.model.getData(["u/lastOpened", "b/rememberState"]);
            if ("all" === a.rememberState && a.lastOpened) {
                const l = t.elm.bookmarkBox.all.find("ul > li > a[" + e.attr.id + "='" + a.lastOpened + "']");
                l && l.length() > 0 && (l.addClass(e.cl.sidebar.mark), t.helper.model.setData({
                    "u/lastOpened": null
                }))
            }
        }, this.sidebarHoveredOnce = () => i, this.setSidebarHoveredOnce = () => {
            i = !0
        }, this.addSidebarHoverClass = () => {
            t.elm.iframe.addClass(e.cl.page.hover), t.elm.iframe.css("width", ""), i = !0
        }, this.removeSidebarHoverClass = () => {
            const a = t.elm.iframeBody.find("div." + e.cl.contextmenu.wrapper),
                l = t.elm.iframeBody.find("div." + e.cl.tooltip.wrapper);
            if (!(0 !== a.length() || 0 !== l.length() || t.elm.iframeBody.hasClass(e.cl.drag.isDragged) || t.elm.widthDrag.hasClass(e.cl.drag.isDragged) || t.elm.widthDrag.hasClass(e.cl.hover) || t.elm.lockPinned.hasClass(e.cl.active))) {
                t.elm.iframe.removeClass(e.cl.page.hover);
                const a = t.elm.iframe.data("width");
                a && t.elm.iframe.css("width", a + "px")
            }
        };
        const b = () => t.helper.utility.isWindowed() ? c ? 0 : a.widthWindowed : a.width,
            f = async () => {
                e(document).on("focus", "input,textarea", e => {
                    g = e.target
                }, {
                    capture: !0
                }), e(window).on("resize.bs", () => {
                    t.elm.indicator.css("width", b() + "px")
                }), t.elm.iframe.find("body").on("click", a => {
                    if (a.clientX) {
                        let l = a.clientX;
                        const r = t.elm.sidebar.realWidth();
                        "right" === n && (l = v() ? window.innerWidth - l + (p || r) - 1 : t.elm.iframe.realWidth() - l), l > r && t.elm.iframe.hasClass(e.cl.page.visible) && !1 === t.elm.widthDrag.hasClass(e.cl.drag.isDragged) && this.closeSidebar()
                    }
                }), e(document).on(e.opts.events.openSidebar + ".bs", () => {
                    this.openSidebar()
                }), e(document).on("mousedown.bs click.bs", a => {
                    a.isTrusted && t.elm.iframe.hasClass(e.cl.page.visible) && this.closeSidebar()
                }), e(window).on("keydown.bs", () => {
                    u = +new Date
                }).on("keyup.bs", () => {
                    u = null
                }), t.elm.sidebar.on("mouseleave", a => {
                    if ((a.toElement || a.relatedTarget) && (e.delay(100).then(() => {
                            this.removeSidebarHoverClass()
                        }), !1 === t.helper.overlay.isOpened() && !1 === t.elm.iframeBody.hasClass(e.cl.drag.isDragged) && !1 === t.elm.widthDrag.hasClass(e.cl.drag.isDragged))) {
                        const a = t.helper.model.getData("b/closeTimeout"); - 1 != +a && (l.close = setTimeout(() => {
                            !1 === t.elm.iframeBody.hasClass(e.cl.drag.isDragged) && !1 === t.elm.widthDrag.hasClass(e.cl.drag.isDragged) && this.closeSidebar()
                        }, 1e3 * +a))
                    }
                }).on("mouseenter", () => {
                    this.addSidebarHoverClass(), x("close")
                }), e(document).on("visibilitychange.bs", () => {
                    document.hidden && !1 === t.helper.overlay.isOpened() && (t.elm.indicator.removeClass(e.cl.page.hover), t.elm.iframe.hasClass(e.cl.page.visible) && this.closeSidebar())
                }).on("mouseleave.bs", () => {
                    x("open"), x("indicator"), t.elm.indicator.removeClass(e.cl.page.hover)
                }).on("mousemove.bs", a => {
                    if (a.isTrusted && y(a.clientX, a.clientY)) {
                        const a = +new Date - (m || 0);
                        l.indicator || (l.indicator = setTimeout(() => {
                            t.elm.indicator.addClass(e.cl.page.hover)
                        }, Math.max(r - a, 0)))
                    } else x("indicator"), t.elm.indicator.removeClass(e.cl.page.hover)
                }, {
                    passive: !0
                });
                const a = t.helper.model.getData("b/openAction");
                "icon" !== a && e(document).on(a + ".bs dragover.bs", e => {
                    let t = !1;
                    if ("dragover" === e.type) {
                        const a = e.dataTransfer,
                            l = a && a.types && (a.types.indexOf ? -1 !== a.types.indexOf("text/plain") : a.types.contains("text/plain"));
                        t = s && l
                    } else t = "mousedown" !== e.type || 0 === e.button;
                    e.isTrusted && t && y(e.clientX, e.clientY) ? (e.stopPropagation(), e.preventDefault(), "mousemove" === a ? l.open || (l.open = setTimeout(() => {
                        this.openSidebar()
                    }, r)) : (0 === r || null === m || +new Date - m > r) && this.openSidebar()) : x("open")
                })
            }, v = () => {
                const e = k(),
                    a = t.helper.model.getData("a/styles"),
                    l = t.helper.model.getData("n/autoOpen"),
                    r = a.sidebarMaskColor || null;
                return !(("newtab_website" === e || "newtab_replacement" === e || "newtab_fallback" === e) && l || "onboarding" === e || "transparent" === r)
            }, k = () => {
                const e = location.href;
                let t = "other",
                    a = !1;
                return Object.entries({
                    newtab_default: ["https?://www\\.google\\..+/_/chrome/newtab"],
                    newtab_fallback: [chrome.extension.getURL("html/newtab.html") + ".*[?&]type=\\w+"],
                    newtab_replacement: [chrome.extension.getURL("html/newtab.html")],
                    newtab_website: [".*[?&]bs_nt=1(&|#|$)"],
                    website: ["https?://"],
                    onboarding: ["chrome\\-extension://.*/intro.html"],
                    chrome: ["chrome://"],
                    extension: ["chrome\\-extension://"],
                    local: ["file://"]
                }).some(([l, r]) => {
                    if (r.some(r => {
                            if (0 === e.search(new RegExp(r, "gi"))) return t = l, a = !0, !0
                        }), a) return !0
                }), t
            }, y = (l, r) => {
                let i = !1;
                if (c && t.helper.utility.isWindowed());
                else if (document.fullscreen || document.webkitIsFullScreen);
                else if (null !== u && +new Date - u < 500);
                else if (null != l && (l > 0 || r > 0 || o)) {
                    o = !0, "right" === n && (l = window.innerWidth - l - 1);
                    const s = {
                        w: b(),
                        h: r / window.innerHeight * 100
                    };
                    t.elm.indicator.hasClass(e.cl.page.hover) && h > s.w && (s.w = h), i = l < s.w && s.h >= a.top && s.h <= a.top + a.height
                }
                return !1 === i ? m = null : null === m && (m = +new Date), i
            }, x = e => {
                l[e] && (clearTimeout(l[e]), l[e] = null)
            }, C = async () => {
                e(e.opts.leftsideBackSelector).length() > 0 ? t.elm.indicator.addClass(e.cl.page.hasLeftsideBack) : e(document).on(e.opts.events.lsbLoaded + ".bs", a => {
                    a.detail.showIndicator && t.elm.indicator.addClass(e.cl.page.hasLeftsideBack)
                })
            }
    }, e.TooltipHelper = function (t) {
        let a = {},
            l = {};
        this.init = async () => {
            l = t.helper.model.getData(["b/tooltipContent", "b/tooltipAdditionalInfo", "b/tooltipDelay", "b/sidebarPosition"]);
            const e = t.helper.model.getData("a/styles");
            l.scrollBarWidth = +e.scrollBarWidth.replace("px", "")
        }, this.create = n => {
            const s = n.attr(e.attr.id);
            if (s && !1 === t.helper.entry.isSeparator(s)) {
                t.helper.toggle.addSidebarHoverClass(), i(s);
                const d = t.elm.iframeBody.find("div." + e.cl.tooltip.wrapper + "[" + e.attr.id + "='" + s + "']");
                if (d.length() > 0) 0 !== d[0].getBoundingClientRect().top && d.addClass(e.cl.visible);
                else if (-1 != +l.tooltipDelay) {
                    const i = t.helper.entry.getDataById(s);
                    if (i) {
                        const d = e("<div />").addClass(e.cl.tooltip.wrapper).attr(e.attr.id, s).appendTo(t.elm.iframeBody);
                        r(d, i), a[s] && (clearTimeout(a[s]), a[s] = null), a[s] = setTimeout(() => {
                            d.addClass(e.cl.visible), d.css("top", n[0].getBoundingClientRect().top + n.realHeight() / 2 - d.realHeight() / 2 + "px"), o(d, n)
                        }, 1e3 * +l.tooltipDelay)
                    }
                }
            } else i()
        }, this.close = () => {
            i()
        };
        const r = (a, r) => {
                if ("all" !== l.tooltipContent && "title" !== l.tooltipContent || e("<h3 />").text(r.title).appendTo(a), r.isDir ? e("<span />").text(r.children.length + " " + t.helper.i18n.get("sidebar_dir_children")).appendTo(a) : "all" !== l.tooltipContent && "url" !== l.tooltipContent || e("<span />").text(r.url).appendTo(a), t.helper.search.isResultsVisible()) {
                    const l = t.helper.entry.getParentsById(r.id);
                    if (l.length > 0) {
                        const t = e("<ul />").addClass(e.cl.sidebar.breadcrumb).appendTo(a);
                        l.forEach(a => {
                            e("<li />").text(a.title).prependTo(t)
                        })
                    }
                }
                if (l.tooltipAdditionalInfo && r.additionalInfo && r.additionalInfo.desc) {
                    const t = r.additionalInfo.desc.replace(/\n/g, "<br />");
                    e("<p />").html(t).appendTo(a)
                }
            },
            o = (e, a) => {
                const r = t.helper.i18n.isRtl(),
                    o = {
                        l: t.elm.sidebar.realWidth() - l.scrollBarWidth,
                        r: a.realWidth() + 10
                    };
                "right" === l.sidebarPosition ? e.css("right", o[r ? "l" : "r"] + "px") : e.css("left", o[r ? "r" : "l"] + "px")
            },
            i = (l = null) => {
                Object.values(a).forEach(e => {
                    e && clearTimeout(a[e])
                }), a = {};
                const r = t.elm.iframeBody.find("div." + e.cl.tooltip.wrapper + (l ? ":not([" + e.attr.id + "='" + l + "'])" : ""));
                let o = !1;
                r.forEach(t => {
                    if (e(t).hasClass(e.cl.visible)) return o = !0, !1
                }), r.removeClass(e.cl.visible), e.delay(o ? 300 : 0).then(() => {
                    r.remove(), t.helper.toggle.removeSidebarHoverClass()
                })
            }
    }, e.UtilityHelper = function (t) {
        this.openUrl = async (e, a = "default", l = !0) => {
            "about:blank" !== e.url && (e.url.startsWith("javascript:") && (location.href = e.url), t.helper.model.setData({
                "u/lastOpened": e.id,
                "u/performReopening": l && e.reopenSidebar || !1
            }), "incognito" === a ? await t.helper.model.call("openLink", {
                href: e.url,
                incognito: !0
            }) : "newWindow" === a ? await t.helper.model.call("openLink", {
                href: e.url,
                newWindow: !0
            }) : await t.helper.model.call("openLink", {
                parentId: e.parentId,
                id: e.id,
                href: e.url,
                newTab: "newTab" === a,
                position: t.helper.model.getData("b/newTabPosition"),
                active: l
            }))
        }, this.openAllBookmarks = async e => {
            const a = t.helper.model.getData("b/newTabPosition");
            "afterCurrent" !== a && "beforeFirst" !== a || e.reverse();
            for (const t of e) await this.openUrl(t, "newTab", !1)
        }, this.isBackgroundConnected = () => {
            try {
                const e = chrome.runtime.connect();
                if (e) return e.disconnect(), !0
            } catch (e) {}
            return !1
        }, this.triggerEvent = (t, a = {}, l = null) => {
            (l || document).dispatchEvent(new CustomEvent(e.opts.events[t], {
                detail: a,
                bubbles: !0,
                cancelable: !1
            }))
        }, this.copyToClipboard = a => {
            const l = e("<textarea />").text(a).appendTo(t.elm.iframeBody);
            l[0].select();
            let r = !1;
            try {
                r = t.elm.iframe[0].contentDocument.execCommand("copy")
            } catch (e) {}
            return l.remove(), r
        }, this.isUrlOnBlacklist = e => {
            if (!e || 0 === e.trim().length) return !0;
            let t = !1;
            return ["about:", "https?://192.168.", "192.168.", "https?://localhost", "localhost", "https?://127.0.0.", "127.0.0.", "javascript:", "file://", "chrome://", "chrome-extension://"].some(a => {
                if (0 === e.search(new RegExp(a, "gi"))) return t = !0, !0
            }), t
        }, this.getSortList = () => ({
            custom: {
                dir: "ASC"
            },
            alphabetical: {
                dir: "ASC"
            },
            mostUsed: {
                dir: "DESC"
            },
            recentlyUsed: {
                dir: "DESC"
            },
            recentlyAdded: {
                dir: "DESC"
            }
        }), this.sortEntries = (e, a) => {
            if (e.length > 1) {
                const l = t.helper.i18n.getLocaleSortCollator(),
                    r = (t, l) => {
                        e.sort((e, r) => {
                            const o = !!e.children,
                                i = !!r.children;
                            return "custom" !== a.name && o !== i ? o ? -1 : 1 : (t === a.dir ? 1 : -1) * l(e, r)
                        })
                    };
                switch (a.name) {
                    case "custom":
                        r("ASC", (e, t) => e.index - t.index);
                        break;
                    case "alphabetical":
                        r("ASC", (e, t) => l.compare(e.title, t.title));
                        break;
                    case "recentlyAdded":
                        r("DESC", (e, t) => t.dateAdded - e.dateAdded);
                        break;
                    case "mostUsed": {
                        const e = t.helper.model.getData("u/mostViewedPerMonth");
                        r("DESC", (a, r) => {
                            const o = t.helper.entry.getDataById(a.id),
                                i = t.helper.entry.getDataById(r.id),
                                n = o ? o.views[e ? "perMonth" : "total"] : 0,
                                s = i ? i.views[e ? "perMonth" : "total"] : 0;
                            return n === s ? l.compare(a.title, r.title) : s - n
                        });
                        break
                    }
                    case "recentlyUsed":
                        r("DESC", (e, a) => {
                            const r = t.helper.entry.getDataById(e.id),
                                o = t.helper.entry.getDataById(a.id),
                                i = r ? r.views.lastView : 0,
                                n = o ? o.views.lastView : 0;
                            return i === n ? l.compare(e.title, a.title) : n - i
                        })
                }
            }
        }, this.isWindowed = () => {
            return window.screenX > 100 || window.screenY > 50 || Math.abs(window.screen.availWidth - window.innerWidth) > 50 || window.navigator && window.navigator && window.navigator.userAgent && window.navigator.userAgent && window.navigator.userAgent.search(/[\/\s-_]mobile[\/\s-_]/i) > -1
        }
    };
    (new function () {
        const t = Math.floor(99999 * Math.random()) + 1e4;
        let a = {},
            l = null,
            r = !1;
        this.initialized = null, this.refreshRun = !0, this.isDev = !1, this.elm = {}, this.needsReload = !1, this.state = null, this.run = () => {
            e("html").attr(e.attr.uid, t), this.isDev = "Dev" === e.opts.manifest.version_name || !("update_url" in e.opts.manifest);
            const a = d();
            i(), e(document).on("visibilitychange.bs", () => {
                !0 !== document.hidden && (null === this.initialized ? o() : this.needsReload && this.reload())
            }, {
                capture: !1
            }), o(!1 === a)
        };
        const o = (e = !1) => {
            !1 !== r || !e && !0 === document.hidden || (r = !0, this.helper.model.init().then(() => {
                n() ? this.helper.i18n.init().then(() => (this.helper.font.init(), this.helper.stylesheet.init(), this.helper.stylesheet.addStylesheets(["content"]))).then(() => c()).then(() => this.helper.stylesheet.addStylesheets(["sidebar"], this.elm.iframe)).then(() => {
                    this.elm.iframe && this.elm.iframe[0] && (this.elm.iframeBody.parent("html").attr("dir", this.helper.i18n.isRtl() ? "rtl" : "ltr"), this.helper.toggle.init(), this.helper.list.init(), this.helper.scroll.init(), this.helper.tooltip.init(), this.helper.sidebarEvents.init(), this.helper.dragndrop.init(), this.helper.keyboard.init(), "" === document.referrer && this.helper.model.call("addViewAmount", {
                        url: location.href
                    }))
                }) : (chrome.extension.onMessage.addListener(e => {
                    e && e.action && "toggleSidebar" === e.action && this.helper.model.call("setNotWorkingReason", {
                        reason: this.state
                    })
                }), this.log("Don't load sidebar for url '" + location.href + "'"))
            }))
        };
        this.reload = () => {
            !1 === r && !1 === document.hidden && (this.needsReload = !1, r = !0, this.helper.model.init().then(() => Promise.all([this.helper.i18n.init(), this.helper.entry.init()])).then(() => this.helper.list.updateBookmarkBox()).then(() => {
                this.helper.search.update()
            }))
        }, this.log = e => {
            if (this.isDev) {
                const t = ["padding: 0 0 5px 0", "font-size:90%", "color:#666"].join(";");
                console.log("%c[] %cBookmark Sidebar %c-> %c" + e, t, t + ";color:#30bfa9;font-weight:bold", t + ";color:#000;font-weight:bold", t)
            }
        }, this.loaded = () => {
            if (!this.elm.iframeBody.hasClass(e.cl.sidebar.extLoaded)) {
                const t = this.helper.model.getData(["b/animations", "b/toggleArea", "a/showIndicator"]);
                this.elm.iframeBody.addClass(e.cl.sidebar.extLoaded), this.helper.list.updateSidebarHeader(), this.helper.search.init(), this.elm.iframe.hasClass(e.cl.page.visible) && this.helper.toggle.markLastUsed(), !0 === t.animations && this.elm.iframe.removeClass(e.cl.page.noAnimations), s(), this.initialized = +new Date, this.state = "loaded", this.log("Finished loading in " + (this.initialized - this.updateBookmarkBoxStart) + "ms"), this.log("User type: " + this.helper.model.getUserType()), this.helper.utility.triggerEvent("loaded", {
                    config: {
                        toggleArea: t.toggleArea,
                        showIndicator: t.showIndicator
                    },
                    elm: {
                        iframe: this.elm.iframe,
                        sidebar: this.elm.sidebar
                    },
                    helper: this.helper
                })
            }
            r = !1
        }, this.startLoading = () => {
            this.elm.sidebar.addClass(e.cl.loading), a.timeout && clearTimeout(a.timeout), void 0 !== a.loader && 0 !== a.loader.length() || (a.loader = this.helper.template.loading().appendTo(this.elm.sidebar))
        }, this.endLoading = (t = 500) => {
            a.timeout = setTimeout(() => {
                this.elm.sidebar.removeClass(e.cl.loading), a.loader && a.loader.remove(), a = {}
            }, t)
        }, this.initImages = () => {
            e.delay().then(() => {
                this.elm.iframe.hasClass(e.cl.page.visible) && this.elm.sidebar.find("img[" + e.attr.src + "]").forEach(t => {
                    const a = e(t),
                        l = a.attr(e.attr.src);
                    a.removeAttr(e.attr.src), a.attr("src", l)
                })
            })
        }, this.addReloadMask = () => {
            this.elm.sidebar.text("");
            const t = e("<div />").attr("id", e.opts.ids.sidebar.reloadInfo).prependTo(this.elm.sidebar),
                a = e("<div />").prependTo(t);
            e("<p />").html(this.helper.i18n.get("status_background_disconnected_reload_desc")).appendTo(a), e("<a />").text(this.helper.i18n.get("status_background_disconnected_reload_action")).appendTo(a)
        }, this.addInfoBox = t => {
            this.elm.sidebar.find("#" + e.opts.ids.sidebar.infoBox).remove();
            const a = e("<div />").attr("id", e.opts.ids.sidebar.infoBox).prependTo(this.elm.sidebar);
            "premium" === t ? e("<p />").text(this.helper.i18n.get("premium_popup_text")).appendTo(a) : "translation" === t && e("<p />").text(this.helper.i18n.get("settings_translation_incomplete_info")).appendTo(a), e("<a />").text(this.helper.i18n.get("more_link")).addClass(e.cl.info).attr(e.attr.type, t).appendTo(a), e("<a />").text(this.helper.i18n.get("overlay_close")).addClass(e.cl.close).appendTo(a), e.delay(500).then(() => {
                a.addClass(e.cl.visible)
            })
        }, this.addShareInfoMask = () => {
            this.elm.sidebar.find("#" + e.opts.ids.sidebar.shareInfo).remove();
            const t = e("<div />").attr("id", e.opts.ids.sidebar.shareInfo).prependTo(this.elm.sidebar),
                a = e("<div />").prependTo(t);
            e("<h2 />").html(this.helper.i18n.get("contribute_headline")).appendTo(a), e("<p />").html(this.helper.i18n.get("contribute_intro")).appendTo(a), ["config", "activity"].forEach(t => {
                const l = e("<label />").text(this.helper.i18n.get("contribute_share_" + t + "_label")).appendTo(a);
                e("<a />").data({
                    title: l.text(),
                    type: t
                }).appendTo(l), this.helper.checkbox.get(this.elm.iframeBody, {
                    [e.attr.name]: t
                }, "checkbox", "switch").appendTo(a)
            }), e("<a />").text(this.helper.i18n.get("contribute_dismiss")).appendTo(a)
        };
        const i = () => {
                this.helper = {
                    model: new e.ModelHelper(this),
                    toggle: new e.ToggleHelper(this),
                    entry: new e.EntryHelper(this),
                    list: new e.ListHelper(this),
                    scroll: new e.ScrollHelper(this),
                    template: new e.TemplateHelper(this),
                    i18n: new e.I18nHelper(this),
                    font: new e.FontHelper(this),
                    sidebarEvents: new e.SidebarEventsHelper(this),
                    search: new e.SearchHelper(this),
                    stylesheet: new e.StylesheetHelper(this),
                    dragndrop: new e.DragDropHelper(this),
                    checkbox: new e.CheckboxHelper(this),
                    keyboard: new e.KeyboardHelper(this),
                    bookmark: new e.BookmarkHelper(this),
                    overlay: new e.OverlayHelper(this),
                    utility: new e.UtilityHelper(this),
                    contextmenu: new e.ContextmenuHelper(this),
                    tooltip: new e.TooltipHelper(this),
                    linkchecker: new e.Linkchecker(this)
                }
            },
            n = () => {
                let e = !0;
                const t = this.helper.model.getData("b/visibility");
                if ("always" === t || 0 === location.href.indexOf(chrome.extension.getURL("html/newtab.html"))) e = !0;
                else if ("blacklist" === t || "whitelist" === t) {
                    const a = this.helper.model.getData("b/" + t);
                    let l = !1;
                    a.some(e => {
                        e = (e = (e = e.replace(/^https?:\/\//i, "")).replace(/\./g, "\\.")).replace(/\*/g, ".*");
                        const t = new RegExp("^https?://" + e + "$");
                        if (0 === location.href.search(t)) return l = !0, !0
                    }), "blacklist" === t ? !1 === (e = !1 === l) && (this.state = "blacklisted") : "whitelist" === t && !1 === (e = !0 === l) && (this.state = "notWhitelisted")
                }
                return e
            },
            s = () => {
                null !== l && clearTimeout(l), l = setTimeout(() => {
                    const a = e("html").attr(e.attr.uid);
                    void 0 !== a && t !== +a || (0 === e("iframe#" + e.opts.ids.page.iframe).length() ? (this.log("Detected: Sidebar missing from DOM"), d(), o(!0)) : s())
                }, 2e3)
            },
            d = () => {
                let t = !1;
                const a = [];
                ["iframe#" + e.opts.ids.page.iframe, "iframe#" + e.opts.ids.page.overlay, "div#" + e.opts.ids.page.indicator].forEach(t => {
                    a.push(e(t))
                });
                const l = e(a);
                return e(document).off("*.bs"), e(window).off("*.bs"), l.length() > 0 && (l.remove(), t = !0, this.log("Destroyed old instance")), t
            },
            c = async () => {
                const t = this.helper.model.getData(["a/darkMode", "a/highContrast"]);
                this.elm.iframe = e('<iframe id="' + e.opts.ids.page.iframe + '" />').addClass(["notranslate", e.cl.page.noAnimations]).appendTo("body"), this.elm.iframeBody = this.elm.iframe.find("body"), this.elm.sidebar = e('<section id="' + e.opts.ids.sidebar.sidebar + '" />').appendTo(this.elm.iframeBody), this.elm.bookmarkBox = {}, ["all", "search"].forEach(t => {
                    this.elm.bookmarkBox[t] = this.helper.scroll.add(e.opts.ids.sidebar.bookmarkBox[t], e("<ul />").appendTo(this.elm.sidebar))
                }), this.elm.widthDrag = e("<span />").addClass(e.cl.drag.trigger), "premium" === this.helper.model.getUserType() && (this.elm.widthDrag = this.elm.widthDrag.appendTo(this.elm.sidebar)), this.elm.filterBox = e("<div />").addClass(e.cl.sidebar.filterBox).appendTo(this.elm.sidebar), this.elm.pinnedBox = e("<div />").addClass(e.cl.sidebar.entryPinned).prependTo(this.elm.bookmarkBox.all), this.elm.lockPinned = e("<a />").addClass(e.cl.sidebar.lockPinned).html("<span />").appendTo(this.elm.sidebar), this.elm.header = e("<header />").prependTo(this.elm.sidebar), !0 === t.darkMode ? this.elm.iframeBody.addClass(e.cl.page.darkMode) : !0 === t.highContrast && this.elm.iframeBody.addClass(e.cl.page.highContrast), this.helper.utility.triggerEvent("elementsCreated", {
                    elm: {
                        iframe: this.elm.iframe,
                        sidebar: this.elm.sidebar
                    },
                    helper: this.helper
                })
            }
    }).run()
})(jsu);
