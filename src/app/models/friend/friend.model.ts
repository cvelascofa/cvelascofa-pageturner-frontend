export interface Friend {

    senderId: number;
    recipientId: number;
    senderEmail?: string;
    senderUsername?: string;
    recipientEmail?: string;
    recipientUsername?: string;
    friendStatus?: 'PENDING' | 'ACCEPTED';

}