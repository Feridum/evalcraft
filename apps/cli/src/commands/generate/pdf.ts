import { generatePDFFromTemplate } from '@evalcraft/pdf-generation'
import { loadTemplate, templatesKeys, type TemplateKey } from '@evalcraft/templates'
import { Command, Flags } from '@oclif/core'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'


export class GeneratePdf extends Command {
  static override flags = {
    data: Flags.file({ description: 'path to YAML file with data', char: 'd', required: true, exists: true}),
    customTemplate: Flags.string({ description: 'path to custom template file', char:'c', exclusive: ['template'], exists: true, dependsOn: ['data'] }),
    template: Flags.string({ description: 'name of template file', char:'t', options: templatesKeys, exclusive: ['customTemplate'], dependsOn: ['data'] }),
    output: Flags.string({ description: 'output directory', char: 'o', default: './output' }),
  }
  static override description = 'describe the command here'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  getTemplate(templateKey: TemplateKey | undefined, customTemplatePath: string | undefined): string {
    if (templateKey) {
      return loadTemplate(templateKey);
    } else if (customTemplatePath) {
      return fs.readFileSync(customTemplatePath, 'utf8');
    }

    return ''
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GeneratePdf)

    const file = fs.readFileSync(flags.data, 'utf8')
    const data = YAML.parse(file)

    const template = this.getTemplate(flags.template as TemplateKey | undefined, flags.customTemplate)

    console.log('Using template:\n', template);

    for (const file of data.files){
      console.log(`Generating file: ${file.name} from template:`);

      const templateFileResult = await generatePDFFromTemplate(
       template,
        file.data,
        path.join(flags.output, `${file.name}.pdf`)
      );
    
      if (templateFileResult.success) {
        this.log('✅ Template file PDF generated successfully!');
        this.log(`📁 File saved to: ${templateFileResult.outputPath}`);
      } else {
        this.log('❌ Template file generation failed:', templateFileResult.error);
      }
    }    
  }
}
