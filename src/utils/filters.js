// 限制文本字数的过滤器
function ellipsis(value,value_length){
    if (!value) return ''
    if (value.length > value_length) {
        return value.slice(0,value_length) + '...'//0:下标,从第一个字开始显示,50:显示字数,多余用...代替
    }
    return value
}

export default {
    ellipsis
}
