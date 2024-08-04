export default interface Mailer {
    send(email: string, subject: string, message: string): Promise<any>;
}