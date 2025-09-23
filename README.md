# @evalcraft/cli

A simple CLI tool to generate test documents for AI evaluation. Currently supports generating professional PDF invoices from YAML data files.

## 🚀 Installation

Install the package globally from npm:

```bash
npm install -g @evalcraft/cli
```

Or use with npx without installing:

```bash
npx @evalcraft/cli
```

## 📋 Overview

EvalCraft CLI helps you generate professional PDF documents for testing and evaluation purposes. The tool currently supports invoice generation with plans to expand to other document types.

### Current Features
- ✅ **Invoice Generation**: Create professional PDF invoices from YAML data
- ✅ **Template Support**: Built-in templates for consistent formatting
- ✅ **Batch Processing**: Generate multiple documents from a single YAML file
- ✅ **File Output**: Save PDFs to your local directory

## 🔧 Usage

### Basic Command

```bash
evalcraft generate:pdf -d <data-file> -t <template-name>
```

### Available Templates

Currently supported templates:
- `invoice` - Professional invoice template

### Command Options

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--data` | `-d` | Path to YAML file containing document data | ✅ Yes |
| `--template` | `-t` | Name of the template to use | ✅ Yes |

### Example Usage

```bash
# Generate invoices from a YAML file
evalcraft generate:pdf -d ./examples/test.yaml -t invoice

# Using npx (without global installation)
npx @evalcraft/cli generate:pdf -d ./my-data.yaml -t invoice
```

## 📄 YAML Data Format

The CLI expects a YAML file with the following structure:

### Root Structure

```yaml
version: "0.1"
files:
  - name: "document-name"
    data:
      # Document-specific data here
```

### Invoice Template Data

For the `invoice` template, each file entry should contain:

```yaml
version: "0.1"
files:
  - name: "invoice-005"
    data:
      invoice:
        number: "INV-005"
        date: "September 20, 2024"
      
      company:
        name: "My Company LLC"
        address: "123 Business St"
        city: "New York"
        state: "NY"
        zip: "10001"
      
      client:
        name: "John Doe"
        company: "Client Corp"
      
      lineItems:
        - description: "Web Development Services"
          quantity: "1"
          rate: "$2,500.00"
          amount: "$2,500.00"
        - description: "Design & UX Consultation"
          quantity: "2"
          rate: "$750.00"
          amount: "$1,500.00"
      
      totals:
        subtotal: "4,500.00"
        tax: "360.00"
        total: "4,860.00"
```

### Field Descriptions

#### Invoice Section
- `number`: Invoice identifier/number
- `date`: Invoice date (any readable format)

#### Company Section
- `name`: Your company name
- `address`: Street address
- `city`: City name
- `state`: State/Province
- `zip`: Postal/ZIP code

#### Client Section
- `name`: Client contact name
- `company`: Client company name

#### Line Items
An array of invoice line items, each containing:
- `description`: Service or product description
- `quantity`: Quantity (can be text or number)
- `rate`: Unit rate/price
- `amount`: Total amount for this line item

#### Totals Section
- `subtotal`: Subtotal before tax
- `tax`: Tax amount
- `total`: Final total amount

## 📁 Output

Generated PDF files are saved to the `./output/` directory in your current working directory. Each file will be named according to the `name` field in your YAML data with a `.pdf` extension.

Example output:
```
./output/
├── invoice-005.pdf
└── invoice-006.pdf
```

## 📝 Complete Example

Here's a complete example showing how to generate invoice PDFs:

1. **Create a data file** (`my-invoices.yaml`):

```yaml
version: "0.1"
files:
  - name: "monthly-invoice-001"
    data:
      invoice:
        number: "INV-2024-001"
        date: "January 15, 2024"
      
      company:
        name: "Acme Solutions LLC"
        address: "456 Enterprise Blvd"
        city: "San Francisco"
        state: "CA"
        zip: "94105"
      
      client:
        name: "Jane Smith"
        company: "TechCorp Inc."
      
      lineItems:
        - description: "Software Development"
          quantity: "40"
          rate: "$125.00"
          amount: "$5,000.00"
        - description: "Code Review & Testing"
          quantity: "8"
          rate: "$100.00"
          amount: "$800.00"
      
      totals:
        subtotal: "5,800.00"
        tax: "464.00"
        total: "6,264.00"
```

2. **Generate the PDF**:

```bash
evalcraft generate:pdf -d my-invoices.yaml -t invoice
```

3. **Check the output**:

```bash
ls ./output/
# monthly-invoice-001.pdf
```

## ❓ Troubleshooting

### Common Issues

**Error: "File not found"**
- Ensure the YAML file path is correct
- Use absolute paths if relative paths don't work

**Error: "Template not found"**
- Check that you're using a supported template name
- Current options: `invoice`

**Error: "YAML parsing failed"**
- Verify your YAML syntax is correct
- Ensure proper indentation (use spaces, not tabs)
- Check that all required fields are present

**Output directory issues**
- The CLI creates the `./output/` directory automatically
- Ensure you have write permissions in the current directory

### Getting Help

```bash
# Show general help
evalcraft --help

# Show help for the generate:pdf command
evalcraft generate:pdf --help
```

## 🔮 Roadmap

Future enhancements planned:
- Additional document templates (receipts, contracts, reports)
- Custom template support
- Multiple output formats
- Advanced styling options
- Template preview functionality

## 🤝 Contributing

This tool is part of the EvalCraft project for AI evaluation document generation. Contributions are welcome!

## 📄 License

MIT License - see the LICENSE file for details.