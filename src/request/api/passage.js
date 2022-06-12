import { myaxios2 } from "../http";
export function apiUploadResource(data) {
    return myaxios2({
        url: "/admin/uploadResources?",
        method: "post",
        data,
        responseType: "blob"
    })
}
export function apiDownResource(data) {
    return myaxios2({
        url: "/passage/downResources?",
        method: "post",
        data,
        responseType: "blob"
    })
}
export function apiUploadImg(data) {
    return myaxios2({
        url: "/admin/uploadImg?",
        method: "post",
        data,
        responseType: "blob"
    })
}
export function apiRemoveComment(data) {
    return myaxios2({
        url: "/admin/deleteComment?",
        method: "post",
        data,

    })
} export function apiRemoveResource(data) {
    return myaxios2({
        url: "/admin/deleteResources?",
        method: "post",
        data,

    })
}
