

export const templates = {
    'invoice': './financial/invoice-template.hbs'
}

export const templatesKeys = Object.keys(templates);

export type TemplateKey = keyof typeof templates;