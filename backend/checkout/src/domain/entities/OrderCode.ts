export default class OrderCode {
    private code: string;

    constructor (readonly date: Date, sequence: number) {
        if (sequence <= 0) { throw new Error('Invalid sequence')}
        const year = date.getFullYear();
        this.code = `${year}${sequence.toString().padStart(8, '0')}`;
    }

    getCode (): string {
        return this.code;
    }
}