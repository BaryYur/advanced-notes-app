export declare class MailService {
    private transporter;
    constructor();
    sendResetCode(to: string, resetCode: number): Promise<void>;
}
