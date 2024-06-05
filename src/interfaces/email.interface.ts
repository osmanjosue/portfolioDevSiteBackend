export interface TypeEmail {
    from: string,
    to: string[],
    subject: 'string',
    attachments: EmailAttachment[],
    html?: 'string',
    text?: string,
    cc?: string[],
    bcc?: string[],
}

export interface EmailAttachment {
    fileName: string,
    path: string,
    cid?: string,
}