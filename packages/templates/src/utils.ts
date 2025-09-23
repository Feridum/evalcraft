import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { templates, type TemplateKey } from './template-dictonary';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadTemplate(templatePath: TemplateKey): string {
    try {
        const templateRelativePath = templates[templatePath];
        if (!templateRelativePath) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        const resolvedPath = path.resolve(__dirname, templateRelativePath);
        return fs.readFileSync(resolvedPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}