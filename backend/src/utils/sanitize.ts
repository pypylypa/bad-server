import sanitizeHtml from 'sanitize-html';

export const clean = (value: string): string =>
    sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
    })