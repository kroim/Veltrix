export const DATE_STRING_FORMAT = "mm/dd/yy";
export const TIME_STRING_FORMAT = "hh:MM";
export const DATE_TIME_STRING_FORMAT = "mm/dd/yy hh:MM";

export const date_str_format = function (datetime, format) {
    if (!datetime)
        return '';
    let date = new Date(Date.parse(datetime));
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let hh = date.getHours();
    let MM = date.getMinutes();
    let SS = date.getSeconds();
    let format_str = format;
    if (/yy/.test(format)) {
        format_str = format_str.replace('yy', `${yy}`);
    }
    if (/y/.test(format)) {
        format_str = format_str.replace('y', `${yy}`);
    }
    if (/mm/.test(format)) {
        format_str = format_str.replace('mm', mm < 10 ? `0${mm}` : `${mm}`);
    }
    if (/m/.test(format)) {
        format_str = format_str.replace('m', `${mm}`);
    }
    if (/dd/.test(format)) {
        format_str = format_str.replace('dd', dd < 10 ? `0${dd}` : `${dd}`);
    }
    if (/d/.test(format)) {
        format_str = format_str.replace('d', `${dd}`);
    }
    if (/hh/.test(format)) {
        format_str = format_str.replace('hh', hh < 10 ? `0${hh}` : `${hh}`);
    }
    if (/h/.test(format)) {
        format_str = format_str.replace('h', `${hh}`);
    }
    if (/MM/.test(format)) {
        format_str = format_str.replace('MM', MM < 10 ? `0${MM}` : `${MM}`);
    }
    if (/M/.test(format)) {
        format_str = format_str.replace('M', `${MM}`);
    }
    if (/SS/.test(format)) {
        format_str = format_str.replace('SS', SS < 10 ? `0${SS}` : `${SS}`);
    }
    if (/S/.test(format)) {
        format_str = format_str.replace('S', `${SS}`);
    }
    return format_str;
};
