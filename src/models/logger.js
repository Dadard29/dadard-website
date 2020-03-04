export default class LoggerService {
    messages = [];
    log(msg, color) {
        const d = new Date().toLocaleString();
        const newMessage = {
            msg: msg,
            color: color,
            date: d
        };

        console.log(msg);
        this.messages.push(newMessage)
    }
    info(msg) {
        this.log(msg, 'green');
    }
    error(msg) {
        this.log(msg, 'red');
    }

    warning(msg) {
        this.log(msg, 'yellow');
    }

}