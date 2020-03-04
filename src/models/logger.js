export default class LoggerService {
    messages = [];
    limit = 4;
    getLastMessages() {
        if (this.messages.length <= this.limit) {
            return this.messages
        } else {
            return this.messages.slice(
                this.messages.length - this.limit - 1, this.messages.length);
        }
    }
    log(msg, color) {
        const d = new Date().toLocaleString();
        const key = this.messages.length + 1;
        const newMessage = {
            key: key,
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

    debug(msg) {
        this.log(msg, 'grey')
    }

}