export interface NodeMailerResponse {
    accepted:     string[];
    rejected:     any[];
    ehlo:         string[];
    envelopeTime: number;
    messageTime:  number;
    messageSize:  number;
    response:     string;
    envelope:     Envelope;
    messageId:    string;
}

interface Envelope {
    from: string;
    to:   string[];
}